import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Wolf extends Actor {
    constructor() {
        super({
            texture: wolfTexture,
            health: 30,
            attackPower: 8,
            defensePower: 3,
            speed: 8,
            xpDrop: 30
        });
    }
}
let wolfTexture: Texture;
export async function initWolf() {
    if (wolfTexture) return;
    wolfTexture = await Assets.load('assets/wolf.png');
}
