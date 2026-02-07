import { Actor } from "../Actor.ts";
import { initRat, Rat } from "./Rat.ts";
import { initDireRat, DireRat } from "./DireRat.ts";
import { initGoblin, Goblin } from "./Goblin.ts";
import { initSkeleton, Skeleton } from "./Skeleton.ts";
import { initZombie, Zombie } from "./Zombie.ts";
import { initBat, Bat } from "./Bat.ts";
import { initWolf, Wolf } from "./Wolf.ts";
import { initTreant, Treant } from "./Treant.ts";
import { initDummy, Dummy } from "./Dummy.ts";

export const EnemyType = {
    Rat: "rat",
    DireRat: "dire_rat",
    Goblin: "goblin",
    Skeleton: "skeleton",
    Zombie: "zombie",
    Bat: "bat",
    Wolf: "wolf",
    Treant: "treant",
    Dummy: "dummy"
} as const;

export type EnemyType = typeof EnemyType[keyof typeof EnemyType];


export async function makeEnemies(wave: number): Promise<Actor[]> {
    let plan = waveEnemies[wave];

    if (!plan) {
        plan = waveEnemies[10]!;
    }

    console.log(plan.join(", "));

    const enemies = [];

    for (const type of plan) {
        let enemy: Actor;
        switch (type) {
            case EnemyType.Rat:
                await initRat();
                enemy = new Rat();
                break;
            case EnemyType.DireRat:
                await initDireRat();
                enemy = new DireRat();
                break;
            case EnemyType.Goblin:
                await initGoblin();
                enemy = new Goblin();
                break;
            case EnemyType.Skeleton:
                await initSkeleton();
                enemy = new Skeleton();
                break;
            case EnemyType.Zombie:
                await initZombie();
                enemy = new Zombie();
                break;
            case EnemyType.Bat:
                await initBat();
                enemy = new Bat();
                break;
            case EnemyType.Wolf:
                await initWolf();
                enemy = new Wolf();
                break;
            case EnemyType.Treant:
                await initTreant();
                enemy = new Treant();
                break;
            case EnemyType.Dummy:
                await initDummy();
                enemy = new Dummy();
                break;
            default:
                throw new Error('Unknown enemy type: ' + type);
        }
        enemies.push(enemy);
    }

    return enemies;
}

const waveEnemies: Record<number, EnemyType[]> = {
    1: [EnemyType.Dummy],
    2: [EnemyType.Dummy, EnemyType.Dummy],
    3: [EnemyType.Rat],
    4: [EnemyType.Rat, EnemyType.Rat],
    5: [EnemyType.DireRat],
    6: [EnemyType.DireRat, EnemyType.Rat],
    7: [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
    8: [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
    9: [EnemyType.DireRat, EnemyType.DireRat, EnemyType.DireRat],
    10: [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
}