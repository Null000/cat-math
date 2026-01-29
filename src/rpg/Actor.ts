import { Application, Container, Sprite, Texture } from 'pixi.js';
import { HealthBar } from './HealthBar.js';
import { standardHeight, standardWidth } from './constants.js';

export abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;

    health: number;
    maxHealth: number;

    constructor({ app, x, y, texture, health = 100 }: { app: Application; x: number; y: number; texture: Texture; health?: number }) {
        super();
        this.x = x;
        this.y = y;

        this.health = health;
        this.maxHealth = health;

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(0.5);

        this.addChild(this.sprite);

        this.healthBar = new HealthBar();
        this.healthBar.pivot.set(this.healthBar.width / 2, 0);

        this.addChild(this.healthBar);
    }

    updateHealthBar() {
        this.healthBar.setHealth(this.health / this.maxHealth);
    }

    update(time: number, isSine: boolean) {
        let offset = isSine ? Math.sin(time / 500) : Math.cos(time / 500);
        offset *= 10;
        this.sprite.y = offset;
        this.healthBar.y = -this.sprite.height + offset - 20;
    }

    takeDamage(amount: number): boolean {
        this.health = Math.max(0, this.health - amount);
        this.updateHealthBar();
        return this.health === 0;
    }

    attack(): number {
        return 10;
    }
}

