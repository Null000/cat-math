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

async function makeSimulatorEnemy(type: EnemyType): Promise<Actor> {
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
  return enemy;
}

async function makeSimulatorWizard(): Promise<Actor> {
  const wizard = new Wizard();
  fakeAnimations(wizard);
  return wizard;
}

function fakeAnimations(actor: Actor) {
  actor.shake = async () => { };
  actor.die = async () => { };
}

// ============================================================================
// Main Simulation
// ============================================================================

async function runSimulation(): Promise<void> {
  const battleManager = new BattleManager(new Container());
  battleManager._makeEnemy = makeSimulatorEnemy;
  battleManager._makeWizard = makeSimulatorWizard;

  await battleManager.init();

  for (let i = 0; i < 200; i++) {
    const dead = await battleManager.doTurns();
    if (dead) {
      console.log('hero died. wave: ' + battleManager.wave + ', turns: ' + battleManager.turnCounter + ', userInput: ' + i);
      break;
    }
    await battleManager.correctAnswer();
  }
}

// Run the simulation
await runSimulation();
