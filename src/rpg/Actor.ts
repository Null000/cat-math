import {Container, Graphics, Sprite, Text, Texture, Ticker} from "pixi.js";
import {HealthBar} from "./HealthBar.ts";

export abstract class Actor extends Container {
	protected sprite: Sprite;
	protected healthBar: HealthBar;

	health: number;
	maxHealth: number;

	attackPower: number;
	defensePower: number;
	speed: number;

	xpDrop: number;

	xp: number = 0;

	constructor({
					texture,
					textureScale = 0.5,
					health,
					attackPower,
					defensePower,
					speed,
					xpDrop,
				}: {
		texture: Texture;
		textureScale: number;
		health: number;
		attackPower: number;
		defensePower: number;
		speed: number;
		xpDrop: number;
	}) {
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
		const duration = 200 + damagePercent * 600;
		await this.shake(duration, intensity);

		return this.health === 0;
	}

	private shakeTimer: number = 0;
	private lastTime: number = 0;
	private shakeIntensity: number = 5;

	private resolveShake: (() => void) | null = null;

	shake(duration: number = 500, intensity: number = 10): Promise<void> {
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
	private runSpeed = 0.4; // pix per ms
	private deathFadeSpeed = 1 / 1000 // in one seconds

	private isEntering: boolean = false;
	private resolveEnter: (() => void) | null = null;
	private enterProgress: number = 0;
	private enterDuration: number = 600; // in ms
	private enterStartX: number = 0;
	private enterTargetX: number = 0;

	private isTwitching: boolean = false;
	private resolveTwitch: (() => void) | null = null;
	private twitchProgress: number = 0;
	private twitchDuration: number = 250; // in ms
	private twitchDistance: number = 30;
	private twitchDirection: number = 1; // 1 = forward, -1 = backward

	private speechBubble: Container | null = null;
	private speechBubbleTimeout: ReturnType<typeof setTimeout> | null = null;
	private resolveSpeechBubble: (() => void) | null = null;

	runLeft(): Promise<void> {
		this.sprite.scale.x = this.sprite.scale.x * -1;
		this.isRunningLeft = true;
		return new Promise((resolve) => {
			this.resolveRunLeft = resolve;
		});
	}

	enter(
		fromX: number,
		duration: number = 600,
		delay: number = 0,
	): Promise<void> {
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

	update(time: Ticker, isSine: boolean) {
		const lastTime = time.lastTime;
		if (this.lastTime === 0) {
			this.lastTime = lastTime;
		}
		this.lastTime = lastTime;

		if (this.isDying) {
			this.alpha -= this.deathFadeSpeed * time.deltaMS;
			if (this.alpha <= 0) {
				this.alpha = 0;
				if (this.resolveDeath) {
					this.resolveDeath();
					this.resolveDeath = null;
				}
			}
		}

		if (this.isRunningLeft) {
			this.x -= this.runSpeed * time.deltaMS;
			if (this.x < -this.sprite.width) {
				if (this.resolveRunLeft) {
					this.resolveRunLeft();
					this.resolveRunLeft = null;
				}
			}
			return; // Skip other updates if running
		}

		if (this.isEntering) {
			this.enterProgress += time.deltaMS;
			if (this.enterProgress <= 0) {
				return; // Still in delay period
			}
			const t = Math.min(this.enterProgress / this.enterDuration, 1);
			// Ease-out cubic for smooth deceleration
			const eased = 1 - Math.pow(1 - t, 3);
			this.x =
				this.enterStartX +
				(this.enterTargetX - this.enterStartX) * eased;
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
			this.twitchProgress += time.deltaMS;
			const halfDuration = this.twitchDuration / 2;

			if (this.twitchProgress < halfDuration) {
				// Moving forward
				const t = this.twitchProgress / halfDuration;
				this.sprite.x = t * this.twitchDistance * this.twitchDirection;
			} else if (this.twitchProgress < this.twitchDuration) {
				// Moving back
				const t = (this.twitchProgress - halfDuration) / halfDuration;
				this.sprite.x =
					(1 - t) * this.twitchDistance * this.twitchDirection;
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
			this.shakeTimer -= time.deltaMS;
			if (this.shakeTimer <= 0) {
				this.shakeTimer = 0;
				if (this.resolveShake) {
					this.resolveShake();
					this.resolveShake = null;
				}
			}

			shakeX =
				Math.random() * this.shakeIntensity * 2 - this.shakeIntensity;
			shakeY =
				Math.random() * this.shakeIntensity * 2 - this.shakeIntensity;
		}

		let offset = isSine ? Math.sin(lastTime / 500) : Math.cos(lastTime / 500);
		offset *= 10;

		this.sprite.y = offset + shakeY;
		this.sprite.x = shakeX;

		this.healthBar.update(time);
		this.healthBar.y = -this.sprite.height + offset - 20 + shakeY;
		this.healthBar.x = shakeX;

		if (this.speechBubble) {
			this.speechBubble.y = -this.sprite.height + offset - 40 + shakeY;
			this.speechBubble.x = shakeX;
		}
	}

	async showSpeechBubble(text: string, duration: number): Promise<void> {
		this.hideSpeechBubble();

		const bubble = new Container();

		const textObj = new Text({
			text,
			style: {
				fontSize: 14,
				fill: 0x000000,
				wordWrap: true,
				wordWrapWidth: 150,
				fontFamily: "Arial",
			},
		});

		const padding = 10;
		const tailHeight = 10;
		const bubbleWidth = textObj.width + padding * 2;
		const bubbleHeight = textObj.height + padding * 2;
		const r = 8;
		const tw = 8;
		const cx = bubbleWidth / 2;

		const bg = new Graphics();
		bg.moveTo(r, 0);
		bg.lineTo(bubbleWidth - r, 0);
		bg.arcTo(bubbleWidth, 0, bubbleWidth, r, r);
		bg.lineTo(bubbleWidth, bubbleHeight - r);
		bg.arcTo(bubbleWidth, bubbleHeight, bubbleWidth - r, bubbleHeight, r);
		bg.lineTo(cx + tw, bubbleHeight);
		bg.lineTo(cx, bubbleHeight + tailHeight);
		bg.lineTo(cx - tw, bubbleHeight);
		bg.lineTo(r, bubbleHeight);
		bg.arcTo(0, bubbleHeight, 0, bubbleHeight - r, r);
		bg.lineTo(0, r);
		bg.arcTo(0, 0, r, 0, r);
		bg.closePath();
		bg.fill({color: 0xffffff});
		bg.stroke({width: 2, color: 0x333333});

		textObj.x = padding;
		textObj.y = padding;

		bubble.addChild(bg);
		bubble.addChild(textObj);

		bubble.pivot.set(cx, bubbleHeight + tailHeight);

		this.speechBubble = bubble;
		this.addChild(bubble);

		if (duration === -1) {
			return;
		}

		return new Promise<void>((resolve) => {
			this.resolveSpeechBubble = resolve;
			this.speechBubbleTimeout = setTimeout(() => {
				this.hideSpeechBubble();
			}, duration);
		});
	}

	hideSpeechBubble(): void {
		if (this.speechBubbleTimeout !== null) {
			clearTimeout(this.speechBubbleTimeout);
			this.speechBubbleTimeout = null;
		}
		if (this.speechBubble) {
			this.removeChild(this.speechBubble);
			this.speechBubble.destroy();
			this.speechBubble = null;
		}
		if (this.resolveSpeechBubble) {
			this.resolveSpeechBubble();
			this.resolveSpeechBubble = null;
		}
	}

	async attack(targets: Actor[]): Promise<{
		target: Actor;
		damage: number;
	}[]> {
		await this.twitch();
		return [{
			target: targets[0]!,
			damage: this.attackPower
		}];
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
