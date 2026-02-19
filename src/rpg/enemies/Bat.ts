import {Assets, Texture} from "pixi.js";
import {Actor} from "../Actor.ts";

export class Bat extends Actor {
	constructor() {
		super({
			texture: batTexture,
			textureScale: 0.25,
			health: 90,
			attackPower: 15,
			defensePower: 0,
			speed: 8,
			xpDrop: 10,
		});
	}
}

let batTexture: Texture;

export async function initBat() {
	if (batTexture) return;
	batTexture = await Assets.load("assets/bat.png");
}
