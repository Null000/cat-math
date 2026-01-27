import { Container, Sprite, Texture } from 'pixi.js';
import { HealthBar } from './HealthBar.js';

export abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;
    private initialY: number;
    health = 100;

    constructor(texture: Texture, hbWidth: number, hbHeight: number, hbYOffset: number) {
        super();
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.addChild(this.sprite);

        this.healthBar = new HealthBar(hbWidth, hbHeight);
        this.healthBar.pivot.set(hbWidth / 2, hbHeight / 2);
        this.healthBar.y = -hbYOffset;
        this.addChild(this.healthBar);

        this.initialY = 0;
    }

    setHealth(percent: number) {
        this.health = percent;
        this.healthBar.setHealth(percent);
    }

    update(time: number, isSine: boolean) {
        const offset = isSine ? Math.sin(time / 500) : Math.cos(time / 500);
        this.sprite.y = this.initialY + offset * 10;
        this.healthBar.y = -(this.sprite.height / 2 + 20) + offset * 10;
    }
}
