import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class DarkSkeleton extends Actor {
	constructor() {
		super({
			texture: darkSkeletonTexture,
			textureScale: 0.3,
			health: 55,
			attackPower: 9,
			defensePower: 5,
			speed: 4,
			xpDrop: 45,
		});
		this.sprite.tint = 0x443355;
	}
}
let darkSkeletonTexture: Texture;
export async function initDarkSkeleton() {
	if (darkSkeletonTexture) return;
	darkSkeletonTexture = await Assets.load("assets/skeleton.png");
}
