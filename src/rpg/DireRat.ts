import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class DireRat extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: direRatTexture,
            health: 24,
            attackPower: 5,
            defensePower: 2,
            speed: 7,
            xpDrop: 20
        });
    }
}
let direRatTexture: Texture;
export async function initDireRat() {
    if (direRatTexture) return;
    direRatTexture = await Assets.load('assets/ratLeader.png');
}
