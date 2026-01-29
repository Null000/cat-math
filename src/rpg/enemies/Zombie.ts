import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.js';

export class Zombie extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: zombieTexture,
            health: 42,
            attackPower: 7,
            defensePower: 4,
            speed: 2,
            xpDrop: 35
        });
    }
}
let zombieTexture: Texture;
export async function initZombie() {
    if (zombieTexture) return;
    zombieTexture = await Assets.load('assets/zombie.png');
}
