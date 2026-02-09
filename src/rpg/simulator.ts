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
import { BackgroundType } from "./backgroundMaker.ts";
import { Area } from "./areas.ts";

async function makeSimulatorEnemies(plan: EnemyType[]): Promise<Actor[]> {
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


const simulatorAreas: Area[] = [
  {
    name: "Simulator",
    background: BackgroundType.Village,
    waves: [
      [EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat],
      [EnemyType.DireRat],
      [EnemyType.DireRat, EnemyType.Rat],
      [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
    ],
  },
];

// ============================================================================
// Main Simulation
// ============================================================================

async function runSimulation(simAreas: Area[], xp: number = 0): Promise<number> {
  const battleManager = new BattleManager(new Container(), xp);
  battleManager._makeEnemies = makeSimulatorEnemies;
  battleManager._makeWizard = makeSimulatorWizard;
  battleManager._areas = simAreas;

  await battleManager.init();

  for (let i = 0; i < 200; i++) {
    const dead = await battleManager.doTurns();
    if (dead) {
      console.log('hero died. wave: ' + battleManager.wave + ', turns: ' + battleManager.turnCounter + ', userInput: ' + i + ', xp: ' + battleManager.xp);
      return battleManager.xp;
    }
    await battleManager.correctAnswer();
  }
  return -1;
}

async function runSimulations() {
  for (let enemy of [EnemyType.Rat, EnemyType.DireRat, EnemyType.Goblin, EnemyType.Skeleton, EnemyType.Zombie, EnemyType.Bat, EnemyType.Wolf, EnemyType.Treant]) {
    const waves: EnemyType[][] = [];
    for (let i = 0; i < 100; i++) {
      waves.push([enemy]);
    }
    const singleEnemyAreas: Area[] = [{ name: enemy, background: BackgroundType.Village, waves }];
    console.log('running simulation for ' + enemy);
    const result = await runSimulation(singleEnemyAreas);
    console.log('result: ' + result);
  }

  console.log('real simulation');
  let result = await runSimulation(simulatorAreas);
  result += await runSimulation(simulatorAreas, result);
  result += await runSimulation(simulatorAreas, result);
  result += await runSimulation(simulatorAreas, result);
  result += await runSimulation(simulatorAreas, result);
  console.log('result: ' + result);
}

// Run the simulation
await runSimulations();
