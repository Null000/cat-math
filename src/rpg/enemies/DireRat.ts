import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class DireRat extends Actor {
    constructor() {
        super({
            texture: direRatTexture,
            textureScale: 0.5,
            health: 24,
            attackPower: 5,
            defensePower: 2,
            speed: 5,
            xpDrop: 20
        });
    }
}
let direRatTexture: Texture;
export async function initDireRat() {
    if (direRatTexture) return;
    direRatTexture = await Assets.load('assets/ratLeader.png');
}
