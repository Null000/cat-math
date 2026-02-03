import { Container, Sprite, Texture } from 'pixi.js';
import { HealthBar } from './HealthBar.ts';

export abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;

    health: number;
    maxHealth: number;

    attackPower: number;
    defensePower: number;
    speed: number;

    xpDrop: number;


    constructor({ texture, health, attackPower, defensePower, speed, xpDrop }: { texture: Texture; health: number; attackPower: number; defensePower: number; speed: number; xpDrop: number }) {
        super();

        this.health = health;
        this.maxHealth = health;

        this.attackPower = attackPower;
        this.defensePower = defensePower;
        this.speed = speed;

        this.xpDrop = xpDrop;

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

    async takeDamage(amount: number): Promise<boolean> {
        const damage = Math.max(0, amount - this.defensePower);
        this.health = Math.max(0, this.health - damage);
        this.updateHealthBar();
        await this.shake();
        return this.health === 0;
    }

    private shakeTimer: number = 0;
    private lastTime: number = 0;
    private shakeIntensity: number = 5;

    private resolveShake: (() => void) | null = null;

    shake(duration: number = 0.5, intensity: number = 10): Promise<void> {
        if (duration <= 0) return Promise.resolve();
        this.shakeTimer = duration;
        this.shakeIntensity = intensity;
        return new Promise((resolve) => {
            if (this.resolveShake) {
                this.resolveShake();
            }
            this.resolveShake = resolve;
        });
    }

    private isDying: boolean = false;
    private resolveDeath: (() => void) | null = null;

    die(): Promise<void> {
        this.isDying = true;
        return new Promise((resolve) => {
            this.resolveDeath = resolve;
        });
    }

    update(time: number, isSine: boolean) {
        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (this.isDying) {
            this.alpha -= delta;
            if (this.alpha <= 0) {
                this.alpha = 0;
                if (this.resolveDeath) {
                    this.resolveDeath();
                    this.resolveDeath = null;
                }
            }
            return; // Skip other updates if dying
        }

        let shakeX = 0;
        let shakeY = 0;

        if (this.shakeTimer > 0) {
            this.shakeTimer -= delta;
            if (this.shakeTimer <= 0) {
                this.shakeTimer = 0;
                if (this.resolveShake) {
                    this.resolveShake();
                    this.resolveShake = null;
                }
            }

            shakeX = (Math.random() * this.shakeIntensity * 2) - this.shakeIntensity;
            shakeY = (Math.random() * this.shakeIntensity * 2) - this.shakeIntensity;
        }

        let offset = isSine ? Math.sin(time / 500) : Math.cos(time / 500);
        offset *= 10;

        this.sprite.y = offset + shakeY;
        this.sprite.x = shakeX;

        this.healthBar.y = -this.sprite.height + offset - 20 + shakeY;
        this.healthBar.x = shakeX;
    }

    attack(): number {
        return this.attackPower;
    }

    toString(): string {
        return `${this.constructor.name} (HP: ${this.health}/${this.maxHealth}  ATK: ${this.attackPower}  DEF: ${this.defensePower}  SPD: ${this.speed})`;
    }
}
