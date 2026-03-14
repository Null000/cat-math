import {Assets, Texture} from "pixi.js";
import {Actor} from "../Actor.ts";

export class Slime extends Actor {
	constructor() {
		super({
			texture: slimeTexture,
			textureScale: 0.25,
			health: 45,
			attackPower: 8,
			defensePower: 0,
			speed: 15,
			xpDrop: 10,
		});
	}
}

let slimeTexture: Texture;

export async function initSlime() {
	if (slimeTexture) return;
	slimeTexture = await Assets.load("assets/slime.png");
}
