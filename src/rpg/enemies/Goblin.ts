import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Goblin extends Actor {
	constructor() {
		super({
			texture: goblinTexture,
			textureScale: 0.6,
			health: 30,
			attackPower: 6,
			defensePower: 2,
			speed: 5,
			xpDrop: 22,
		});
		this.sprite.tint = 0x66aa44;
	}
}
let goblinTexture: Texture;
export async function initGoblin() {
	if (goblinTexture) return;
	goblinTexture = await Assets.load("assets/rat.png");
}
