import { Container, Graphics } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.ts';

export class HealthBar extends Container {
    private bg: Graphics;
    private fill: Graphics;
    private widthMax: number;
    private heightBar: number;

    private currentRatio: number = 1;
    private targetRatio: number = 1;
    private animationSpeed: number = 1.5;

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
        this.targetRatio = ratio;
    }

    update(delta: number) {
        if (this.currentRatio === this.targetRatio) return;

        const diff = this.targetRatio - this.currentRatio;
        const step = this.animationSpeed * delta;

        if (Math.abs(diff) <= step) {
            this.currentRatio = this.targetRatio;
        } else {
            this.currentRatio += Math.sign(diff) * step;
        }

        this.redraw();
    }

    private redraw() {
        this.fill.clear();
        this.fill.rect(0, 0, this.widthMax * this.currentRatio, this.heightBar);
        let color = 0x2ecc71;
        if (this.currentRatio < 0.3) {
            color = 0xe74c3c;
        } else if (this.currentRatio < 0.5) {
            color = 0xe1cc71;
        }
        this.fill.fill(color);
    }
}
