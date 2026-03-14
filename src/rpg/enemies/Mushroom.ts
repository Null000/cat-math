import {Assets, Texture} from "pixi.js";
import {Actor} from "../Actor.ts";

export class Mushroom extends Actor {
	constructor() {
		super({
			texture: mushroomTexture,
			textureScale: 0.25,
			health: 40,
			attackPower: 8,
			defensePower: 1,
			speed: 12,
			xpDrop: 10,
		});
	}
}

let mushroomTexture: Texture;

export async function initMushroom() {
	if (mushroomTexture) return;
	mushroomTexture = await Assets.load("assets/mushroom.png");
}
