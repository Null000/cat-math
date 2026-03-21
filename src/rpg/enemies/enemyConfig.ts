import { Assets, Texture } from "pixi.js";
import { Actor } from "../Actor.ts";

interface EnemyStats {
	texturePath: string;
	textureScale: number;
	health: number;
	attackPower: number;
	defensePower: number;
	speed: number;
	xpDrop: number;
	tint?: number;
}

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

const enemyConfig: Record<EnemyType, EnemyStats> = {
	[EnemyType.Rat]: {
		texturePath: "assets/rat.png",
		textureScale: 0.5,
		health: 12,
		attackPower: 4,
		defensePower: 0,
		speed: 4,
		xpDrop: 8,
	},
	[EnemyType.DireRat]: {
		texturePath: "assets/ratLeader.png",
		textureScale: 0.5,
		health: 24,
		attackPower: 5,
		defensePower: 2,
		speed: 5,
		xpDrop: 20,
	},
	[EnemyType.Slime]: {
		texturePath: "assets/slime.png",
		textureScale: 0.25,
		health: 45,
		attackPower: 8,
		defensePower: 0,
		speed: 15,
		xpDrop: 10,
	},
	[EnemyType.Goblin]: {
		texturePath: "assets/goblin.png",
		textureScale: 0.3,
		health: 144,
		attackPower: 29,
		defensePower: 2,
		speed: 25,
		xpDrop: 22,
	},
	[EnemyType.Skeleton]: {
		texturePath: "assets/skeleton.png",
		textureScale: 0.25,
		health: 38,
		attackPower: 7,
		defensePower: 3,
		speed: 4,
		xpDrop: 25,
	},
	[EnemyType.Zombie]: {
		texturePath: "assets/zombie.png",
		textureScale: 0.3,
		health: 50,
		attackPower: 8,
		defensePower: 4,
		speed: 2,
		xpDrop: 32,
	},
	[EnemyType.Bat]: {
		texturePath: "assets/bat.png",
		textureScale: 0.25,
		health: 45,
		attackPower: 8,
		defensePower: 0,
		speed: 8,
		xpDrop: 10,
	},
	[EnemyType.Wolf]: {
		texturePath: "assets/wolf.png",
		textureScale: 0.3,
		health: 35,
		attackPower: 8,
		defensePower: 2,
		speed: 7,
		xpDrop: 28,
	},
	[EnemyType.Treant]: {
		texturePath: "assets/treant.png",
		textureScale: 0.45,
		health: 70,
		attackPower: 10,
		defensePower: 5,
		speed: 3,
		xpDrop: 60,
	},
	[EnemyType.Dummy]: {
		texturePath: "assets/dummy.png",
		textureScale: 0.15,
		health: 1,
		attackPower: 0,
		defensePower: 0,
		speed: 0.000000001,
		xpDrop: 1,
	},
	[EnemyType.Spider]: {
		texturePath: "assets/spider.png",
		textureScale: 0.25,
		health: 50,
		attackPower: 10,
		defensePower: 1,
		speed: 20,
		xpDrop: 12,
	},
	[EnemyType.Mushroom]: {
		texturePath: "assets/mushroom.png",
		textureScale: 0.25,
		health: 40,
		attackPower: 8,
		defensePower: 1,
		speed: 12,
		xpDrop: 10,
	},
	[EnemyType.PoisonSlime]: {
		texturePath: "assets/poisonSlime.png",
		textureScale: 0.25,
		health: 125,
		attackPower: 24,
		defensePower: 1,
		speed: 30,
		xpDrop: 16,
	},
	[EnemyType.GiantBat]: {
		texturePath: "assets/bat.png",
		textureScale: 0.35,
		health: 24,
		attackPower: 5,
		defensePower: 1,
		speed: 9,
		xpDrop: 18,
		tint: 0xdd4444,
	},
	[EnemyType.GiantSpider]: {
		texturePath: "assets/spider.png",
		textureScale: 0.6,
		health: 40,
		attackPower: 7,
		defensePower: 3,
		speed: 6,
		xpDrop: 30,
		tint: 0x8844aa,
	},
	[EnemyType.SkeletonWarrior]: {
		texturePath: "assets/skeletonWarrior.png",
		textureScale: 0.25,
		health: 45,
		attackPower: 8,
		defensePower: 4,
		speed: 5,
		xpDrop: 35,
	},
	[EnemyType.DireWolf]: {
		texturePath: "assets/wolf.png",
		textureScale: 0.4,
		health: 48,
		attackPower: 10,
		defensePower: 3,
		speed: 8,
		xpDrop: 40,
		tint: 0x444466,
	},
	[EnemyType.Ghost]: {
		texturePath: "assets/ghost.png",
		textureScale: 0.25,
		health: 32,
		attackPower: 9,
		defensePower: 2,
		speed: 7,
		xpDrop: 35,
	},
	[EnemyType.DarkSkeleton]: {
		texturePath: "assets/darkSkeleton.png",
		textureScale: 0.3,
		health: 55,
		attackPower: 9,
		defensePower: 5,
		speed: 4,
		xpDrop: 45,
	},
	[EnemyType.FireSlime]: {
		texturePath: "assets/fireSlime.png",
		textureScale: 0.35,
		health: 60,
		attackPower: 11,
		defensePower: 3,
		speed: 4,
		xpDrop: 50,
	},
	[EnemyType.Dragon]: {
		texturePath: "assets/dragon.png",
		textureScale: 0.6,
		health: 120,
		attackPower: 14,
		defensePower: 6,
		speed: 5,
		xpDrop: 100,
	},
};

export class Enemy extends Actor {
	constructor(texture: Texture, config: EnemyStats) {
		super({
			texture,
			textureScale: config.textureScale,
			health: config.health,
			attackPower: config.attackPower,
			defensePower: config.defensePower,
			speed: config.speed,
			xpDrop: config.xpDrop,
		});
		if (config.tint !== undefined) {
			this.sprite.tint = config.tint;
		}
	}
}

const textureCache = new Map<string, Texture>();

async function loadTexture(path: string): Promise<Texture> {
	const cached = textureCache.get(path);
	if (cached) return cached;
	const texture: Texture = await Assets.load(path);
	textureCache.set(path, texture);
	return texture;
}

export function getEnemyConfig(type: EnemyType): EnemyStats {
	return enemyConfig[type];
}

export async function createEnemy(type: EnemyType): Promise<Enemy> {
	const config = enemyConfig[type];
	const texture = await loadTexture(config.texturePath);
	return new Enemy(texture, config);
}

/**
 * Creates enemies without loading textures (for headless simulation).
 * Uses a 1x1 empty texture as a placeholder.
 */
export function createSimulatorEnemy(type: EnemyType): Enemy {
	const config = enemyConfig[type];
	return new Enemy(Texture.EMPTY, config);
}
