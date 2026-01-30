import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.js';

export class Treant extends Actor {
    constructor() {
        super({
            texture: treantTexture,
            health: 140,
            attackPower: 12,
            defensePower: 8,
            speed: 3,
            xpDrop: 300
        });
    }
}
let treantTexture: Texture;
export async function initTreant() {
    if (treantTexture) return;
    treantTexture = await Assets.load('assets/treant.png');
}
