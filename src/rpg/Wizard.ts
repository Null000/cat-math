import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Wizard extends Actor {
    constructor(x: number, y: number) {
        super({
            x, y, texture: wizardTexture,
            health: 75,
            attackPower: 9,
            defensePower: 3,
            speed: 6,
            xpDrop: 0
        });
    }
}
let wizardTexture: Texture;

export async function initWizard() {
    if (wizardTexture) return;
    wizardTexture = await Assets.load('assets/wizard.png');
}
