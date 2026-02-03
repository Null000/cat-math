import { Actor } from "../Actor.ts";
import { initRat, Rat } from "./Rat.ts";
import { initDireRat, DireRat } from "./DireRat.ts";
import { initGoblin, Goblin } from "./Goblin.ts";
import { initSkeleton, Skeleton } from "./Skeleton.ts";
import { initZombie, Zombie } from "./Zombie.ts";
import { initBat, Bat } from "./Bat.ts";
import { initWolf, Wolf } from "./Wolf.ts";
import { initTreant, Treant } from "./Treant.ts";

export const EnemyType = {
    Rat: "rat",
    DireRat: "dire_rat",
    Goblin: "goblin",
    Skeleton: "skeleton",
    Zombie: "zombie",
    Bat: "bat",
    Wolf: "wolf",
    Treant: "treant"
} as const;

export type EnemyType = typeof EnemyType[keyof typeof EnemyType];

export async function makeEnemy(type: EnemyType): Promise<Actor> {
    switch (type) {
        case EnemyType.Rat:
            await initRat();
            return new Rat();
        case EnemyType.DireRat:
            await initDireRat();
            return new DireRat();
        case EnemyType.Goblin:
            await initGoblin();
            return new Goblin();
        case EnemyType.Skeleton:
            await initSkeleton();
            return new Skeleton();
        case EnemyType.Zombie:
            await initZombie();
            return new Zombie();
        case EnemyType.Bat:
            await initBat();
            return new Bat();
        case EnemyType.Wolf:
            await initWolf();
            return new Wolf();
        case EnemyType.Treant:
            await initTreant();
            return new Treant();
        default:
            throw new Error('Unknown enemy type: ' + type);
    }
}
