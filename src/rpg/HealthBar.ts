import { Container, Graphics } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.js';

export class HealthBar extends Container {
    private bg: Graphics;
    private fill: Graphics;
    private widthMax: number;
    private heightBar: number;

    constructor(width = standardWidth / 8, height = standardHeight / 60) {
        super();
        this.widthMax = width;
        this.heightBar = height;

        this.bg = new Graphics();
        this.bg.rect(0, 0, width, height);
        this.bg.fill(0x333333);
        this.addChild(this.bg);

        this.fill = new Graphics();
        this.fill.rect(0, 0, width, height);
        this.fill.fill(0x2ecc71);
        this.addChild(this.fill);
    }

    setHealth(percent: number) {
        const p = Math.max(0, Math.min(1, percent / 100));
        this.fill.clear();
        this.fill.rect(0, 0, this.widthMax * p, this.heightBar);
        let color = 0x2ecc71
        if (p < 0.3) {
            color = 0xe74c3c
        } else if (p < 0.5) {
            color = 0xe1cc71
        }
        this.fill.fill(color);
    }
}
