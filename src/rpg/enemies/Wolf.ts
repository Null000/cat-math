import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Wolf extends Actor {
	constructor() {
		super({
			texture: wolfTexture,
			textureScale: 0.3,
			health: 35,
			attackPower: 8,
			defensePower: 2,
			speed: 7,
			xpDrop: 28,
		});
	}
}
let wolfTexture: Texture;
export async function initWolf() {
	if (wolfTexture) return;
	wolfTexture = await Assets.load("assets/wolf.png");
}
