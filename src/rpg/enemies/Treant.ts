import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Treant extends Actor {
	constructor() {
		super({
			texture: treantTexture,
			textureScale: 0.45,
			health: 70,
			attackPower: 10,
			defensePower: 5,
			speed: 3,
			xpDrop: 60,
		});
	}
}
let treantTexture: Texture;
export async function initTreant() {
	if (treantTexture) return;
	treantTexture = await Assets.load("assets/treant.png");
}
