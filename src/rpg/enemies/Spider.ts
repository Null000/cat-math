import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Spider extends Actor {
    constructor() {
        super({
            texture: spiderTexture,
            health: 20,
            attackPower: 5,
            defensePower: 1,
            speed: 6,
            xpDrop: 18
        });
    }
}
let spiderTexture: Texture;
export async function initSpider() {
    if (spiderTexture) return;
    spiderTexture = await Assets.load('assets/spider.png');
}
