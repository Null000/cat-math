import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Goblin extends Actor {
    constructor() {
        super({
            texture: goblinTexture,
            textureScale: 0.5,
            health: 26,
            attackPower: 7,
            defensePower: 2,
            speed: 5,
            xpDrop: 22
        });
    }
}
let goblinTexture: Texture;
export async function initGoblin() {
    if (goblinTexture) return;
    // Assuming asset will be added, or user can fix path
    goblinTexture = await Assets.load('assets/goblin.png');
}
