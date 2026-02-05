import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.ts';

export class Wizard extends Actor {
    constructor() {
        super({
            texture: wizardTexture,
            health: 100,
            attackPower: 5,
            defensePower: 1,
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
