import { Actor } from "../Actor.js";
import { initRat, Rat } from "./Rat.js";
import { initDireRat, DireRat } from "./DireRat.js";
import { initGoblin, Goblin } from "./Goblin.js";
import { initSkeleton, Skeleton } from "./Skeleton.js";
import { initZombie, Zombie } from "./Zombie.js";
import { initBat, Bat } from "./Bat.js";
import { initWolf, Wolf } from "./Wolf.js";
import { initTreant, Treant } from "./Treant.js";

export enum EnemyType {
    Rat,
    DireRat,
    Goblin,
    Skeleton,
    Zombie,
    Bat,
    Wolf,
    Treant
}

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
