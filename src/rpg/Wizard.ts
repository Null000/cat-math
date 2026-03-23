import {Assets, Graphics, Texture, Ticker} from "pixi.js";
import {Actor} from "./Actor.ts";

/** Encapsulates the common state management for a spell animation. */
class SpellState {
	isCasting: boolean = false;
	progress: number = 0;
	targetX: number = 0;
	targetY: number = 0;
	private resolve: (() => void) | null = null;

	constructor(readonly duration: number) {}

	/** Begins the spell, returning a Promise that resolves when complete. */
	start(): Promise<void> {
		this.isCasting = true;
		this.progress = 0;
		return new Promise((resolve) => {
			if (this.resolve) this.resolve();
			this.resolve = resolve;
		});
	}

	/** Advances progress by deltaMS. Returns the normalized t value (0..1). */
	advance(deltaMS: number): number {
		this.progress += deltaMS;
		return Math.min(this.progress / this.duration, 1);
	}

	/** Marks the spell as complete and resolves the promise. */
	complete(): void {
		this.isCasting = false;
		if (this.resolve) {
			this.resolve();
			this.resolve = null;
		}
	}
}

/** Encapsulates the burst/impact animation that follows many spells. */
class BurstState {
	isBursting: boolean = false;
	progress: number = 0;
	graphic: Graphics | null = null;

	constructor(readonly duration: number) {}

	/** Creates a burst graphic at the given position with the given color/alpha. */
	start(parent: Actor, x: number, y: number, color: number, alpha: number): void {
		this.isBursting = true;
		this.progress = 0;
		const burst = new Graphics();
		burst.circle(0, 0, 1);
		burst.fill({color, alpha});
		burst.x = x;
		burst.y = y;
		burst.zIndex = 1000;
		parent.parent!.addChild(burst);
		this.graphic = burst;
	}

	/** Advances burst progress. Returns the normalized t value (0..1). */
	advance(deltaMS: number): number {
		this.progress += deltaMS;
		return Math.min(this.progress / this.duration, 1);
	}

	/** Cleans up the burst graphic and resets state. */
	finish(parent: Actor): void {
		if (this.graphic) {
			parent.parent!.removeChild(this.graphic);
			this.graphic.destroy();
			this.graphic = null;
		}
		this.isBursting = false;
	}
}

export class Wizard extends Actor {
	// Magic orb state
	private magic = new SpellState(400);
	private magicOrb: Graphics | null = null;
	private magicTrails: { graphic: Graphics; life: number }[] = [];
	private magicIsCritical: boolean = false;
	private magicLastTime: number = 0;
	private magicBurst = new BurstState(200);

	// Area magic state
	private area = new SpellState(600);
	private areaRing: Graphics | null = null;

	// Magic missile state
	private missiles = new SpellState(350);
	private missileProjectiles: { graphic: Graphics; progress: number; startDelay: number; offsetY: number; hit: boolean }[] = [];
	private missileBursts: { graphic: Graphics; progress: number }[] = [];
	private missileBurstDuration: number = 150;

	// Level-up animation state
	private levelUp_ = new SpellState(1500);
	private levelUpGlow: Graphics | null = null;
	private levelUpFlash: Graphics | null = null;
	private levelUpParticles: {
		graphic: Graphics;
		life: number;
		vx: number;
		vy: number;
	}[] = [];
	private levelUpNewTexture: Texture | null = null;
	private levelUpTextureSwapped: boolean = false;

	// Lightning bolt state
	private lightning = new SpellState(300);
	private lightningBolt: Graphics | null = null;
	private lightningBurst = new BurstState(150);

	// Fire bolt state
	private fireBolt = new SpellState(400);
	private fireBoltOrb: Graphics | null = null;
	private fireBoltBurst = new BurstState(200);

	// Frost shard state
	private frost = new SpellState(300);
	private frostShards: { graphic: Graphics; progress: number; offsetY: number; hit: boolean }[] = [];
	private frostBursts: { graphic: Graphics; progress: number }[] = [];
	private frostBurstDuration: number = 150;

	// Arcane beam state
	private beam = new SpellState(500);
	private beamGraphic: Graphics | null = null;

	// Meteor strike state
	private meteor = new SpellState(500);
	private meteorGraphic: Graphics | null = null;
	private meteorBurst = new BurstState(250);

	// XP sparkle state
	private sparkles: { graphic: Graphics; life: number; maxLife: number; vx: number; vy: number }[] = [];
	private sparkleTimer: number = 0;
	private sparkleInterval: number = 0; // ms between spawns, 0 = no sparkles
	private sparkleMaxCount: number = 0;

	constructor(xp: number) {
		const xpFactor = 1 + xp / 100;
		super({
			texture: wizardTexture,
			textureScale: 0.1,
			health: Math.floor(100 * xpFactor),
			attackPower: Math.floor(5 * xpFactor),
			defensePower: Math.floor(xpFactor),
			speed: Math.floor(6 * xpFactor),
		});
		this.updateSparkleConfig(xp);
	}

	private updateSparkleConfig(xp: number) {
		const progress = getXpProgress(xp);
		if (progress < 0.2) {
			this.sparkleInterval = 0;
			this.sparkleMaxCount = 0;
		} else if (progress < 0.4) {
			this.sparkleInterval = 600;
			this.sparkleMaxCount = 3;
		} else if (progress < 0.6) {
			this.sparkleInterval = 400;
			this.sparkleMaxCount = 5;
		} else if (progress < 0.8) {
			this.sparkleInterval = 250;
			this.sparkleMaxCount = 8;
		} else {
			this.sparkleInterval = 150;
			this.sparkleMaxCount = 12;
		}
	}

	updateHealthBar() {
		const ratio = Math.max(this.health / this.maxHealth, 0.02);
		this.healthBar.setHealth(ratio);
	}

	override async attack(defenders: Actor[]): Promise<{
		target: Actor;
		damage: number;
	}[]> {
		await this.twitch();

		const level = getWizardLevel(this.xp);
		const target = defenders[0]!;
		let damage = this.attackPower;
		const roll = Math.random();

		// Higher-level spells unlock progressively, each stronger than the last.
		// The roll cascades: if a high-level spell doesn't trigger, lower ones get a chance.
		if (level >= 7 && roll < 0.10) {
			// Meteor Strike — 4x damage to target, 20% to all others
			damage *= 4;
			await this.castMeteorStrike(target);
			const splashDamage = Math.floor(damage * 0.2);
			const results = [{target, damage}];
			for (const d of defenders) {
				if (d !== target) results.push({target: d, damage: splashDamage});
			}
			return results;
		} else if (level >= 6 && roll < 0.15) {
			// Arcane Beam — 3.5x damage
			damage = Math.floor(damage * 3.5);
			await this.castArcaneBeam(target);
		} else if (level >= 5 && roll < 0.25) {
			// Frost Shard — 3x damage
			damage *= 3;
			await this.castFrostShard(target);
		} else if (level >= 4 && roll < 0.35 && defenders.length > 1) {
			// Area Magic — 2.5x damage to ALL enemies
			damage = Math.floor(damage * 2.5);
			await this.castAreaMagic();
			return defenders.map((d) => ({target: d, damage}));
		} else if (level >= 3 && roll < 0.45) {
			// Lightning Bolt — 2x damage
			damage *= 2;
			await this.castLightningBolt(target);
		} else if (level >= 2 && roll < 0.55) {
			// Magic Missile — 1.5x damage
			damage = Math.floor(damage * 1.5);
			await this.castMagicMissile(target);
		} else {
			// Basic magic orb with critical hit chance at level 2+
			let isCritical = false;
			if (Math.random() < 0.25) {
				isCritical = true;
				damage *= 2;
			}
			await this.castMagic(isCritical, target);
		}

		return [{target, damage}];
	}

	castMagic(isCritical: boolean, defender: Actor): Promise<void> {
		this.magicIsCritical = isCritical;
		this.magicLastTime = 0;
		this.magicBurst.isBursting = false;
		this.magicTrails = [];
		this.magic.targetX = defender.x - this.x;
		this.magic.targetY = defender.y - this.y - 80;

		const orb = new Graphics();
		this.drawOrb(orb, isCritical);
		this.magicOrb = orb;
		orb.zIndex = 1000;
		this.parent!.addChild(orb);

		return this.magic.start();
	}

	async areaAttack(): Promise<number> {
		await this.twitch();
		await this.castAreaMagic();
		return this.attackPower;
	}

	override async magicMissileAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castMagicMissile(defender);
		return this.attackPower;
	}

	castMagicMissile(defender: Actor): Promise<void> {
		this.missiles.targetX = defender.x - this.x;
		this.missiles.targetY = defender.y - this.y - 80;
		this.magicLastTime = 0;
		this.missileProjectiles = [];
		this.missileBursts = [];

		const offsets = [-35, 0, 35];
		for (let i = 0; i < 3; i++) {
			const missile = new Graphics();
			this.drawMissile(missile);
			missile.zIndex = 1000;
			missile.visible = false;
			this.parent!.addChild(missile);
			this.missileProjectiles.push({
				graphic: missile,
				progress: 0,
				startDelay: i * 70,
				offsetY: offsets[i]!,
				hit: false
			});
		}

		return this.missiles.start();
	}

	private drawMissile(g: Graphics) {
		const color = 0xcc44ff;
		// Outer glow
		g.circle(0, 0, 10);
		g.fill({color, alpha: 0.15});
		// Middle glow
		g.circle(0, 0, 6);
		g.fill({color, alpha: 0.3});
		// Inner glow
		g.circle(0, 0, 3.5);
		g.fill({color, alpha: 0.6});
		// Core
		g.circle(0, 0, 1.5);
		g.fill({color: 0xffffff, alpha: 0.95});
	}

	private spawnMissileTrail(x: number, y: number) {
		const trail = new Graphics();
		trail.circle(0, 0, 2);
		trail.fill({color: 0xcc44ff, alpha: 0.5});
		trail.x = this.x + x;
		trail.y = this.y + y;
		trail.zIndex = 1000;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 200});
	}

	castAreaMagic(): Promise<void> {
		this.magicLastTime = 0;

		const ring = new Graphics();
		const color = 0xaa44ff;
		// Outer glow
		ring.circle(0, 0, 10);
		ring.stroke({color, alpha: 0.2, width: 12});
		// Main ring
		ring.circle(0, 0, 10);
		ring.stroke({color, alpha: 0.5, width: 4});
		// Inner bright ring
		ring.circle(0, 0, 10);
		ring.stroke({color: 0xddaaff, alpha: 0.7, width: 2});
		// Core fill
		ring.circle(0, 0, 8);
		ring.fill({color, alpha: 0.1});

		ring.x = this.x;
		ring.y = this.y - 80;
		ring.zIndex = 100;
		this.parent!.addChild(ring);
		this.areaRing = ring;

		return this.area.start();
	}

	// --- Lightning Bolt ---

	async lightningBoltAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castLightningBolt(defender);
		return this.attackPower;
	}

	castLightningBolt(defender: Actor): Promise<void> {
		this.magicLastTime = 0;
		this.lightningBurst.isBursting = false;
		this.lightning.targetX = defender.x;
		this.lightning.targetY = defender.y - 80;

		const bolt = new Graphics();
		bolt.zIndex = 1000;
		this.parent!.addChild(bolt);
		this.lightningBolt = bolt;

		return this.lightning.start();
	}

	private drawLightningBolt(g: Graphics, startX: number, startY: number, endX: number, endY: number) {
		g.clear();
		const segments = 8;
		const points: { x: number; y: number }[] = [{x: startX, y: startY}];
		const dx = endX - startX;
		const dy = endY - startY;
		const len = Math.sqrt(dx * dx + dy * dy);
		const perpX = -dy / len;
		const perpY = dx / len;

		for (let i = 1; i < segments; i++) {
			const t = i / segments;
			const baseX = startX + dx * t;
			const baseY = startY + dy * t;
			const offset = (Math.random() - 0.5) * 40;
			points.push({
				x: baseX + perpX * offset,
				y: baseY + perpY * offset,
			});
		}
		points.push({x: endX, y: endY});

		// Outer glow
		g.moveTo(points[0]!.x, points[0]!.y);
		for (let i = 1; i < points.length; i++) {
			g.lineTo(points[i]!.x, points[i]!.y);
		}
		g.stroke({color: 0x4488ff, alpha: 0.3, width: 12});

		// Main bolt
		g.moveTo(points[0]!.x, points[0]!.y);
		for (let i = 1; i < points.length; i++) {
			g.lineTo(points[i]!.x, points[i]!.y);
		}
		g.stroke({color: 0x88ccff, alpha: 0.6, width: 4});

		// Bright core
		g.moveTo(points[0]!.x, points[0]!.y);
		for (let i = 1; i < points.length; i++) {
			g.lineTo(points[i]!.x, points[i]!.y);
		}
		g.stroke({color: 0xffffff, alpha: 0.9, width: 2});
	}

	// --- Fire Bolt ---

	async fireBoltAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castFireBolt(defender);
		return this.attackPower;
	}

	castFireBolt(defender: Actor): Promise<void> {
		this.magicLastTime = 0;
		this.fireBoltBurst.isBursting = false;
		this.fireBolt.targetX = defender.x - this.x;
		this.fireBolt.targetY = defender.y - this.y - 80;

		const orb = new Graphics();
		this.drawFireBoltOrb(orb);
		this.fireBoltOrb = orb;
		orb.zIndex = 1000;
		this.parent!.addChild(orb);

		return this.fireBolt.start();
	}

	private drawFireBoltOrb(g: Graphics) {
		g.circle(0, 0, 25);
		g.fill({color: 0xff4400, alpha: 0.15});
		g.circle(0, 0, 15);
		g.fill({color: 0xff6600, alpha: 0.3});
		g.circle(0, 0, 10);
		g.fill({color: 0xffaa00, alpha: 0.6});
		g.circle(0, 0, 5);
		g.fill({color: 0xffffcc, alpha: 0.95});
	}

	private spawnFireTrail(x: number, y: number) {
		const trail = new Graphics();
		const colors = [0xff4400, 0xff6600, 0xffaa00];
		const color = colors[Math.floor(Math.random() * colors.length)]!;
		trail.circle(0, 0, 3 + Math.random() * 3);
		trail.fill({color, alpha: 0.5});
		trail.x = this.x + x;
		trail.y = this.y + y;
		trail.zIndex = 1000;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 300});
	}

	// --- Frost Shard ---

	async frostShardAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castFrostShard(defender);
		return this.attackPower;
	}

	castFrostShard(defender: Actor): Promise<void> {
		this.magicLastTime = 0;
		this.frostShards = [];
		this.frostBursts = [];
		this.frost.targetX = defender.x - this.x;
		this.frost.targetY = defender.y - this.y - 80;

		const offsets = [-30, -15, 0, 15, 30];
		for (let i = 0; i < 5; i++) {
			const shard = new Graphics();
			this.drawFrostShard(shard);
			shard.zIndex = 1000;
			shard.visible = false;
			this.parent!.addChild(shard);
			this.frostShards.push({
				graphic: shard,
				progress: -i * 50,
				offsetY: offsets[i]!,
				hit: false,
			});
		}

		return this.frost.start();
	}

	private drawFrostShard(g: Graphics) {
		const color = 0x44ddff;
		g.circle(0, 0, 8);
		g.fill({color, alpha: 0.15});
		g.moveTo(0, -6);
		g.lineTo(4, 0);
		g.lineTo(0, 6);
		g.lineTo(-4, 0);
		g.closePath();
		g.fill({color, alpha: 0.6});
		g.circle(0, 0, 2);
		g.fill({color: 0xffffff, alpha: 0.9});
	}

	private spawnFrostTrail(x: number, y: number) {
		const trail = new Graphics();
		trail.circle(0, 0, 2);
		trail.fill({color: 0x44ddff, alpha: 0.5});
		trail.x = this.x + x;
		trail.y = this.y + y;
		trail.zIndex = 1000;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 200});
	}

	// --- Arcane Beam ---

	async arcaneBeamAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castArcaneBeam(defender);
		return this.attackPower;
	}

	castArcaneBeam(defender: Actor): Promise<void> {
		this.magicLastTime = 0;
		this.beam.targetX = defender.x;
		this.beam.targetY = defender.y - 80;

		const beamG = new Graphics();
		beamG.zIndex = 1000;
		this.parent!.addChild(beamG);
		this.beamGraphic = beamG;

		return this.beam.start();
	}

	// --- Meteor Strike ---

	async meteorStrikeAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castMeteorStrike(defender);
		return this.attackPower;
	}

	castMeteorStrike(defender: Actor): Promise<void> {
		this.magicLastTime = 0;
		this.meteorBurst.isBursting = false;
		this.meteor.targetX = defender.x;
		this.meteor.targetY = defender.y - 80;

		const meteorG = new Graphics();
		this.drawMeteor(meteorG);
		meteorG.zIndex = 1000;
		this.parent!.addChild(meteorG);
		this.meteorGraphic = meteorG;

		return this.meteor.start();
	}

	private drawMeteor(g: Graphics) {
		g.circle(0, 0, 30);
		g.fill({color: 0xff4400, alpha: 0.15});
		g.circle(0, 0, 20);
		g.fill({color: 0xff6600, alpha: 0.3});
		g.circle(0, 0, 12);
		g.fill({color: 0x884400, alpha: 0.8});
		g.circle(0, 0, 7);
		g.fill({color: 0xffaa00, alpha: 0.7});
		g.circle(0, 0, 3);
		g.fill({color: 0xffffcc, alpha: 0.95});
	}

	private spawnMeteorTrail(x: number, y: number) {
		const trail = new Graphics();
		const colors = [0xff4400, 0xff6600, 0xffaa00];
		const color = colors[Math.floor(Math.random() * colors.length)]!;
		trail.circle(0, 0, 4 + Math.random() * 4);
		trail.fill({color, alpha: 0.5});
		trail.x = x;
		trail.y = y;
		trail.zIndex = 1000;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 350});
	}

	levelUpStats(newXp: number) {
		this.xp += newXp;
		this.updateSparkleConfig(this.xp);
		const xpFactor = 1 + this.xp / 100;
		this.maxHealth = Math.floor(100 * xpFactor);
		this.health = this.maxHealth;
		this.attackPower = Math.floor(5 * xpFactor);
		this.defensePower = Math.floor(xpFactor);
		this.speed = Math.floor(6 * xpFactor);
	}

	async levelUp(newXp: number): Promise<void> {
		this.levelUpNewTexture = await initWizard(newXp);

		// Update stats
		this.levelUpStats(newXp);
		this.updateHealthBar();

		this.levelUpTextureSwapped = false;
		this.magicLastTime = 0;
		this.levelUpParticles = [];

		// Create glow behind wizard
		const glow = new Graphics();
		glow.x = this.x;
		glow.y = this.y - 80;
		glow.zIndex = this.zIndex - 1;
		this.parent!.addChild(glow);
		this.levelUpGlow = glow;

		// Create flash overlay
		const flash = new Graphics();
		flash.rect(-400, -300, 800, 600);
		flash.fill({color: 0xffffff, alpha: 0});
		flash.zIndex = 9000;
		this.parent!.addChild(flash);
		this.levelUpFlash = flash;

		return this.levelUp_.start();
	}

	private spawnLevelUpParticle(
		centerX: number,
		centerY: number,
		phase: "rise" | "burst",
	) {
		const particle = new Graphics();
		const size = 2 + Math.random() * 4;
		const colors = [0xffd700, 0xffea00, 0xffffff, 0xffb800];
		const color = colors[Math.floor(Math.random() * colors.length)]!;

		particle.circle(0, 0, size);
		particle.fill({color, alpha: 0.8});
		particle.zIndex = 9001;

		let vx: number;
		let vy: number;

		if (phase === "rise") {
			// Particles rise upward from around the wizard
			particle.x = centerX + (Math.random() - 0.5) * 60;
			particle.y = centerY + Math.random() * 40;
			vx = (Math.random() - 0.5) * 30;
			vy = -(60 + Math.random() * 100);
		} else {
			// Burst outward from center
			particle.x = centerX;
			particle.y = centerY;
			const angle = Math.random() * Math.PI * 2;
			const speed = 100 + Math.random() * 200;
			vx = Math.cos(angle) * speed;
			vy = Math.sin(angle) * speed;
		}

		this.parent!.addChild(particle);
		this.levelUpParticles.push({
			graphic: particle,
			life: 0.8 + Math.random() * 0.4,
			vx,
			vy,
		});
	}

	private updateLevelUpGlow(t: number) {
		if (!this.levelUpGlow) return;

		this.levelUpGlow.clear();

		let glowAlpha: number;
		let glowRadius: number;

		if (t < 0.35) {
			// Build up
			const p = t / 0.35;
			glowAlpha = p * 0.4;
			glowRadius = 30 + p * 40;
		} else if (t < 0.5) {
			// Peak
			glowAlpha = 0.4 + ((t - 0.35) / 0.15) * 0.3;
			glowRadius = 70 + ((t - 0.35) / 0.15) * 20;
		} else {
			// Fade out
			const p = Math.min((t - 0.5) / 0.5, 1);
			glowAlpha = 0.7 * (1 - p);
			glowRadius = 90 * (1 - p * 0.3);
		}

		// Outer glow
		this.levelUpGlow.circle(0, 0, glowRadius);
		this.levelUpGlow.fill({color: 0xffd700, alpha: glowAlpha * 0.3});
		// Middle glow
		this.levelUpGlow.circle(0, 0, glowRadius * 0.6);
		this.levelUpGlow.fill({color: 0xffea00, alpha: glowAlpha * 0.5});
		// Inner glow
		this.levelUpGlow.circle(0, 0, glowRadius * 0.3);
		this.levelUpGlow.fill({color: 0xffffff, alpha: glowAlpha * 0.7});
	}

	private spawnAreaTrail(x: number, y: number) {
		const trail = new Graphics();
		trail.circle(0, 0, 3);
		trail.fill({color: 0xaa44ff, alpha: 0.5});
		trail.x = x;
		trail.y = y;
		trail.zIndex = 100;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 300});
	}

	private drawOrb(orb: Graphics, isCritical: boolean) {
		const baseRadius = isCritical ? 28 : 10;
		const color = isCritical ? 0xffdd44 : 0x44aaff;

		// Outer glow
		orb.circle(0, 0, baseRadius * 2.5);
		orb.fill({color, alpha: 0.15});
		// Middle glow
		orb.circle(0, 0, baseRadius * 1.5);
		orb.fill({color, alpha: 0.3});
		// Inner glow
		orb.circle(0, 0, baseRadius);
		orb.fill({color, alpha: 0.6});
		// Core
		orb.circle(0, 0, baseRadius * 0.5);
		orb.fill({color: 0xffffff, alpha: 0.95});
	}

	private spawnTrail(x: number, y: number) {
		const trail = new Graphics();
		const radius = this.magicIsCritical ? 4 : 3;
		const color = this.magicIsCritical ? 0xffdd44 : 0x44aaff;
		trail.circle(0, 0, radius);
		trail.fill({color, alpha: 0.5});
		trail.x = this.x + x;
		trail.y = this.y + y;
		trail.zIndex = 1000;
		this.parent!.addChild(trail);
		this.magicTrails.push({graphic: trail, life: 300});
	}

	/** Removes a graphic from the parent, destroys it, and returns null for reassignment. */
	private updateSparkles(time: Ticker) {
		if (this.sparkleInterval === 0) return;

		// Spawn new sparkles
		this.sparkleTimer += time.deltaMS;
		if (this.sparkleTimer >= this.sparkleInterval && this.sparkles.length < this.sparkleMaxCount) {
			this.sparkleTimer = 0;
			const maxLife = 800 + Math.random() * 600;
			const angle = Math.random() * Math.PI * 2;
			const sparkle = new Graphics();
			sparkle.star(0, 0, 4, 4, 1.5);
			sparkle.fill({color: 0xffee88});
			sparkle.zIndex = 999;
			// Spawn around the wizard sprite
			const spawnRadius = 30 + Math.random() * 40;
			sparkle.x = this.x + Math.cos(angle) * spawnRadius;
			sparkle.y = this.y - 80 - Math.random() * 120;
			this.parent!.addChild(sparkle);
			this.sparkles.push({
				graphic: sparkle,
				life: maxLife,
				maxLife,
				vx: (Math.random() - 0.5) * 0.02,
				vy: -0.02 - Math.random() * 0.03,
			});
		}

		// Update existing sparkles
		for (let i = this.sparkles.length - 1; i >= 0; i--) {
			const s = this.sparkles[i]!;
			s.life -= time.deltaMS;
			const t = s.life / s.maxLife;
			s.graphic.alpha = t * 0.8;
			s.graphic.scale.set(0.5 + t * 0.5);
			s.graphic.x += s.vx * time.deltaMS;
			s.graphic.y += s.vy * time.deltaMS;
			if (s.life <= 0) {
				this.parent!.removeChild(s.graphic);
				s.graphic.destroy();
				this.sparkles.splice(i, 1);
			}
		}
	}

	private removeGraphic(g: Graphics): null {
		this.parent!.removeChild(g);
		g.destroy();
		return null;
	}

	/** Updates a burst array (missiles/frost). Returns remaining count. */
	private updateBurstArray(
		bursts: { graphic: Graphics; progress: number }[],
		duration: number,
		maxScale: number,
		maxAlpha: number,
		deltaMS: number,
	): number {
		for (let i = bursts.length - 1; i >= 0; i--) {
			const burst = bursts[i]!;
			burst.progress += deltaMS;
			const t = Math.min(burst.progress / duration, 1);
			burst.graphic.scale.set(maxScale * t);
			burst.graphic.alpha = (1 - t) * maxAlpha;

			if (t >= 1) {
				this.removeGraphic(burst.graphic);
				bursts.splice(i, 1);
			}
		}
		return bursts.length;
	}

	override update(time: Ticker, isSine: boolean) {
		super.update(time, isSine);

		this.updateSparkles(time);

		const hasWork =
			this.magic.isCasting ||
			this.magicBurst.isBursting ||
			this.area.isCasting ||
			this.missiles.isCasting || this.missileBursts.length > 0 ||
			this.lightning.isCasting || this.lightningBurst.isBursting ||
			this.fireBolt.isCasting || this.fireBoltBurst.isBursting ||
			this.frost.isCasting || this.frostBursts.length > 0 ||
			this.beam.isCasting ||
			this.meteor.isCasting || this.meteorBurst.isBursting ||
			this.magicTrails.length > 0 || this.levelUp_.isCasting || this.levelUpParticles.length > 0;
		if (!hasWork) return;

		if (this.magicLastTime === 0) {
			this.magicLastTime = time.lastTime;
			return;
		}


		// Update trail particles
		for (let i = this.magicTrails.length - 1; i >= 0; i--) {
			const trail = this.magicTrails[i]!;
			trail.life -= time.deltaMS;
			trail.graphic.alpha = Math.max(0, trail.life / 300) * 0.5;
			trail.graphic.scale.set(Math.max(0.01, trail.life / 300));
			if (trail.life <= 0) {
				this.removeGraphic(trail.graphic);
				this.magicTrails.splice(i, 1);
			}
		}

		// Orb flight animation
		if (this.magic.isCasting && this.magicOrb) {
			const t = this.magic.advance(time.deltaMS);

			// Ease-in for accelerating projectile
			const eased = t * t;

			const startX = 100;
			const startY = -180;
			const endX = this.magic.targetX;
			const endY = this.magic.targetY;

			const orbX = startX + (endX - startX) * eased;
			const orbY =
				startY + (endY - startY) * eased - Math.sin(t * Math.PI) * 50;

			this.magicOrb.x = this.x + orbX;
			this.magicOrb.y = this.y + orbY;

			// Critical hit: pulsing glow
			if (this.magicIsCritical) {
				const pulse = 1 + Math.sin(t * Math.PI * 6) * 0.15;
				this.magicOrb.scale.set(pulse);
			}

			// Spawn trail particles along the path
			if (t > 0.05 && t < 0.9 && Math.random() < 0.5) {
				this.spawnTrail(orbX, orbY);
			}

			if (t >= 1) {
				const burstX = this.magicOrb.x;
				const burstY = this.magicOrb.y;
				this.magicOrb = this.removeGraphic(this.magicOrb);
				this.magic.isCasting = false;

				// Start impact burst
				const color = this.magicIsCritical ? 0xffdd44 : 0x44aaff;
				this.magicBurst.start(this, burstX, burstY, color, 0.6);
			}
		}

		// Magic missile animation
		if (this.missiles.isCasting) {
			let allHit = true;
			for (const missile of this.missileProjectiles) {
				if (missile.hit) continue;

				if (missile.startDelay > 0) {
					missile.startDelay -= time.deltaMS;
					allHit = false;
					continue;
				}

				missile.graphic.visible = true;
				missile.progress += time.deltaMS;
				const t = Math.min(missile.progress / this.missiles.duration, 1);

				const eased = t * t;

				const startX = 80;
				const startY = -160;
				const endX = this.missiles.targetX;
				const endY = this.missiles.targetY;

				const x = startX + (endX - startX) * eased;
				const y = startY + (endY - startY) * eased + Math.sin(t * Math.PI) * missile.offsetY;

				missile.graphic.x = this.x + x;
				missile.graphic.y = this.y + y;

				if (t > 0.05 && t < 0.9 && Math.random() < 0.4) {
					this.spawnMissileTrail(x, y);
				}

				if (t >= 1) {
					missile.hit = true;
					this.removeGraphic(missile.graphic);

					// Small impact burst
					const burst = new Graphics();
					burst.circle(0, 0, 1);
					burst.fill({color: 0xcc44ff, alpha: 0.6});
					burst.x = this.x + endX;
					burst.y = this.y + endY;
					burst.zIndex = 1000;
					this.parent!.addChild(burst);
					this.missileBursts.push({graphic: burst, progress: 0});
				} else {
					allHit = false;
				}
			}

			if (allHit && this.missileBursts.length === 0) {
				this.magicLastTime = 0;
				this.missiles.complete();
			}
		}

		// Magic missile bursts
		this.updateBurstArray(this.missileBursts, this.missileBurstDuration, 15, 0.6, time.deltaMS);

		// Resolve missiles when all bursts done
		if (this.missiles.isCasting && this.missileProjectiles.every(m => m.hit) && this.missileBursts.length === 0) {
			this.magicLastTime = 0;
			this.missiles.complete();
		}

		// Area attack ring animation
		if (this.area.isCasting && this.areaRing) {
			const t = this.area.advance(time.deltaMS);

			const maxScale = 60;
			const currentScale = maxScale * (0.1 + t * 0.9);
			this.areaRing.scale.set(currentScale);
			this.areaRing.alpha = (1 - t * t) * 0.8;

			// Spawn trail particles along ring edge
			if (t > 0.05 && t < 0.8 && Math.random() < 0.6) {
				const actualRadius = 10 * currentScale;
				const angle = Math.random() * Math.PI * 2;
				const px = this.x + Math.cos(angle) * actualRadius;
				const py = this.y - 80 + Math.sin(angle) * actualRadius;
				this.spawnAreaTrail(px, py);
			}

			if (t >= 1) {
				this.areaRing = this.removeGraphic(this.areaRing);
				this.magicLastTime = 0;
				this.area.complete();
			}
		}

		// Lightning bolt animation
		if (this.lightning.isCasting && this.lightningBolt) {
			const t = this.lightning.advance(time.deltaMS);

			const startX = this.x + 100;
			const startY = this.y - 180;

			// Redraw jagged bolt each frame for flicker effect
			this.drawLightningBolt(this.lightningBolt, startX, startY, this.lightning.targetX, this.lightning.targetY);
			this.lightningBolt.alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;

			if (t >= 1) {
				const burstX = this.lightning.targetX;
				const burstY = this.lightning.targetY;
				this.lightningBolt = this.removeGraphic(this.lightningBolt);
				this.lightning.isCasting = false;

				this.lightningBurst.start(this, burstX, burstY, 0x88ccff, 0.7);
			}
		}

		if (this.lightningBurst.isBursting && this.lightningBurst.graphic) {
			const t = this.lightningBurst.advance(time.deltaMS);
			this.lightningBurst.graphic.scale.set(30 * t);
			this.lightningBurst.graphic.alpha = (1 - t) * 0.7;

			if (t >= 1) {
				this.lightningBurst.finish(this);
				this.magicLastTime = 0;
				this.lightning.complete();
			}
		}

		// Fire bolt animation
		if (this.fireBolt.isCasting && this.fireBoltOrb) {
			const t = this.fireBolt.advance(time.deltaMS);
			const eased = t * t;

			const startX = 100;
			const startY = -180;
			const endX = this.fireBolt.targetX;
			const endY = this.fireBolt.targetY;

			const orbX = startX + (endX - startX) * eased;
			const orbY = startY + (endY - startY) * eased - Math.sin(t * Math.PI) * 60;

			this.fireBoltOrb.x = this.x + orbX;
			this.fireBoltOrb.y = this.y + orbY;

			const pulse = 1 + Math.sin(t * Math.PI * 8) * 0.1;
			this.fireBoltOrb.scale.set(pulse);

			if (t > 0.05 && t < 0.9 && Math.random() < 0.6) {
				this.spawnFireTrail(orbX, orbY);
			}

			if (t >= 1) {
				const burstX = this.fireBoltOrb.x;
				const burstY = this.fireBoltOrb.y;
				this.fireBoltOrb = this.removeGraphic(this.fireBoltOrb);
				this.fireBolt.isCasting = false;

				this.fireBoltBurst.start(this, burstX, burstY, 0xff6600, 0.7);
			}
		}

		if (this.fireBoltBurst.isBursting && this.fireBoltBurst.graphic) {
			const t = this.fireBoltBurst.advance(time.deltaMS);
			this.fireBoltBurst.graphic.scale.set(35 * t);
			this.fireBoltBurst.graphic.alpha = (1 - t) * 0.7;

			if (t >= 1) {
				this.fireBoltBurst.finish(this);
				this.magicLastTime = 0;
				this.fireBolt.complete();
			}
		}

		// Frost shard animation
		if (this.frost.isCasting) {
			let allHit = true;
			for (const shard of this.frostShards) {
				if (shard.hit) continue;

				shard.progress += time.deltaMS;
				if (shard.progress <= 0) {
					allHit = false;
					continue;
				}

				shard.graphic.visible = true;
				const t = Math.min(shard.progress / this.frost.duration, 1);
				const eased = t * t;

				const startX = 80;
				const startY = -160;
				const endX = this.frost.targetX;
				const endY = this.frost.targetY;

				const x = startX + (endX - startX) * eased;
				const y = startY + (endY - startY) * eased + Math.sin(t * Math.PI) * shard.offsetY;

				shard.graphic.x = this.x + x;
				shard.graphic.y = this.y + y;

				// Spin the shard
				shard.graphic.rotation = t * Math.PI * 4;

				if (t > 0.05 && t < 0.9 && Math.random() < 0.4) {
					this.spawnFrostTrail(x, y);
				}

				if (t >= 1) {
					shard.hit = true;
					this.removeGraphic(shard.graphic);

					const burst = new Graphics();
					burst.circle(0, 0, 1);
					burst.fill({color: 0x44ddff, alpha: 0.6});
					burst.x = this.x + endX;
					burst.y = this.y + endY;
					burst.zIndex = 1000;
					this.parent!.addChild(burst);
					this.frostBursts.push({graphic: burst, progress: 0});
				} else {
					allHit = false;
				}
			}

			if (allHit && this.frostBursts.length === 0) {
				this.magicLastTime = 0;
				this.frost.complete();
			}
		}

		// Frost shard bursts
		this.updateBurstArray(this.frostBursts, this.frostBurstDuration, 15, 0.6, time.deltaMS);

		// Resolve frost when all bursts done
		if (this.frost.isCasting && this.frostShards.every(s => s.hit) && this.frostBursts.length === 0) {
			this.magicLastTime = 0;
			this.frost.complete();
		}

		// Arcane beam animation
		if (this.beam.isCasting && this.beamGraphic) {
			const t = this.beam.advance(time.deltaMS);

			const startX = this.x + 100;
			const startY = this.y - 180;
			const endX = this.beam.targetX;
			const endY = this.beam.targetY;

			this.beamGraphic.clear();

			let beamEndX: number;
			let beamEndY: number;
			let alpha: number;
			let width: number;

			if (t < 0.2) {
				// Extend beam to target
				const extend = t / 0.2;
				beamEndX = startX + (endX - startX) * extend;
				beamEndY = startY + (endY - startY) * extend;
				alpha = 0.8;
				width = 6;
			} else if (t < 0.7) {
				// Full beam, pulsing width
				beamEndX = endX;
				beamEndY = endY;
				alpha = 0.8;
				width = 6 + Math.sin((t - 0.2) / 0.5 * Math.PI * 4) * 3;
			} else {
				// Fade out
				const fadeT = (t - 0.7) / 0.3;
				beamEndX = endX;
				beamEndY = endY;
				alpha = 0.8 * (1 - fadeT);
				width = 6 * (1 - fadeT);
			}

			// Outer glow
			this.beamGraphic.moveTo(startX, startY);
			this.beamGraphic.lineTo(beamEndX, beamEndY);
			this.beamGraphic.stroke({color: 0x9944ff, alpha: alpha * 0.3, width: width * 3});

			// Main beam
			this.beamGraphic.moveTo(startX, startY);
			this.beamGraphic.lineTo(beamEndX, beamEndY);
			this.beamGraphic.stroke({color: 0xbb66ff, alpha: alpha * 0.6, width: width});

			// Core
			this.beamGraphic.moveTo(startX, startY);
			this.beamGraphic.lineTo(beamEndX, beamEndY);
			this.beamGraphic.stroke({color: 0xffffff, alpha: alpha * 0.9, width: Math.max(1, width * 0.3)});

			// Beam particles
			if (t > 0.1 && t < 0.8 && Math.random() < 0.5) {
				const particleT = Math.random();
				const px = startX + (beamEndX - startX) * particleT;
				const py = startY + (beamEndY - startY) * particleT;
				const trail = new Graphics();
				trail.circle(0, 0, 2);
				trail.fill({color: 0xbb66ff, alpha: 0.5});
				trail.x = px + (Math.random() - 0.5) * 10;
				trail.y = py + (Math.random() - 0.5) * 10;
				trail.zIndex = 1000;
				this.parent!.addChild(trail);
				this.magicTrails.push({graphic: trail, life: 200});
			}

			if (t >= 1) {
				this.beamGraphic = this.removeGraphic(this.beamGraphic);
				this.magicLastTime = 0;
				this.beam.complete();
			}
		}

		// Meteor strike animation
		if (this.meteor.isCasting && this.meteorGraphic) {
			const t = this.meteor.advance(time.deltaMS);

			// Falls diagonally from upper-right
			const startX = this.meteor.targetX + 150;
			const startY = -100;
			const endX = this.meteor.targetX;
			const endY = this.meteor.targetY;

			const eased = t * t;

			this.meteorGraphic.x = startX + (endX - startX) * eased;
			this.meteorGraphic.y = startY + (endY - startY) * eased;

			const scale = 0.5 + t * 0.5;
			this.meteorGraphic.scale.set(scale);

			if (t > 0.05 && t < 0.95 && Math.random() < 0.6) {
				this.spawnMeteorTrail(this.meteorGraphic.x, this.meteorGraphic.y);
			}

			if (t >= 1) {
				const burstX = this.meteorGraphic.x;
				const burstY = this.meteorGraphic.y;
				this.meteorGraphic = this.removeGraphic(this.meteorGraphic);
				this.meteor.isCasting = false;

				this.meteorBurst.start(this, burstX, burstY, 0xff6600, 0.8);
			}
		}

		if (this.meteorBurst.isBursting && this.meteorBurst.graphic) {
			const t = this.meteorBurst.advance(time.deltaMS);
			this.meteorBurst.graphic.scale.set(50 * t);
			this.meteorBurst.graphic.alpha = (1 - t) * 0.8;

			if (t >= 1) {
				this.meteorBurst.finish(this);
				this.magicLastTime = 0;
				this.meteor.complete();
			}
		}

		// Level-up animation
		if (this.levelUp_.isCasting) {
			const t = this.levelUp_.advance(time.deltaMS);
			const centerX = this.x;
			const centerY = this.y - 80;

			// Update glow effect
			this.updateLevelUpGlow(t);

			// Phase 1: Rising particles (0 - 0.45)
			if (t < 0.45 && Math.random() < 0.6) {
				this.spawnLevelUpParticle(centerX, centerY, "rise");
			}

			// Phase 2: Flash and texture swap (0.4 - 0.55)
			if (this.levelUpFlash) {
				if (t >= 0.4 && t < 0.55) {
					const flashT = (t - 0.4) / 0.15;
					// Flash peaks at 0.475 then fades
					const flashAlpha =
						flashT < 0.5
							? flashT * 2 * 0.7
							: (1 - (flashT - 0.5) * 2) * 0.7;
					this.levelUpFlash.alpha = Math.max(0, flashAlpha);
				} else {
					this.levelUpFlash.alpha = 0;
				}
			}

			// Swap texture at peak flash
			if (
				!this.levelUpTextureSwapped &&
				t >= 0.475 &&
				this.levelUpNewTexture
			) {
				this.sprite.texture = this.levelUpNewTexture;
				this.levelUpTextureSwapped = true;
			}

			// Scale pulse around the swap point
			if (t >= 0.35 && t < 0.7) {
				const pulseT = (t - 0.35) / 0.35;
				const pulse = 1 + Math.sin(pulseT * Math.PI) * 0.15;
				this.sprite.scale.set(0.1 * pulse);
			} else {
				this.sprite.scale.set(0.1);
			}

			// Phase 3: Burst particles (0.5 - 0.7)
			if (t >= 0.5 && t < 0.7 && Math.random() < 0.5) {
				this.spawnLevelUpParticle(centerX, centerY, "burst");
			}

			// Complete
			if (t >= 1) {
				this.sprite.scale.set(0.1);

				if (this.levelUpGlow) {
					this.levelUpGlow = this.removeGraphic(this.levelUpGlow);
				}
				if (this.levelUpFlash) {
					this.levelUpFlash = this.removeGraphic(this.levelUpFlash);
				}

				this.levelUpNewTexture = null;
				this.magicLastTime = 0;

				this.levelUp_.complete();
			}
		}

		// Update level-up particles
		for (let i = this.levelUpParticles.length - 1; i >= 0; i--) {
			const p = this.levelUpParticles[i]!;
			p.life -= time.deltaMS;
			p.graphic.x += p.vx * time.deltaMS;
			p.graphic.y += p.vy * time.deltaMS;
			const lifeRatio = Math.max(0, p.life);
			p.graphic.alpha = lifeRatio * 0.8;
			p.graphic.scale.set(Math.max(0.01, lifeRatio));
			if (p.life <= 0) {
				this.removeGraphic(p.graphic);
				this.levelUpParticles.splice(i, 1);
			}
		}

		// Impact burst animation
		if (this.magicBurst.isBursting && this.magicBurst.graphic) {
			const t = this.magicBurst.advance(time.deltaMS);
			const maxScale = this.magicIsCritical ? 40 : 25;
			this.magicBurst.graphic.scale.set(maxScale * t);
			this.magicBurst.graphic.alpha = (1 - t) * 0.6;

			if (t >= 1) {
				this.magicBurst.finish(this);
				this.magicLastTime = 0;
				this.magic.complete();
			}
		}
	}
}

let wizardTexture: Texture;
let wizardTextureLevel: number;

export async function initWizard(xp: number) {
	const level = Math.min(getWizardLevel(xp), 7);
	if (wizardTextureLevel === level) return wizardTexture;
	wizardTextureLevel = level;
	wizardTexture = await Assets.load(`assets/wizard${level}.png`);
	return wizardTexture;
}

export function getWizardLevel(xp: number): number {
	if (xp < 51) {
		return 1;
	}
	return Math.ceil((xp - 50) / 100) + 1;
}

/** Returns 0..1 progress within the current level toward the next level. */
export function getXpProgress(xp: number): number {
	if (xp < 51) {
		return xp / 51;
	}
	return ((xp - 51) % 100) / 100;
}
