import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Rat extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: ratTexture,
            health: 12,
            attackPower: 3,
            defensePower: 0,
            speed: 4,
            xpDrop: 8
        });
    }
}
let ratTexture: Texture;
export async function initRat() {
    if (ratTexture) return;
    ratTexture = await Assets.load('assets/rat.png');
}
