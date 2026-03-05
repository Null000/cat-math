import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Zombie extends Actor {
	constructor() {
		super({
			texture: zombieTexture,
			textureScale: 0.3,
			health: 50,
			attackPower: 8,
			defensePower: 4,
			speed: 2,
			xpDrop: 32,
		});
	}
}
let zombieTexture: Texture;
export async function initZombie() {
	if (zombieTexture) return;
	zombieTexture = await Assets.load("assets/zombie.png");
}
