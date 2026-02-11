import { Texture, Assets } from 'pixi.js';
import { Actor } from '../Actor.ts';

export class Skeleton extends Actor {
    constructor() {
        super({
            texture: skeletonTexture,
            textureScale: 0.25,
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
