import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Spider extends Actor {
	constructor() {
		super({
			texture: spiderTexture,
			textureScale: 0.5,
			health: 20,
			attackPower: 4,
			defensePower: 1,
			speed: 5,
			xpDrop: 12,
		});
	}
}
let spiderTexture: Texture;
export async function initSpider() {
	if (spiderTexture) return;
	spiderTexture = await Assets.load("assets/spider.png");
}
