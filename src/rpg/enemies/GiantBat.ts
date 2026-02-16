import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class GiantBat extends Actor {
	constructor() {
		super({
			texture: giantBatTexture,
			textureScale: 0.35,
			health: 24,
			attackPower: 5,
			defensePower: 1,
			speed: 9,
			xpDrop: 18,
		});
		this.sprite.tint = 0xdd4444;
	}
}
let giantBatTexture: Texture;
export async function initGiantBat() {
	if (giantBatTexture) return;
	giantBatTexture = await Assets.load("assets/bat.png");
}
