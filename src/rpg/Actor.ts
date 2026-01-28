import { Application, Container, Sprite, Texture } from 'pixi.js';
import { HealthBar } from './HealthBar.js';
import { standardHeight, standardWidth } from './constants.js';

export abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;

    health = 100;

    xx: number;
    yy: number;
    sscale: number = 0.5

    screenRatioFix!: number;

    constructor({ app, x, y, texture }: { app: Application; x: number; y: number; texture: Texture; }) {
        super();
        this.xx = x;
        this.yy = y;
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 1);

        this.addChild(this.sprite);

        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);


        this.onResize(app);
    }

    setHealth(percent: number) {
        this.health = percent;
        this.healthBar.setHealth(percent);
    }

    update(time: number, isSine: boolean) {
        const offset = isSine ? Math.sin(time / 500) : Math.cos(time / 500);
        this.sprite.y = offset * 10 * this.screenRatioFix;
        // this.healthBar.y = -(this.sprite.height / 2 + 20) + offset * 10;
        this.healthBar.y = -this.sprite.height / 2 - 20;
        console.log('sprite y', this.sprite.y);
        console.log('health bar y', this.healthBar.y);
    }

    onResize(app: Application) {
        this.screenRatioFix = app.screen.width / standardWidth;
        this.x = this.xx * this.screenRatioFix;
        this.y = this.yy * this.screenRatioFix;
        this.sprite?.scale.set(this.sscale * this.screenRatioFix);

        // this.healthBar.y = -this.sprite.height;
        // this.healthBar.x = this.sprite.width / 2;
        // this.healthBar?.scale.set(this.screenRatioFix);

    }
}
