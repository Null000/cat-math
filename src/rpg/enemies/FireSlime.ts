import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class FireSlime extends Actor {
	constructor() {
		super({
			texture: fireSlimeTexture,
			textureScale: 0.35,
			health: 60,
			attackPower: 11,
			defensePower: 3,
			speed: 4,
			xpDrop: 50,
		});
		this.sprite.tint = 0xff6622;
	}
}
let fireSlimeTexture: Texture;
export async function initFireSlime() {
	if (fireSlimeTexture) return;
	fireSlimeTexture = await Assets.load("assets/slime.png");
}
