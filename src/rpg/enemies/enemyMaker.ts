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
import { initSlime, Slime } from "./Slime.ts";

export const EnemyType = {
    Rat: "rat",
    DireRat: "dire_rat",
    Slime: "slime",
    Goblin: "goblin",
    Skeleton: "skeleton",
    Zombie: "zombie",
    Bat: "bat",
    Wolf: "wolf",
    Treant: "treant",
    Dummy: "dummy",
    Spider: "spider",
} as const;

export type EnemyType = typeof EnemyType[keyof typeof EnemyType];


export async function makeEnemies(plan: EnemyType[]): Promise<Actor[]> {
    const enemies: Actor[] = [];

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
            case EnemyType.Slime:
                await initSlime();
                enemy = new Slime();
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
