import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Mushroom extends Actor {
	constructor() {
		super({
			texture: mushroomTexture,
			textureScale: 0.25,
			health: 16,
			attackPower: 3,
			defensePower: 1,
			speed: 2,
			xpDrop: 10,
		});
		this.sprite.tint = 0x8b7355;
	}
}
let mushroomTexture: Texture;
export async function initMushroom() {
	if (mushroomTexture) return;
	mushroomTexture = await Assets.load("assets/slime.png");
}
