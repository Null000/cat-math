import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.ts';

export class Wizard extends Actor {
    constructor(xp: number) {
        const xpFactor = 1 + xp / 100;
        super({
            texture: wizardTexture,
            health: Math.floor(100 * xpFactor),
            attackPower: Math.floor(5 * xpFactor),
            defensePower: Math.floor(1 * xpFactor),
            speed: Math.floor(6 * xpFactor),
            xpDrop: 0
        });
    }
}
let wizardTexture: Texture;

export async function initWizard() {
    if (wizardTexture) return;
    wizardTexture = await Assets.load('assets/wizard.png');
}
