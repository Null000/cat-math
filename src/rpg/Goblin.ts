import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Goblin extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: goblinTexture,
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
