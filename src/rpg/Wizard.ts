import { Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.ts';

export class Wizard extends Actor {
    constructor(xp: number) {
        const xpFactor = 1 + xp / 100;
        super({
            texture: wizardTexture,
            textureScale: 0.1,
            health: Math.floor(100 * xpFactor),
            attackPower: Math.floor(5 * xpFactor),
            defensePower: Math.floor(1 * xpFactor),
            speed: Math.floor(6 * xpFactor),
            xpDrop: 0
        });
    }

    updateHealthBar() {
        const ratio = Math.max(this.health / this.maxHealth, 0.02);
        this.healthBar.setHealth(ratio);
    }
}
let wizardTexture: Texture;
let wizardTextureLevel: number;

export async function initWizard(xp: number) {
    const level = getWizardLevel(xp);
    if (wizardTextureLevel === level) return;
    wizardTextureLevel = level;
    wizardTexture = await Assets.load(`assets/wizard${level}.png`);
}

export function getWizardLevel(xp: number): number {
    return xp === 0 ? 1 : Math.ceil(xp / 100);
}
