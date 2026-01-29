import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Bat extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: batTexture,
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
