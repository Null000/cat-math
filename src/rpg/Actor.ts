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

    xpDrop: number

    xp: number = 0;


    constructor({ texture, textureScale = 0.5, health, attackPower, defensePower, speed, xpDrop }: { texture: Texture; textureScale: number; health: number; attackPower: number; defensePower: number; speed: number; xpDrop: number }) {
        super();

        this.health = health;
        this.maxHealth = health;

        this.attackPower = attackPower;
        this.defensePower = defensePower;
        this.speed = speed;

        this.xpDrop = xpDrop;

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(textureScale);

        this.addChild(this.sprite);

        this.healthBar = new HealthBar();
        this.healthBar.pivot.set(this.healthBar.width / 2, 0);

        this.addChild(this.healthBar);
    }

    updateHealthBar() {
        this.healthBar.setHealth(this.health / this.maxHealth);
    }

    healMax() {
        this.health = this.maxHealth;
        this.updateHealthBar();
    }

    async takeDamage(amount: number): Promise<boolean> {
        const damage = Math.max(0, amount - this.defensePower);
        this.health = Math.max(0, this.health - damage);
        this.updateHealthBar();

        const damagePercent = Math.min(damage / this.maxHealth, 1);
        const intensity = 3 + damagePercent * 17;
        const duration = 0.2 + damagePercent * 0.6;
        await this.shake(duration, intensity);

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

    private isRunningLeft: boolean = false;
    private resolveRunLeft: (() => void) | null = null;
    private runSpeed: number = 400;

    private isEntering: boolean = false;
    private resolveEnter: (() => void) | null = null;
    private enterProgress: number = 0;
    private enterDuration: number = 0.6;
    private enterStartX: number = 0;
    private enterTargetX: number = 0;

    private isTwitching: boolean = false;
    private resolveTwitch: (() => void) | null = null;
    private twitchProgress: number = 0;
    private twitchDuration: number = 0.25;
    private twitchDistance: number = 30;
    private twitchDirection: number = 1; // 1 = forward, -1 = backward

    runLeft(): Promise<void> {
        this.sprite.scale.x = this.sprite.scale.x * -1;
        this.isRunningLeft = true;
        return new Promise((resolve) => {
            this.resolveRunLeft = resolve;
        });
    }

    enter(fromX: number, duration: number = 0.6, delay: number = 0): Promise<void> {
        this.isEntering = true;
        this.enterStartX = fromX;
        this.enterTargetX = this.x;
        this.enterDuration = duration;
        this.enterProgress = -delay;
        this.x = fromX;
        this.alpha = 0;
        return new Promise((resolve) => {
            this.resolveEnter = resolve;
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
        }

        if (this.isRunningLeft) {
            this.x -= this.runSpeed * delta;
            if (this.x < -this.sprite.width) {
                if (this.resolveRunLeft) {
                    this.resolveRunLeft();
                    this.resolveRunLeft = null;
                }
            }
            return; // Skip other updates if running
        }

        if (this.isEntering) {
            this.enterProgress += delta;
            if (this.enterProgress <= 0) {
                return; // Still in delay period
            }
            const t = Math.min(this.enterProgress / this.enterDuration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - t, 3);
            this.x = this.enterStartX + (this.enterTargetX - this.enterStartX) * eased;
            this.alpha = eased;
            if (t >= 1) {
                this.x = this.enterTargetX;
                this.alpha = 1;
                this.isEntering = false;
                if (this.resolveEnter) {
                    this.resolveEnter();
                    this.resolveEnter = null;
                }
            }
        }

        if (this.isTwitching) {
            this.twitchProgress += delta;
            const halfDuration = this.twitchDuration / 2;

            if (this.twitchProgress < halfDuration) {
                // Moving forward
                const t = this.twitchProgress / halfDuration;
                this.sprite.x = t * this.twitchDistance * this.twitchDirection;
            } else if (this.twitchProgress < this.twitchDuration) {
                // Moving back
                const t = (this.twitchProgress - halfDuration) / halfDuration;
                this.sprite.x = (1 - t) * this.twitchDistance * this.twitchDirection;
            } else {
                // Done
                this.sprite.x = 0;
                this.isTwitching = false;
                this.twitchProgress = 0;
                if (this.resolveTwitch) {
                    this.resolveTwitch();
                    this.resolveTwitch = null;
                }
            }
            return; // Skip other updates while twitching
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

        this.healthBar.update(delta);
        this.healthBar.y = -this.sprite.height + offset - 20 + shakeY;
        this.healthBar.x = shakeX;
    }

    async attack(target: Actor): Promise<number> {
        await this.twitch();
        return this.attackPower;
    }

    async magicMissileAttack(target: Actor): Promise<number> {
        await this.twitch();
        return this.attackPower;
    }

    async twitch(): Promise<void> {
        this.isTwitching = true;
        this.twitchProgress = 0;
        this.twitchDirection = this.x < 400 ? 1 : -1;
        return new Promise((resolve) => {
            if (this.resolveTwitch) {
                this.resolveTwitch();
            }
            this.resolveTwitch = resolve;
        });
    }

    toString(): string {
        return `${this.constructor.name} (HP: ${this.health}/${this.maxHealth}  ATK: ${this.attackPower}  DEF: ${this.defensePower}  SPD: ${this.speed})`;
    }
}
