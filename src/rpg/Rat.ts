import { Texture, Assets, Application } from 'pixi.js';
import { Actor } from './Actor.js';

export class Rat extends Actor {
    constructor(app: Application, x: number, y: number) {
        super({ app, x, y, texture: ratTexture });
    }
}
let ratTexture: Texture;
export async function initRat() {
    ratTexture = await Assets.load('assets/rat.png');
}
