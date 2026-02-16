import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class SkeletonWarrior extends Actor {
	constructor() {
		super({
			texture: skeletonWarriorTexture,
			textureScale: 0.25,
			health: 45,
			attackPower: 8,
			defensePower: 4,
			speed: 5,
			xpDrop: 35,
		});
	}
}
let skeletonWarriorTexture: Texture;
export async function initSkeletonWarrior() {
	if (skeletonWarriorTexture) return;
	skeletonWarriorTexture = await Assets.load("assets/skeletonWarrior.png");
}
