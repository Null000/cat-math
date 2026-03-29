// Cat Wizard - Battle Simulator
// Text-based simulation using the same battle logic as BattleManager
// Run with: bun run src/rpg/simulator.ts
// Run sweep with: bun run src/rpg/simulator.ts sweep

import {Actor} from "./Actor.ts";
import {BattleManager} from "./BattleManager.ts";
import {EnemyType} from "./enemies/enemyMaker.ts";
import {createSimulatorEnemy} from "./enemies/enemyConfig.ts";
import {Container, Sprite} from "pixi.js";
import {getWizardLevel, Wizard} from "./Wizard.ts";
import {areas} from "./areas.ts";

// @ts-ignore
import fs from 'fs/promises'

// ============================================================================
// Types
// ============================================================================

export type SimEvent =
	| { turn: number; event: "death"; area: number; wave: number; xp: number }
	| { turn: number; event: "levelUp"; newLevel: number; xp: number }
	| { turn: number; event: "areaChange"; newArea: number; xp: number };

export interface EnemyStatFactors {
	enemyTypes: EnemyType[];
	hpFactor: number;
	attackFactor: number;
	speedFactor: number;
}

export interface SimulationResult {
	state: State;
	events: SimEvent[];
}

interface SweepResult {
	hpFactor: number;
	attackFactor: number;
	events: SimEvent[];
	finalXp: number;
	finalArea: number;
	finalPlayerTurns: number;
}

// ============================================================================
// Simulator Factories
// ============================================================================

export function padAreas() {
	const lastArea = areas[areas.length - 1]!;
	for (let i = areas.length; i < 1000; i++) {
		areas.push(lastArea);
	}
}

export function makeSimulatorEnemies(plan: EnemyType[]): Actor[] {
	return plan.map((type) => {
		const enemy = createSimulatorEnemy(type);
		fakeAnimations(enemy);
		return enemy;
	});
}

async function makeSimulatorWizard(xp: number): Promise<Wizard> {
	const wizard = new Wizard(xp);
	fakeAnimations(wizard);
	wizard.castMagic = async () => {};
	wizard.castAreaMagic = async () => {};
	wizard.castMagicMissile = async () => {};
	wizard.castLightningBolt = async () => {};
	wizard.castFireBolt = async () => {};
	wizard.castFrostShard = async () => {};
	wizard.castArcaneBeam = async () => {};
	wizard.castMeteorStrike = async () => {};
	wizard.levelUp = async (xp) => wizard.levelUpStats(xp);

	return wizard;
}

function fakeAnimations(actor: Actor) {
	actor.shake = async () => {
	};
	actor.die = async () => {
	};
	actor.runLeft = async () => {
	};
	actor.twitch = async () => {
	};
}

function applyStatFactors(
	enemies: Actor[],
	plan: EnemyType[],
	factors: EnemyStatFactors,
): void {
	for (let i = 0; i < enemies.length; i++) {
		const enemyType = plan[i];
		if (enemyType !== undefined && factors.enemyTypes.includes(enemyType)) {
			const enemy = enemies[i]!;
			enemy.health = Math.floor(enemy.health * factors.hpFactor);
			enemy.maxHealth = Math.floor(enemy.maxHealth * factors.hpFactor);
			enemy.attackPower = Math.floor(enemy.attackPower * factors.attackFactor);
			enemy.speed = Math.floor(enemy.speed * factors.speedFactor);
		}
	}
}

// ============================================================================
// Main Simulation
// ============================================================================

export interface AreaAttackRatio {
	area: number;
	heroAttacks: number;
	enemyNormalizedAttacks: number;
	ratio: number;
}

export interface State {
	xp: number,
	area: number,
	playerTurns: number,
	attackRatios: AreaAttackRatio[],
}

const stats: {
	area: number;
	wave: number;
	attackPower: number;
	hp: number;
	dead: number;
}[] = [];

export async function runSimulation(
	startState: State,
	planOverride?: EnemyType[],
	statFactors?: EnemyStatFactors,
	options?: { stopAfterArea?: number; quietBelowArea?: number },
): Promise<SimulationResult> {
	const events: SimEvent[] = [];
	const attackRatios: AreaAttackRatio[] = [...startState.attackRatios];
	const stopAfterArea = options?.stopAfterArea;
	const quietBelowArea = options?.quietBelowArea ?? 0;

	const battleManager = new BattleManager(new Container(), startState.xp, startState.area);
	battleManager._makeEnemies = async (x) => {
		const plan = planOverride ?? x;
		const enemies = makeSimulatorEnemies(plan);
		if (statFactors) {
			applyStatFactors(enemies, plan, statFactors);
		}
		return enemies;
	};
	battleManager._makeWizard = makeSimulatorWizard;
	battleManager._makeBackground = async () => new Sprite();

	battleManager.fadeIn = async () => {
	};
	battleManager.fadeOut = async () => {
	};

	await battleManager.init();

	const startPlayerTurns = startState.playerTurns;
	let areaHeroAttacks = 0;
	let areaEnemyNormAttacks = 0;

	for (let i = 0; i < 1000; i++) {
		const dead = await battleManager.doTurns();
		if (dead) {
			// Record partial area ratio on death
			const heroA = battleManager.heroAttacks - areaHeroAttacks;
			const enemyA = battleManager.enemyNormalizedAttacks - areaEnemyNormAttacks;
			if (heroA > 0 || enemyA > 0) {
				attackRatios.push({
					area: battleManager.area,
					heroAttacks: heroA,
					enemyNormalizedAttacks: enemyA,
					ratio: enemyA > 0 ? heroA / enemyA : Infinity,
				});
			}

			events.push({
				turn: i + startPlayerTurns,
				event: "death",
				area: battleManager.area,
				wave: battleManager.wave,
				xp: battleManager.xp,
			});
			if (battleManager.area >= quietBelowArea) {
				console.log(
					"hero died. area: " +
					battleManager.area +
					", wave: " +
					battleManager.wave +
					", turns: " +
					battleManager.turnCounter +
					", userInput: " +
					(i + startPlayerTurns) +
					", xp: " +
					battleManager.xp,
				);
			}
			return {
				state: {
					xp: battleManager.xp,
					area: battleManager.area,
					playerTurns: i + startPlayerTurns,
					attackRatios,
				},
				events,
			};
		}

		stats.push({
			area: battleManager.area,
			wave: battleManager.wave,
			attackPower: battleManager.heroParty[0]!.attackPower,
			hp: battleManager.heroParty[0]!.health,
			dead: dead ? 1 : 0,
		})

		const levelBefore = getWizardLevel(battleManager.xp);
		const areaBefore = battleManager.area;

		await battleManager.correctAnswer();

		const levelAfter = getWizardLevel(battleManager.xp);
		if (levelAfter > levelBefore) {
			events.push({
				turn: i + startPlayerTurns,
				event: "levelUp",
				newLevel: levelAfter,
				xp: battleManager.xp,
			});
		}

		if (battleManager.area > areaBefore) {
			// Record attack ratio for the completed area
			const heroA = battleManager.heroAttacks - areaHeroAttacks;
			const enemyA = battleManager.enemyNormalizedAttacks - areaEnemyNormAttacks;
			attackRatios.push({
				area: areaBefore,
				heroAttacks: heroA,
				enemyNormalizedAttacks: enemyA,
				ratio: enemyA > 0 ? heroA / enemyA : Infinity,
			});
			areaHeroAttacks = battleManager.heroAttacks;
			areaEnemyNormAttacks = battleManager.enemyNormalizedAttacks;

			events.push({
				turn: i + startPlayerTurns,
				event: "areaChange",
				newArea: battleManager.area,
				xp: battleManager.xp,
			});
			if (stopAfterArea !== undefined && battleManager.area > stopAfterArea) {
				return {
					state: {
						xp: battleManager.xp,
						area: battleManager.area,
						playerTurns: i + startPlayerTurns,
						attackRatios,
					},
					events,
				};
			}
		}
	}
	console.error('Simulation did not end');
	return {
		state: { ...startState, attackRatios },
		events: events,
	}
}

// ============================================================================
// Attack Ratio Output
// ============================================================================

function printAttackRatios(ratios: AreaAttackRatio[]) {
	if (ratios.length === 0) return;

	// Merge ratios for the same area (e.g. partial from death + continuation)
	const merged = new Map<number, { hero: number; enemy: number }>();
	for (const r of ratios) {
		const existing = merged.get(r.area);
		if (existing) {
			existing.hero += r.heroAttacks;
			existing.enemy += r.enemyNormalizedAttacks;
		} else {
			merged.set(r.area, { hero: r.heroAttacks, enemy: r.enemyNormalizedAttacks });
		}
	}

	console.log(`\nAttack ratios per area (hero : enemy normalized):`);
	console.log(`${"Area".padStart(5)} ${"Hero".padStart(6)} ${"Enemy".padStart(8)} ${"Ratio".padStart(7)}`);
	for (const [area, data] of [...merged.entries()].sort((a, b) => a[0] - b[0])) {
		const ratio = data.enemy > 0 ? data.hero / data.enemy : Infinity;
		console.log(
			`${String(area).padStart(5)} ${String(data.hero).padStart(6)} ${data.enemy.toFixed(1).padStart(8)} ${ratio.toFixed(1).padStart(7)}`
		);
	}
}

// ============================================================================
// Standard Simulation (original behavior)
// ============================================================================

async function runSimulations() {
	// for (let enemy of [EnemyType.Rat, EnemyType.DireRat, EnemyType.Goblin, EnemyType.Skeleton, EnemyType.Zombie, EnemyType.Bat, EnemyType.Wolf, EnemyType.Treant]) {
	//   console.log('running simulation for ' + enemy);
	//   const result = await runSimulation(0, [enemy]);
	//   console.log('result: ' + result);
	// }

	//make infinite areas
	const lastArea = areas[areas.length - 1]!;
	for (let i = areas.length; i < 1000; i++) {
		areas.push(lastArea)
	}

	const enemiesInArea = new Set<EnemyType>()
	for (let wave of areas[2]!.waves) {
		for (const enemy of wave) {
			enemiesInArea.add(enemy as any);
		}
	}

	try {
		console.log('real simulation');
		let state: State = {xp: 0, area: 0, playerTurns: 0, attackRatios: []};
		for (let i = 1; i <= 20; i++) {
			console.log('life: ' + i)
			const result = await runSimulation(state, undefined, {
				enemyTypes: Array.from(enemiesInArea),
				attackFactor: 1,
				hpFactor: 1,
				speedFactor: 1,
			});
			state = result.state;
		}
		console.log('end ex: ' + state.xp + ', area: ' + state.area + ', turns: ' + state.playerTurns);
		printAttackRatios(state.attackRatios);
	} catch (e) {
		console.log('ex: ' + e);
	}

	const prevAreaSum: number[] = [];
	let currentSum = 0;
	for (let area of areas) {
		prevAreaSum.push(currentSum);
		currentSum += area.waves.length;
	}


	const lines: string[] = [];
	lines.push('turn,area,wave,attackPower,hp,dead')
	for (let i = 0; i < stats.length; i++) {
		const stat = stats[i]!;
		lines.push(`${i},${stat.area},${stat.wave + prevAreaSum[stat.area]!},${stat.attackPower},${stat.hp},${stat.dead}`);
	}
	await fs.writeFile('stats.csv', lines.join('\n'));
}

// ============================================================================
// Factor Sweep
// ============================================================================

function generateFactors(start: number, end: number, step: number): number[] {
	const factors: number[] = [];
	for (let v = start; v <= end + step / 2; v += step) {
		factors.push(Math.round(v * 100) / 100);
	}
	return factors;
}

async function runSweep(enemyTypes: EnemyType[], lives: number): Promise<void> {
	// Pad areas to 1000
	const lastArea = areas[areas.length - 1]!;
	for (let i = areas.length; i < 1000; i++) {
		areas.push(lastArea);
	}

	const hpFactors = generateFactors(0.5, 1.5, 0.1);
	const attackFactors = generateFactors(0.8, 2, 0.2);
	const lockFactors = true;

	const results: SweepResult[] = [];

	for (const hpFactor of hpFactors) {
		for (const attackFactor of lockFactors ? [hpFactor] : attackFactors) {
			console.log(`sweep: hpFactor=${hpFactor}, attackFactor=${attackFactor}`);

			const factors: EnemyStatFactors = {
				enemyTypes,
				hpFactor,
				attackFactor,
				speedFactor: 1,
			};

			let state: State = {xp: 0, area: 0, playerTurns: 0, attackRatios: []};
			const allEvents: SimEvent[] = [];

			for (let life = 1; life <= lives; life++) {
				const result = await runSimulation(state, undefined, factors);
				allEvents.push(...result.events);
				state = result.state;
			}

			results.push({
				hpFactor,
				attackFactor,
				events: allEvents,
				finalXp: state.xp,
				finalArea: state.area,
				finalPlayerTurns: state.playerTurns,
			});
		}
	}

	// Write detailed JSON
	const output = {
		config: {
			enemyTypes,
			hpFactors,
			attackFactors,
			lives,
		},
		results,
	};
	await fs.writeFile('sweep_results.json', JSON.stringify(output, null, 2));

	// Write summary CSV
	const csvLines: string[] = [];
	csvLines.push(
		'hpFactor,attackFactor,totalDeaths,finalArea,finalXp,finalPlayerTurns,firstDeathTurn,levelUpCount,areaChangeCount'
	);
	for (const r of results) {
		const deaths = r.events.filter((e) => e.event === "death");
		const levelUps = r.events.filter((e) => e.event === "levelUp");
		const areaChanges = r.events.filter((e) => e.event === "areaChange");
		const firstDeathTurn = deaths.length > 0 ? deaths[0]!.turn : -1;
		csvLines.push(
			`${r.hpFactor},${r.attackFactor},${deaths.length},${r.finalArea},${r.finalXp},${r.finalPlayerTurns},${firstDeathTurn},${levelUps.length},${areaChanges.length}`
		);

		const eventsToLog: string[] = [];
		let foundArea = false;
		const areaOfInterest = 3;
		for (let event of r.events) {
			if (event.event === "areaChange" && event.newArea === 3) {
				eventsToLog.push("area" + event.newArea + "@" + event.turn);
				foundArea = true;
			} else if (event.turn > 500) {
				break;
			} else if (event.event === "areaChange" && event.newArea > areaOfInterest) {
				eventsToLog.push("area" + event.newArea + "@" + event.turn);
				break;
			} else if (foundArea) {
				eventsToLog.push(event.event + "@" + event.turn);
			}
		}

		console.log(r.attackFactor + "->\t" + eventsToLog.join('\t\t'));
	}
	await fs.writeFile('sweep_summary.csv', csvLines.join('\n'));

	console.log(`Sweep complete: ${results.length} combinations.`);
	console.log('Results written to sweep_results.json and sweep_summary.csv');
}

// ============================================================================
// Entry Point
// ============================================================================

export function getNewEnemiesInArea(targetArea: number): EnemyType[] {
	const existingEnemies = new Set<EnemyType>();
	for (let i = 0; i < targetArea; i++) {
		for (let wave of areas[i]!.waves) {
			for (const enemy of wave) {
				existingEnemies.add(enemy as any);
			}
		}
	}

	const enemiesInArea = new Set<EnemyType>();
	for (let wave of areas[targetArea]!.waves) {
		for (const enemy of wave) {
			if (!existingEnemies.has(enemy)) {
				enemiesInArea.add(enemy as any);
			}
		}
	}
	return Array.from(enemiesInArea);
}

if (import.meta.main) {

const mode = process.argv[2];

if (mode === "area") {
	const targetArea = parseInt(process.argv[3] ?? "");
	const powerFactor = parseFloat(process.argv[4] ?? "");
	const speedFactor = parseFloat(process.argv[5] ?? "1");

	if (isNaN(targetArea) || isNaN(powerFactor)) {
		console.error("Usage: bun run src/rpg/simulator.ts area <areaNumber> <powerFactor> [speedFactor]");
		process.exit(1);
	}

	if (targetArea < 0 || targetArea >= areas.length) {
		console.error(`Area must be between 0 and ${areas.length - 1}`);
		process.exit(1);
	}

	// Pad areas
	const lastArea = areas[areas.length - 1]!;
	for (let i = areas.length; i < 1000; i++) {
		areas.push(lastArea);
	}

	const newEnemies = getNewEnemiesInArea(targetArea);
	console.log(`Area ${targetArea}, power factor ${powerFactor}, speed factor ${speedFactor}`);
	console.log(`New enemies in area: ${newEnemies.join(", ")}`);

	// Print enemy stats for all enemies in order of appearance
	{
		const seen = new Set<EnemyType>();
		const ordered: EnemyType[] = [];
		const enemyArea: number[] = [];
		for (let a = 0; a <= targetArea; a++) {
			for (const wave of areas[a]!.waves) {
				for (const enemy of wave) {
					if (!seen.has(enemy)) {
						seen.add(enemy);
						ordered.push(enemy);
						enemyArea.push(a);
					}
				}
			}
		}
		const enemies = makeSimulatorEnemies(ordered);
		console.log(`\nEnemy stats (areas 0-${targetArea}):`);
		console.log(`${"Name".padEnd(20)} ${"Area".padStart(5)} ${"HP".padStart(5)} ${"Power".padStart(6)} ${"Speed".padStart(6)}`);
		for (let i = 0; i < ordered.length; i++) {
			const e = enemies[i]!;
			console.log(`${ordered[i]!.padEnd(20)} ${String(enemyArea[i]).padStart(5)} ${String(e.health).padStart(5)} ${String(e.attackPower).padStart(6)} ${String(e.speed).padStart(6)}`);
		}
		console.log();
	}

	const factors: EnemyStatFactors = {
		enemyTypes: newEnemies,
		hpFactor: powerFactor,
		attackFactor: powerFactor,
		speedFactor,
	};

	let state: State = { xp: 0, area: 0, playerTurns: 0, attackRatios: [] };
	const lives = parseInt(process.argv[6] ?? "20");
	let livesUsed = 0;
	let lastPrintedArea = -1;
	let lastAreaXp = 0;
	let lastAreaLives = lives;

	for (let life = 1; life <= lives; life++) {
		livesUsed = life;
		const result = await runSimulation(state, undefined, factors, {
			stopAfterArea: targetArea,
			quietBelowArea: Infinity,
		});

		// Print area summary for each area completed during this life
		for (const event of result.events) {
			if (event.event === "areaChange" && event.newArea > lastPrintedArea) {
				const currentLives = lives - life + 1;
				console.log(`Area ${event.newArea - 1} done | xp: ${event.xp} (+${event.xp - lastAreaXp}), lives: ${currentLives} (${currentLives - lastAreaLives})`);
				lastAreaXp = event.xp;
				lastAreaLives = currentLives;
				lastPrintedArea = event.newArea;
			}
		}

		state = result.state;

		if (state.area > targetArea) {
			break;
		}
	}

	printAttackRatios(state.attackRatios);

	if (state.area <= targetArea) {
		console.log(`Failed to clear area ${targetArea} in ${lives} lives. Reached area ${state.area}, xp: ${state.xp}`);
	}
} else if (mode === "sweep") {
	const targetArea = 3;
	const newEnemies = getNewEnemiesInArea(targetArea);
	await runSweep(newEnemies, 5);
} else {
	await runSimulations();
}

} // if (import.meta.main)
