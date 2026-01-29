import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Wizard extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: wizardTexture,
            health: 100,
            attackPower: 10,
            defensePower: 5,
            speed: 10
        });
    }
}
let wizardTexture: Texture;

export async function initWizard() {
    if (wizardTexture) return;
    wizardTexture = await Assets.load('assets/wizard.png');
}
