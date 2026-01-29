import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Wolf extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: wolfTexture,
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
