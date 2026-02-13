// Cat Wizard - Battle Simulator
// Text-based simulation using the same battle logic as BattleManager
// Run with: bun run src/rpg/simulator.ts

import { Actor } from "./Actor.ts";
import { BattleManager } from "./BattleManager.ts";
import { EnemyType } from "./enemies/enemyMaker.ts";
import { Rat } from "./enemies/Rat.ts";
import { DireRat } from "./enemies/DireRat.ts";
import { Goblin } from "./enemies/Goblin.ts";
import { Skeleton } from "./enemies/Skeleton.ts";
import { Zombie } from "./enemies/Zombie.ts";
import { Bat } from "./enemies/Bat.ts";
import { Wolf } from "./enemies/Wolf.ts";
import { Treant } from "./enemies/Treant.ts";
import { Dummy } from "./enemies/Dummy.ts";
import { Container, Sprite } from "pixi.js";
import { Wizard } from "./Wizard.ts";
import { Spider } from "./enemies/Spider.ts";
import { Slime } from "./enemies/Slime.ts";
import {areas} from "./areas.ts";

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
      default:
        throw new Error('Unknown enemy type: ' + type);
    }
    fakeAnimations(enemy);
    enemies.push(enemy);
  }
  return enemies;
}

async function makeSimulatorWizard(xp: number): Promise<Wizard> {
  const wizard = new Wizard(xp);
  fakeAnimations(wizard);
  wizard.castMagic = async () => { };
  wizard.castAreaMagic = async () => {};
  wizard.castMagicMissile = async () => {};
  wizard.levelUp = async (xp) => wizard.levelUpStats(xp)

  return wizard;
}

function fakeAnimations(actor: Actor) {
  actor.shake = async () => { };
  actor.die = async () => { };
  actor.runLeft = async () => { };
  actor.twitch = async () => { };
}


// ============================================================================
// Main Simulation
// ============================================================================

interface State {
	xp: number,
	area: number
}

async function runSimulation(startState: State, planOverride?: EnemyType[]): Promise<State> {
  const battleManager = new BattleManager(new Container(), startState.xp, startState.area);
  battleManager._makeEnemies = (x) => makeSimulatorEnemies(planOverride ?? x);
  battleManager._makeWizard = makeSimulatorWizard;
  battleManager._makeBackground = async () => new Sprite();

  battleManager.fadeIn = async () => { };
  battleManager.fadeOut = async () => { };

  await battleManager.init();

  for (let i = 0; i < 300; i++) {
    const dead = await battleManager.doTurns();
    if (dead) {
      console.log('hero died. area: ' + battleManager.area + ', wave: ' + battleManager.wave + ', turns: ' + battleManager.turnCounter + ', userInput: ' + i + ', xp: ' + battleManager.xp);
      return {
		  xp: battleManager.xp,
		  area: battleManager.area
	  };
    }
    await battleManager.correctAnswer();
  }
  throw new Error('Simulation did not end');
}

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

  console.log('real simulation');
	let state: State = { xp: 0, area: 0 } ;
	for (let i = 1; i <= 4; i++) {
		console.log('life: ' + i);
		state = await runSimulation(state);
	}
  console.log('end ex: ' + state.xp + ', area: ' + state.area);
}

// Run the simulation
await runSimulations();
