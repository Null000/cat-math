import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class PoisonSlime extends Actor {
	constructor() {
		super({
			texture: poisonSlimeTexture,
			textureScale: 0.3,
			health: 125,
			attackPower: 24,
			defensePower: 1,
			speed: 30,
			xpDrop: 16,
		});
	}
}
let poisonSlimeTexture: Texture;
export async function initPoisonSlime() {
	if (poisonSlimeTexture) return;
	poisonSlimeTexture = await Assets.load("assets/poisonSlime.png");
}
