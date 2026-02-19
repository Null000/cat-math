// Cat Wizard - Battle Simulator
// Text-based simulation using the same battle logic as BattleManager
// Run with: bun run src/rpg/simulator.ts
// Run sweep with: bun run src/rpg/simulator.ts sweep

import {Actor} from "./Actor.ts";
import {BattleManager} from "./BattleManager.ts";
import {EnemyType} from "./enemies/enemyMaker.ts";
import {Rat} from "./enemies/Rat.ts";
import {DireRat} from "./enemies/DireRat.ts";
import {Goblin} from "./enemies/Goblin.ts";
import {Skeleton} from "./enemies/Skeleton.ts";
import {Zombie} from "./enemies/Zombie.ts";
import {Bat} from "./enemies/Bat.ts";
import {Wolf} from "./enemies/Wolf.ts";
import {Treant} from "./enemies/Treant.ts";
import {Dummy} from "./enemies/Dummy.ts";
import {Container, Sprite} from "pixi.js";
import {getWizardLevel, Wizard} from "./Wizard.ts";
import {Spider} from "./enemies/Spider.ts";
import {Slime} from "./enemies/Slime.ts";
import {Mushroom} from "./enemies/Mushroom.ts";
import {PoisonSlime} from "./enemies/PoisonSlime.ts";
import {GiantBat} from "./enemies/GiantBat.ts";
import {GiantSpider} from "./enemies/GiantSpider.ts";
import {SkeletonWarrior} from "./enemies/SkeletonWarrior.ts";
import {DireWolf} from "./enemies/DireWolf.ts";
import {Ghost} from "./enemies/Ghost.ts";
import {DarkSkeleton} from "./enemies/DarkSkeleton.ts";
import {FireSlime} from "./enemies/FireSlime.ts";
import {Dragon} from "./enemies/Dragon.ts";
import {areas} from "./areas.ts";

// @ts-ignore
import fs from 'fs/promises'

// ============================================================================
// Types
// ============================================================================

type SimEvent =
	| { turn: number; event: "death"; area: number; wave: number; xp: number }
	| { turn: number; event: "levelUp"; newLevel: number; xp: number }
	| { turn: number; event: "areaChange"; newArea: number; xp: number };

interface EnemyStatFactors {
	enemyTypes: EnemyType[];
	hpFactor: number;
	attackFactor: number;
}

interface SimulationResult {
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

async function makeSimulatorEnemies(plan: EnemyType[]): Promise<Actor[]> {
	const enemies = [];

	for (const type of plan) {
		let enemy: Actor;
		switch (type) {
			case EnemyType.Dummy:
				enemy = new Dummy();
				break;
			case EnemyType.Rat:
				enemy = new Rat();
				break;
			case EnemyType.DireRat:
				enemy = new DireRat();
				break;
			case EnemyType.Goblin:
				enemy = new Goblin();
				break;
			case EnemyType.Skeleton:
				enemy = new Skeleton();
				break;
			case EnemyType.Zombie:
				enemy = new Zombie();
				break;
			case EnemyType.Bat:
				enemy = new Bat();
				break;
			case EnemyType.Wolf:
				enemy = new Wolf();
				break;
			case EnemyType.Treant:
				enemy = new Treant();
				break;
			case EnemyType.Spider:
				enemy = new Spider();
				break;
			case EnemyType.Slime:
				enemy = new Slime();
				break;
			case EnemyType.Mushroom:
				enemy = new Mushroom();
				break;
			case EnemyType.PoisonSlime:
				enemy = new PoisonSlime();
				break;
			case EnemyType.GiantBat:
				enemy = new GiantBat();
				break;
			case EnemyType.GiantSpider:
				enemy = new GiantSpider();
				break;
			case EnemyType.SkeletonWarrior:
				enemy = new SkeletonWarrior();
				break;
			case EnemyType.DireWolf:
				enemy = new DireWolf();
				break;
			case EnemyType.Ghost:
				enemy = new Ghost();
				break;
			case EnemyType.DarkSkeleton:
				enemy = new DarkSkeleton();
				break;
			case EnemyType.FireSlime:
				enemy = new FireSlime();
				break;
			case EnemyType.Dragon:
				enemy = new Dragon();
				break;
			default:
				throw new Error("Unknown enemy type: " + type);
		}
		fakeAnimations(enemy);
		enemies.push(enemy);
	}
	return enemies;
}

async function makeSimulatorWizard(xp: number): Promise<Wizard> {
	const wizard = new Wizard(xp);
	fakeAnimations(wizard);
	wizard.castMagic = async () => {
	};
	wizard.castAreaMagic = async () => {
	};
	wizard.castMagicMissile = async () => {
	};
	wizard.levelUp = async (xp) => wizard.levelUpStats(xp)

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
		}
	}
}

// ============================================================================
// Main Simulation
// ============================================================================

interface State {
	xp: number,
	area: number,
	playerTurns: number,
}

const stats: {
	area: number;
	wave: number;
	attackPower: number;
	hp: number;
	dead: number;
}[] = [];

async function runSimulation(
	startState: State,
	planOverride?: EnemyType[],
	statFactors?: EnemyStatFactors,
): Promise<SimulationResult> {
	const events: SimEvent[] = [];

	const battleManager = new BattleManager(new Container(), startState.xp, startState.area);
	battleManager._makeEnemies = async (x) => {
		const plan = planOverride ?? x;
		const enemies = await makeSimulatorEnemies(plan);
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

	for (let i = 0; i < 1000; i++) {
		const dead = await battleManager.doTurns();
		if (dead) {
			events.push({
				turn: i + startPlayerTurns,
				event: "death",
				area: battleManager.area,
				wave: battleManager.wave,
				xp: battleManager.xp,
			});
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
			return {
				state: {
					xp: battleManager.xp,
					area: battleManager.area,
					playerTurns: i + startPlayerTurns
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
			events.push({
				turn: i + startPlayerTurns,
				event: "areaChange",
				newArea: battleManager.area,
				xp: battleManager.xp,
			});
		}
	}
	console.error('Simulation did not end');
	return {
		state: startState,
		events: []
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
		let state: State = {xp: 0, area: 0, playerTurns: 0};
		for (let i = 1; i <= 5; i++) {
			console.log('life: ' + i)
			const result = await runSimulation(state, undefined, {
				enemyTypes: Array.from(enemiesInArea),
				attackFactor: 1,
				hpFactor: 1,
			});
			state = result.state;
		}
		console.log('end ex: ' + state.xp + ', area: ' + state.area + ', turns: ' + state.playerTurns);
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

// Enemy types to apply factors to during sweep
const sweepEnemyTypes: EnemyType[] = [EnemyType.Rat, EnemyType.DireRat];

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

	const hpFactors = generateFactors(0.8, 1.2, 0.05);
	const attackFactors = generateFactors(0.8, 1.2, 0.05);
	const results: SweepResult[] = [];

	for (const hpFactor of hpFactors) {
		for (const attackFactor of attackFactors) {
			console.log(`sweep: hpFactor=${hpFactor}, attackFactor=${attackFactor}`);

			const factors: EnemyStatFactors = {
				enemyTypes,
				hpFactor,
				attackFactor,
			};

			let state: State = {xp: 0, area: 0, playerTurns: 0};
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
	}
	await fs.writeFile('sweep_summary.csv', csvLines.join('\n'));

	console.log(`Sweep complete: ${results.length} combinations.`);
	console.log('Results written to sweep_results.json and sweep_summary.csv');
}

// ============================================================================
// Entry Point
// ============================================================================

const mode = process.argv[2];

if (mode === "sweep") {
	await runSweep(sweepEnemyTypes, 5);
} else {
	await runSimulations();
}
