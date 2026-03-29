// Cat Wizard - Area Balancing Script
// Automatically finds stat factors to balance each area.
// Run with: bun run src/rpg/balance.ts [area]
// Apply with: bun run src/rpg/balance.ts [area] --apply
//
// Strategy: search for hpFactor (controls XP cost) and speedFactor (controls ratio)
// separately. attackFactor is derived as sqrt(hpFactor) to keep damage moderate.

import {
	runSimulation,
	getNewEnemiesInArea,
	makeSimulatorEnemies,
	padAreas,
	type State,
	type EnemyStatFactors,
} from "./simulator.ts";
import {areas} from "./areas.ts";
import {EnemyType, getEnemyConfig} from "./enemies/enemyConfig.ts";

// @ts-ignore
import fs from 'fs/promises';

// ============================================================================
// Configuration
// ============================================================================

const XP_TARGETS: Record<number, number> = {2: 200, 3: 250, 4: 300, 5: 350, 6: 400};
const RATIO_TARGET = 2.0;
const RATIO_TOLERANCE = 0.3;
const XP_TOLERANCE = 0.20;
const RUNS = 3;
const LIVES = 20;
const MAX_ITERS = 8;

// ============================================================================
// Simulation
// ============================================================================

interface AreaMetrics {
	ratio: number;
	xpCost: number;
	deaths: number;
}

async function simulateArea(
	targetArea: number,
	hpFactor: number,
	attackFactor: number,
	speedFactor: number,
): Promise<AreaMetrics> {
	const newEnemies = getNewEnemiesInArea(targetArea);
	const factors: EnemyStatFactors = {
		enemyTypes: newEnemies,
		hpFactor,
		attackFactor,
		speedFactor,
	};

	const results: AreaMetrics[] = [];

	for (let run = 0; run < RUNS; run++) {
		let state: State = {xp: 0, area: 0, playerTurns: 0, attackRatios: []};
		let deaths = 0;
		let xpEnteringArea = 0;
		let xpLeavingArea = 0;
		let reached = false;

		for (let life = 1; life <= LIVES; life++) {
			const result = await runSimulation(state, undefined, factors, {
				stopAfterArea: targetArea,
				quietBelowArea: Infinity,
			});

			for (const event of result.events) {
				if (event.event === "death") deaths++;
				if (event.event === "areaChange" && event.newArea === targetArea) {
					xpEnteringArea = event.xp;
				}
				if (event.event === "areaChange" && event.newArea === targetArea + 1) {
					xpLeavingArea = event.xp;
					reached = true;
				}
			}

			state = result.state;
			if (state.area > targetArea) break;
		}

		const areaRatios = state.attackRatios.filter(r => r.area === targetArea);
		let totalHero = 0, totalEnemy = 0;
		for (const r of areaRatios) {
			totalHero += r.heroAttacks;
			totalEnemy += r.enemyNormalizedAttacks;
		}
		const ratio = totalEnemy > 0 ? totalHero / totalEnemy : Infinity;
		const xpCost = reached ? xpLeavingArea - xpEnteringArea : Infinity;

		results.push({ratio, xpCost, deaths});
	}

	// Average finite results
	const finiteRatios = results.filter(r => isFinite(r.ratio));
	const finiteXps = results.filter(r => isFinite(r.xpCost));

	return {
		ratio: finiteRatios.length > 0
			? finiteRatios.reduce((s, r) => s + r.ratio, 0) / finiteRatios.length
			: Infinity,
		xpCost: finiteXps.length > 0
			? finiteXps.reduce((s, r) => s + r.xpCost, 0) / finiteXps.length
			: Infinity,
		deaths: results.reduce((s, r) => s + r.deaths, 0) / results.length,
	};
}

function log(label: string, hp: number, atk: number, spd: number, m: AreaMetrics) {
	const xpStr = isFinite(m.xpCost) ? m.xpCost.toFixed(0) : "FAIL";
	const ratioStr = isFinite(m.ratio) ? m.ratio.toFixed(2) : "∞";
	console.log(`  ${label} hp=${hp.toFixed(2)} atk=${atk.toFixed(2)} spd=${spd.toFixed(2)} -> ratio=${ratioStr}, xp=${xpStr}, deaths=${m.deaths.toFixed(1)}`);
}

// ============================================================================
// Binary search helpers
// ============================================================================

/** Find upper bound by doubling from start until condition is true */
function findUpperBound(start: number, maxVal: number, step: number = 2): number[] {
	const probes = [start];
	let val = start;
	while (val < maxVal) {
		val *= step;
		probes.push(Math.min(val, maxVal));
	}
	return probes;
}

// ============================================================================
// Balance one area
// ============================================================================

async function balanceArea(targetArea: number): Promise<{hpFactor: number, attackFactor: number, speedFactor: number} | null> {
	const xpTarget = XP_TARGETS[targetArea]!;
	const newEnemies = getNewEnemiesInArea(targetArea);

	console.log(`\n========== Area ${targetArea} ==========`);
	console.log(`New enemies: ${newEnemies.join(', ')}`);
	console.log(`Targets: ratio=${RATIO_TARGET}, xp=${xpTarget}`);

	// Step 1: Find hpFactor that gives xp ≈ target
	// attackFactor = sqrt(hpFactor), speedFactor = 1
	console.log(`\n  Step 1: HP search (speed=1, atk=sqrt(hp))`);
	let hpFactor = 1.0;
	{
		let lo = 0.5, hi = 50.0;
		// First, find a rough upper bound
		for (const probe of [1, 2, 4, 8, 16, 32]) {
			const atkF = Math.sqrt(probe);
			const m = await simulateArea(targetArea, probe, atkF, 1.0);
			log(`probe`, probe, atkF, 1.0, m);
			if (isFinite(m.xpCost) && m.xpCost >= xpTarget) {
				hi = probe;
				break;
			}
			if (!isFinite(m.xpCost)) {
				hi = probe;
				break;
			}
			lo = probe;
		}

		// Binary search
		let bestFactor = lo, bestDist = Infinity;
		for (let iter = 0; iter < MAX_ITERS; iter++) {
			const mid = (lo + hi) / 2;
			const atkF = Math.sqrt(mid);
			const m = await simulateArea(targetArea, mid, atkF, 1.0);
			log(`hp`, mid, atkF, 1.0, m);

			if (isFinite(m.xpCost)) {
				const dist = Math.abs(m.xpCost - xpTarget);
				if (dist < bestDist) { bestFactor = mid; bestDist = dist; }
				if (dist <= xpTarget * XP_TOLERANCE) { hpFactor = mid; break; }
			}

			if (!isFinite(m.xpCost) || m.xpCost > xpTarget) {
				hi = mid;
			} else {
				lo = mid;
			}
			hpFactor = bestFactor;
		}
	}

	const attackFactor = Math.sqrt(hpFactor);
	console.log(`  -> hpFactor=${hpFactor.toFixed(3)}, attackFactor=${attackFactor.toFixed(3)}`);

	// Step 2: Find speedFactor for ratio ≈ 2
	console.log(`\n  Step 2: Speed search (hp=${hpFactor.toFixed(2)}, atk=${attackFactor.toFixed(2)})`);
	let speedFactor = 1.0;
	{
		// First check current ratio
		const baseline = await simulateArea(targetArea, hpFactor, attackFactor, 1.0);
		log(`base`, hpFactor, attackFactor, 1.0, baseline);

		if (isFinite(baseline.ratio) && Math.abs(baseline.ratio - RATIO_TARGET) <= RATIO_TOLERANCE) {
			speedFactor = 1.0;
			console.log(`  -> ratio already within tolerance at speed=1`);
		} else {
			let lo = 0.1, hi = 20.0;
			let bestFactor = 1.0, bestDist = Math.abs(baseline.ratio - RATIO_TARGET);

			for (let iter = 0; iter < MAX_ITERS; iter++) {
				const mid = (lo + hi) / 2;
				const m = await simulateArea(targetArea, hpFactor, attackFactor, mid);
				log(`spd`, hpFactor, attackFactor, mid, m);

				if (isFinite(m.ratio)) {
					const dist = Math.abs(m.ratio - RATIO_TARGET);
					if (dist < bestDist) { bestFactor = mid; bestDist = dist; }
					if (dist <= RATIO_TOLERANCE) { speedFactor = mid; break; }
				}

				// Higher speed = more enemy attacks = lower ratio
				if (!isFinite(m.ratio) || m.ratio > RATIO_TARGET) {
					lo = mid;
				} else {
					hi = mid;
				}
				speedFactor = bestFactor;
			}
		}
	}
	console.log(`  -> speedFactor=${speedFactor.toFixed(3)}`);

	// Step 3: Re-check XP with final speed and fine-tune HP if needed
	console.log(`\n  Step 3: Final XP check`);
	{
		const m = await simulateArea(targetArea, hpFactor, attackFactor, speedFactor);
		log(`check`, hpFactor, attackFactor, speedFactor, m);

		if (!isFinite(m.xpCost) || Math.abs(m.xpCost - xpTarget) > xpTarget * XP_TOLERANCE) {
			console.log(`  XP drifted, re-adjusting HP...`);
			let lo = 0.5, hi = 50.0;
			let bestFactor = hpFactor, bestDist = Infinity;

			for (let iter = 0; iter < MAX_ITERS; iter++) {
				const mid = (lo + hi) / 2;
				const atkF = Math.sqrt(mid);
				const m2 = await simulateArea(targetArea, mid, atkF, speedFactor);
				log(`re-hp`, mid, atkF, speedFactor, m2);

				if (isFinite(m2.xpCost)) {
					const dist = Math.abs(m2.xpCost - xpTarget);
					if (dist < bestDist) { bestFactor = mid; bestDist = dist; }
					if (dist <= xpTarget * XP_TOLERANCE) { hpFactor = mid; break; }
				}

				if (!isFinite(m2.xpCost) || m2.xpCost > xpTarget) {
					hi = mid;
				} else {
					lo = mid;
				}
				hpFactor = bestFactor;
			}
		}
	}

	const finalAtkFactor = Math.sqrt(hpFactor);

	// Final verification
	const final = await simulateArea(targetArea, hpFactor, finalAtkFactor, speedFactor);
	console.log(`\n  RESULT: hp=${hpFactor.toFixed(3)}, atk=${finalAtkFactor.toFixed(3)}, speed=${speedFactor.toFixed(3)}`);
	console.log(`    ratio=${isFinite(final.ratio) ? final.ratio.toFixed(2) : '∞'}, xp=${isFinite(final.xpCost) ? final.xpCost.toFixed(0) : 'FAIL'}, deaths=${final.deaths.toFixed(1)}`);

	// Show proposed stats
	const enemies = makeSimulatorEnemies(newEnemies);
	console.log(`\n  Proposed enemy stats:`);
	for (let i = 0; i < newEnemies.length; i++) {
		const e = enemies[i]!;
		const newHp = Math.max(1, Math.floor(e.health * hpFactor));
		const newAtk = Math.max(1, Math.floor(e.attackPower * finalAtkFactor));
		const newSpd = Math.max(1, Math.floor(e.speed * speedFactor));
		console.log(`    ${newEnemies[i]}: hp=${e.health}->${newHp}, atk=${e.attackPower}->${newAtk}, spd=${e.speed}->${newSpd}`);
	}

	return {hpFactor, attackFactor: finalAtkFactor, speedFactor};
}

// ============================================================================
// Apply changes
// ============================================================================

interface FoundFactors {
	area: number;
	hpFactor: number;
	attackFactor: number;
	speedFactor: number;
	newEnemies: EnemyType[];
}

function applyFactorsInMemory(f: FoundFactors) {
	const enemies = makeSimulatorEnemies(f.newEnemies);
	for (let i = 0; i < f.newEnemies.length; i++) {
		const type = f.newEnemies[i]!;
		const e = enemies[i]!;
		const cfg = getEnemyConfig(type);
		cfg.health = Math.max(1, Math.floor(e.health * f.hpFactor));
		cfg.attackPower = Math.max(1, Math.floor(e.attackPower * f.attackFactor));
		cfg.speed = Math.max(1, Math.floor(e.speed * f.speedFactor));
	}
}

async function writeConfigToDisk() {
	const configPath = new URL('./enemies/enemyConfig.json', import.meta.url).pathname;
	const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

	for (const key of Object.keys(config)) {
		const cfg = getEnemyConfig(key as EnemyType);
		if (cfg) {
			config[key].speed = cfg.speed;
			config[key].health = cfg.health;
			config[key].attackPower = cfg.attackPower;
		}
	}

	await fs.writeFile(configPath, JSON.stringify(config, null, '\t') + '\n');
	console.log(`\nWritten to ${configPath}`);
}

// ============================================================================
// Main
// ============================================================================

padAreas();

const args = process.argv.slice(2);
const applyMode = args.includes('--apply');
const areaArg = args.find(a => a !== '--apply');
const targetAreas = areaArg ? [parseInt(areaArg)] : [2, 3, 4, 5, 6];

const allFactors: FoundFactors[] = [];

for (const targetArea of targetAreas) {
	if (!XP_TARGETS[targetArea]) {
		console.error(`No XP target configured for area ${targetArea}`);
		continue;
	}

	const result = await balanceArea(targetArea);
	if (!result) continue;

	const newEnemies = getNewEnemiesInArea(targetArea);
	const found: FoundFactors = {
		area: targetArea,
		...result,
		newEnemies,
	};
	allFactors.push(found);

	// Apply in-memory so next area sims use updated stats
	applyFactorsInMemory(found);
	console.log(`  (Applied area ${targetArea} changes in-memory for subsequent areas)`);
}

if (applyMode && allFactors.length > 0) {
	console.log('\n========== Applying changes ==========');
	await writeConfigToDisk();
} else if (allFactors.length > 0) {
	console.log('\nRun with --apply to write changes to enemyConfig.json');
}
