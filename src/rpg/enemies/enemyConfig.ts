import { Assets, Texture } from "pixi.js";
import { Actor } from "../Actor.ts";
import enemyConfigJson from "./enemyConfig.json";

interface EnemyJsonStats {
	texturePath: string;
	textureScale: number;
	health: number;
	attackPower: number;
	defensePower: number;
	speed: number;
	xpDrop: number;
	tint?: string;
}

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

function parseConfig(json: Record<string, EnemyJsonStats>): Record<EnemyType, EnemyStats> {
	const result = {} as Record<EnemyType, EnemyStats>;
	for (const [key, value] of Object.entries(json)) {
		result[key as EnemyType] = {
			...value,
			tint: value.tint !== undefined ? Number(value.tint) : undefined,
		};
	}
	return result;
}

const enemyConfig = parseConfig(enemyConfigJson as Record<string, EnemyJsonStats>);

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
