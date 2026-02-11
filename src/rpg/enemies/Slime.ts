import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Slime extends Actor {
    constructor() {
        super({
            texture: slimeTexture,
            textureScale: 0.25,
            health: 22,
            attackPower: 4,
            defensePower: 0,
            speed: 3,
            xpDrop: 15
        });
    }
}
let slimeTexture: Texture;
export async function initSlime() {
    if (slimeTexture) return;
    slimeTexture = await Assets.load('assets/slime.png');
}
