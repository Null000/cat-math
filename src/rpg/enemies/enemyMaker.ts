import { Actor } from "../Actor.ts";
import { createEnemy } from "./enemyConfig.ts";
import type { EnemyType } from "./enemyConfig.ts";

export { EnemyType } from "./enemyConfig.ts";

export async function makeEnemies(plan: EnemyType[]): Promise<Actor[]> {
	const enemies: Actor[] = [];

	for (const type of plan) {
		const enemy = await createEnemy(type);
		enemies.push(enemy);
	}

	return enemies;
}
