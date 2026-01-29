import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Rat extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: ratTexture,
            health: 50,
            attackPower: 5,
            defensePower: 2,
            speed: 5
        });
    }
}
let ratTexture: Texture;
export async function initRat() {
    if (ratTexture) return;
    ratTexture = await Assets.load('assets/rat.png');
}
