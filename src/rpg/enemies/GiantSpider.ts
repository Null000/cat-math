import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class GiantSpider extends Actor {
	constructor() {
		super({
			texture: giantSpiderTexture,
			textureScale: 0.6,
			health: 40,
			attackPower: 7,
			defensePower: 3,
			speed: 6,
			xpDrop: 30,
		});
		this.sprite.tint = 0x8844aa;
	}
}
let giantSpiderTexture: Texture;
export async function initGiantSpider() {
	if (giantSpiderTexture) return;
	giantSpiderTexture = await Assets.load("assets/spider.png");
}
