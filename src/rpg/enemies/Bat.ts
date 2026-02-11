import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Bat extends Actor {
    constructor() {
        super({
            texture: batTexture,
            textureScale: 0.25,
            health: 16,
            attackPower: 4,
            defensePower: 1,
            speed: 9,
            xpDrop: 12
        });
    }
}
let batTexture: Texture;
export async function initBat() {
    if (batTexture) return;
    batTexture = await Assets.load('assets/bat.png');
}
