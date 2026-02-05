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
import { Container } from "pixi.js";
import { Wizard } from "./Wizard.ts";

async function makeSimulatorEnemies(wave: number, waveDesign: Record<number, EnemyType[]>): Promise<Actor[]> {
  let plan = waveDesign[wave]!;

  const enemies = [];

  for (const type of plan) {
    let enemy: Actor;
    switch (type) {
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
      default:
        throw new Error('Unknown enemy type: ' + type);
    }
    fakeAnimations(enemy);
    enemies.push(enemy);
  }
  return enemies;
}

async function makeSimulatorWizard(): Promise<Actor> {
  const wizard = new Wizard();
  fakeAnimations(wizard);
  return wizard;
}

function fakeAnimations(actor: Actor) {
  actor.shake = async () => { };
  actor.die = async () => { };
  actor.runLeft = async () => { };
  actor.twitch = async () => { };
}

const waveEnemies: Record<number, EnemyType[]> = {
  1: [EnemyType.Rat],
  2: [EnemyType.Rat, EnemyType.Rat],
  3: [EnemyType.DireRat],
  4: [EnemyType.DireRat, EnemyType.Rat],
  5: [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
  6: [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
  7: [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
  8: [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
  9: [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
  10: [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
}

// ============================================================================
// Main Simulation
// ============================================================================

async function runSimulation(waveDesign: Record<number, EnemyType[]>): Promise<number> {
  const battleManager = new BattleManager(new Container());
  battleManager._makeEnemies = (wave: number) => makeSimulatorEnemies(wave, waveDesign);
  battleManager._makeWizard = makeSimulatorWizard;

  await battleManager.init();

  for (let i = 0; i < 200; i++) {
    const dead = await battleManager.doTurns();
    if (dead) {
      console.log('hero died. wave: ' + battleManager.wave + ', turns: ' + battleManager.turnCounter + ', userInput: ' + i);
      return battleManager.wave;
    }
    await battleManager.correctAnswer();
  }
  return -1;
}

async function runSimulations() {
  for (let enemy of [EnemyType.Rat, EnemyType.DireRat, EnemyType.Goblin, EnemyType.Skeleton, EnemyType.Zombie, EnemyType.Bat, EnemyType.Wolf, EnemyType.Treant]) {
    const waveDesign = [];
    for (let i = 1; i <= 100; i++) {
      waveDesign[i] = [enemy];
    }
    console.log('running simulation for ' + enemy);
    const result = await runSimulation(waveDesign);
    console.log('result: ' + result);
  }

  console.log('real simulation');
  const result = await runSimulation(waveEnemies);
  console.log('result: ' + result);
}

// Run the simulation
await runSimulations();
