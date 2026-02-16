import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class DireWolf extends Actor {
	constructor() {
		super({
			texture: direWolfTexture,
			textureScale: 0.4,
			health: 48,
			attackPower: 10,
			defensePower: 3,
			speed: 8,
			xpDrop: 40,
		});
		this.sprite.tint = 0x444466;
	}
}
let direWolfTexture: Texture;
export async function initDireWolf() {
	if (direWolfTexture) return;
	direWolfTexture = await Assets.load("assets/wolf.png");
}
