import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Dummy extends Actor {
    constructor() {
        super({
            texture: dummyTexture,
            textureScale: 0.2,
            health: 1,
            attackPower: 0,
            defensePower: 0,
            speed: 0.000000001,
            xpDrop: 1
        });
    }
}
let dummyTexture: Texture;
export async function initDummy() {
    if (dummyTexture) return;
    dummyTexture = await Assets.load('assets/dummy.png');
}
