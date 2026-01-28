import { Application, Texture, Assets } from 'pixi.js';
import { Actor } from './Actor.js';

export class Wizard extends Actor {
    constructor(app: Application, x: number, y: number) {
        super({ app, x, y, texture: wizardTexture });
    }
}
let wizardTexture: Texture;

export async function initWizard() {
    wizardTexture = await Assets.load('assets/wizard.png');
}
