import { Container, Graphics } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.ts';

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

    setHealth(ratio: number) {
        this.fill.clear();
        const minWidth = this.widthMax * 0.02;
        const width = Math.max(this.widthMax * ratio, minWidth);
        this.fill.rect(0, 0, width, this.heightBar);
        let color = 0x2ecc71
        if (ratio < 0.3) {
            color = 0xe74c3c
        } else if (ratio < 0.5) {
            color = 0xe1cc71
        }
        this.fill.fill(color);
    }
}
