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
import { initSpider, Spider } from "./Spider.ts";
import { initMushroom, Mushroom } from "./Mushroom.ts";
import { initPoisonSlime, PoisonSlime } from "./PoisonSlime.ts";
import { initGiantBat, GiantBat } from "./GiantBat.ts";
import { initGiantSpider, GiantSpider } from "./GiantSpider.ts";
import {
	initSkeletonWarrior,
	SkeletonWarrior,
} from "./SkeletonWarrior.ts";
import { initDireWolf, DireWolf } from "./DireWolf.ts";
import { initGhost, Ghost } from "./Ghost.ts";
import { initDarkSkeleton, DarkSkeleton } from "./DarkSkeleton.ts";
import { initFireSlime, FireSlime } from "./FireSlime.ts";
import { initDragon, Dragon } from "./Dragon.ts";

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
	Mushroom: "mushroom",
	PoisonSlime: "poison_slime",
	GiantBat: "giant_bat",
	GiantSpider: "giant_spider",
	SkeletonWarrior: "skeleton_warrior",
	DireWolf: "dire_wolf",
	Ghost: "ghost",
	DarkSkeleton: "dark_skeleton",
	FireSlime: "fire_slime",
	Dragon: "dragon",
} as const;

export type EnemyType = (typeof EnemyType)[keyof typeof EnemyType];

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
			case EnemyType.Spider:
				await initSpider();
				enemy = new Spider();
				break;
			case EnemyType.Mushroom:
				await initMushroom();
				enemy = new Mushroom();
				break;
			case EnemyType.PoisonSlime:
				await initPoisonSlime();
				enemy = new PoisonSlime();
				break;
			case EnemyType.GiantBat:
				await initGiantBat();
				enemy = new GiantBat();
				break;
			case EnemyType.GiantSpider:
				await initGiantSpider();
				enemy = new GiantSpider();
				break;
			case EnemyType.SkeletonWarrior:
				await initSkeletonWarrior();
				enemy = new SkeletonWarrior();
				break;
			case EnemyType.DireWolf:
				await initDireWolf();
				enemy = new DireWolf();
				break;
			case EnemyType.Ghost:
				await initGhost();
				enemy = new Ghost();
				break;
			case EnemyType.DarkSkeleton:
				await initDarkSkeleton();
				enemy = new DarkSkeleton();
				break;
			case EnemyType.FireSlime:
				await initFireSlime();
				enemy = new FireSlime();
				break;
			case EnemyType.Dragon:
				await initDragon();
				enemy = new Dragon();
				break;
			default:
				throw new Error("Unknown enemy type: " + type);
		}
		enemies.push(enemy);
	}

	return enemies;
}
