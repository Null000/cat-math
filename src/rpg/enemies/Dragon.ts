import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Dragon extends Actor {
	constructor() {
		super({
			texture: dragonTexture,
			textureScale: 0.7,
			health: 120,
			attackPower: 14,
			defensePower: 6,
			speed: 5,
			xpDrop: 100,
		});
		this.sprite.tint = 0xcc2222;
	}
}
let dragonTexture: Texture;
export async function initDragon() {
	if (dragonTexture) return;
	dragonTexture = await Assets.load("assets/bat.png");
}
