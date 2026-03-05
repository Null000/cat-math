import { Texture, Assets } from "pixi.js";
import { Actor } from "../Actor.ts";

export class Ghost extends Actor {
	constructor() {
		super({
			texture: ghostTexture,
			textureScale: 0.25,
			health: 32,
			attackPower: 9,
			defensePower: 2,
			speed: 7,
			xpDrop: 35,
		});
	}
}
let ghostTexture: Texture;
export async function initGhost() {
	if (ghostTexture) return;
	ghostTexture = await Assets.load("assets/ghost.png");
}
