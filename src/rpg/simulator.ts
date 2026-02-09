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

async function makeSimulatorWizard(xp: number): Promise<Actor> {
  const wizard = new Wizard(xp);
  fakeAnimations(wizard);
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

async function runSimulation(xp: number = 0, planOverride?: EnemyType[]): Promise<number> {
  const battleManager = new BattleManager(new Container(), xp);
  battleManager._makeEnemies = (x) => makeSimulatorEnemies(planOverride ?? x);
  battleManager._makeWizard = makeSimulatorWizard;
  battleManager._makeBackground = async () => new Sprite();

  await battleManager.init();

  for (let i = 0; i < 200; i++) {
    const dead = await battleManager.doTurns();
    if (dead) {
      console.log('hero died. area: ' + battleManager.area + ', wave: ' + battleManager.wave + ', turns: ' + battleManager.turnCounter + ', userInput: ' + i + ', xp: ' + battleManager.xp);
      return battleManager.xp;
    }
    await battleManager.correctAnswer();
  }
  return -1;
}

async function runSimulations() {
  // for (let enemy of [EnemyType.Rat, EnemyType.DireRat, EnemyType.Goblin, EnemyType.Skeleton, EnemyType.Zombie, EnemyType.Bat, EnemyType.Wolf, EnemyType.Treant]) {
  //   console.log('running simulation for ' + enemy);
  //   const result = await runSimulation(0, [enemy]);
  //   console.log('result: ' + result);
  // }

  console.log('real simulation');
  let result = await runSimulation();
  result += await runSimulation(result);
  result += await runSimulation(result);
  result += await runSimulation(result);
  result += await runSimulation(result);
  console.log('result: ' + result);
}

// Run the simulation
await runSimulations();
