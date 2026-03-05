import { BackgroundType } from "./backgroundMaker.ts";
import { EnemyType } from "./enemies/enemyMaker.ts";

export interface Area {
	background: BackgroundType;
	waves: EnemyType[][];
}

const E = EnemyType;

export const areas: Area[] = [
	// Area 0 — Village (tutorial)
	{
		background: BackgroundType.Village,
		waves: [[E.Dummy], [E.Dummy, E.Dummy]],
	},

	// Area 1 — Forest (easy, Rat/DireRat progression)
	{
		background: BackgroundType.Forest,
		waves: [
			[E.Rat],
			[E.Rat, E.Rat],
			[E.Rat, E.Rat],
			[E.DireRat],
			[E.DireRat],
			[E.DireRat, E.Rat],
			[E.DireRat, E.Rat],
			[E.DireRat, E.Rat, E.Rat],
			[E.DireRat, E.DireRat],
			[E.DireRat, E.DireRat, E.Rat, E.Rat, E.Rat],
		],
	},

	// Area 2 — Dark Forest (introduces Bat, Slime, Spider, Mushroom)
	{
		background: BackgroundType.DarkForest,
		waves: [
			[E.Bat],
			[E.Slime],
			[E.Bat, E.Bat],
			[E.Mushroom],
			[E.Slime, E.Bat],
			[E.Spider],
			[E.Spider, E.Bat],
			[E.Mushroom, E.Slime, E.Bat],
			[E.Spider, E.Spider],
			[E.Spider, E.Mushroom, E.Bat, E.Bat],
		],
	},

	// Area 3 — Swamp (introduces PoisonSlime, Goblin)
	{
		background: BackgroundType.Swamp,
		waves: [
			[E.Slime, E.Slime],
			[E.PoisonSlime],
			[E.Spider, E.Bat],
			[E.PoisonSlime, E.Slime],
			[E.Goblin],
			[E.Goblin, E.Bat],
			[E.PoisonSlime, E.PoisonSlime],
			[E.Goblin, E.Spider],
			[E.Goblin, E.PoisonSlime, E.Bat],
			[E.Goblin, E.Goblin, E.PoisonSlime],
		],
	},

	// Area 4 — Mountains (introduces Wolf, GiantBat, GiantSpider, Skeleton)
	{
		background: BackgroundType.Mountains,
		waves: [
			[E.Wolf],
			[E.GiantBat],
			[E.Wolf, E.Wolf],
			[E.Skeleton],
			[E.GiantSpider],
			[E.Wolf, E.GiantBat],
			[E.Skeleton, E.Wolf],
			[E.GiantSpider, E.GiantBat, E.GiantBat],
			[E.Skeleton, E.Skeleton],
			[E.Wolf, E.Wolf, E.GiantSpider, E.GiantBat],
		],
	},

	// Area 5 — Dungeon (introduces SkeletonWarrior, Zombie, DireWolf)
	{
		background: BackgroundType.Dungeon,
		waves: [
			[E.Skeleton, E.Skeleton],
			[E.SkeletonWarrior],
			[E.Zombie],
			[E.DireWolf],
			[E.SkeletonWarrior, E.Skeleton],
			[E.Zombie, E.Zombie],
			[E.DireWolf, E.Skeleton],
			[E.SkeletonWarrior, E.Zombie],
			[E.DireWolf, E.DireWolf],
			[E.SkeletonWarrior, E.SkeletonWarrior, E.Zombie],
			[E.DireWolf, E.SkeletonWarrior, E.Zombie, E.Skeleton],
		],
	},

	// Area 6 — Ruins (introduces Ghost, DarkSkeleton, Treant)
	{
		background: BackgroundType.Ruins,
		waves: [
			[E.Ghost],
			[E.Ghost, E.Ghost],
			[E.DarkSkeleton],
			[E.Treant],
			[E.Ghost, E.Zombie],
			[E.DarkSkeleton, E.Ghost],
			[E.Treant, E.Ghost],
			[E.DarkSkeleton, E.DarkSkeleton],
			[E.Treant, E.Zombie, E.Ghost],
			[E.Treant, E.DarkSkeleton, E.Ghost, E.Ghost],
		],
	},

	// Area 7 — Volcano (introduces FireSlime, Dragon — endless)
	{
		background: BackgroundType.Volcano,
		waves: [
			[E.FireSlime],
			[E.FireSlime, E.FireSlime],
			[E.DireWolf, E.DireWolf],
			[E.Dragon],
			[E.FireSlime, E.DarkSkeleton, E.DireWolf],
			...Array.from({ length: 500 }, () => [
				E.Dragon,
				E.FireSlime,
				E.DarkSkeleton,
				E.DireWolf,
				E.DireWolf,
			]),
		],
	},
];
