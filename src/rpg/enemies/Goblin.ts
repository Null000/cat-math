import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Goblin extends Actor {
	constructor() {
		super({
			texture: goblinTexture,
			textureScale: 0.3,
			health: 144,
			attackPower: 29,
			defensePower: 2,
			speed: 25,
			xpDrop: 22,
		});
	}
}
let goblinTexture: Texture;
export async function initGoblin() {
	if (goblinTexture) return;
	goblinTexture = await Assets.load("assets/goblin.png");
}
