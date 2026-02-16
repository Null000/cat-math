import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class PoisonSlime extends Actor {
	constructor() {
		super({
			texture: poisonSlimeTexture,
			textureScale: 0.3,
			health: 26,
			attackPower: 5,
			defensePower: 1,
			speed: 3,
			xpDrop: 16,
		});
		this.sprite.tint = 0x66dd44;
	}
}
let poisonSlimeTexture: Texture;
export async function initPoisonSlime() {
	if (poisonSlimeTexture) return;
	poisonSlimeTexture = await Assets.load("assets/slime.png");
}
