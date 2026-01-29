import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.js';

export class Skeleton extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: skeletonTexture,
            health: 32,
            attackPower: 6,
            defensePower: 3,
            speed: 4,
            xpDrop: 25
        });
    }
}
let skeletonTexture: Texture;
export async function initSkeleton() {
    if (skeletonTexture) return;
    skeletonTexture = await Assets.load('assets/skeleton.png');
}
