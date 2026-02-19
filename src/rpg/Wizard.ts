import {Assets, Graphics, Texture} from "pixi.js";
import {Actor} from "./Actor.ts";

export class Wizard extends Actor {
	private isCastingMagic: boolean = false;
	private resolveMagic: (() => void) | null = null;
	private magicOrb: Graphics | null = null;
	private magicTrails: { graphic: Graphics; life: number }[] = [];
	private magicProgress: number = 0;
	private magicDuration: number = 0.4;
	private magicIsCritical: boolean = false;
	private magicLastTime: number = 0;
	private magicTargetX: number = 0;
	private magicTargetY: number = 0;
	private magicBurst: Graphics | null = null;
	private burstProgress: number = 0;
	private burstDuration: number = 0.2;
	private isBursting: boolean = false;

	private isAreaCasting: boolean = false;
	private resolveAreaMagic: (() => void) | null = null;
	private areaRing: Graphics | null = null;
	private areaProgress: number = 0;
	private areaDuration: number = 0.6;

	// Magic missile state
	private isCastingMissiles: boolean = false;
	private resolveMissiles: (() => void) | null = null;
	private missiles: { graphic: Graphics; progress: number; startDelay: number; offsetY: number; hit: boolean }[] = [];
	private missileDuration: number = 0.35;
	private missileTargetX: number = 0;
	private missileTargetY: number = 0;
	private missileBursts: { graphic: Graphics; progress: number }[] = [];
	private missileBurstDuration: number = 0.15;

	// Level-up animation state
	private isLevelingUp: boolean = false;
	private resolveLevelUp: (() => void) | null = null;
	private levelUpProgress: number = 0;
	private levelUpDuration: number = 1.5;
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
	private isCastingLightning: boolean = false;
	private resolveLightning: (() => void) | null = null;
	private lightningProgress: number = 0;
	private lightningDuration: number = 0.3;
	private lightningBolt: Graphics | null = null;
	private lightningTargetX: number = 0;
	private lightningTargetY: number = 0;
	private lightningBurst: Graphics | null = null;
	private lightningBurstProgress: number = 0;
	private isLightningBursting: boolean = false;
	private lightningBurstDuration: number = 0.15;

	// Fire bolt state
	private isCastingFireBolt: boolean = false;
	private resolveFireBolt: (() => void) | null = null;
	private fireBoltProgress: number = 0;
	private fireBoltDuration: number = 0.4;
	private fireBoltOrb: Graphics | null = null;
	private fireBoltTargetX: number = 0;
	private fireBoltTargetY: number = 0;
	private fireBoltBurst: Graphics | null = null;
	private fireBoltBurstProgress: number = 0;
	private isFireBoltBursting: boolean = false;
	private fireBoltBurstDuration: number = 0.2;

	// Frost shard state
	private isCastingFrost: boolean = false;
	private resolveFrost: (() => void) | null = null;
	private frostShards: { graphic: Graphics; progress: number; offsetY: number; hit: boolean }[] = [];
	private frostDuration: number = 0.3;
	private frostTargetX: number = 0;
	private frostTargetY: number = 0;
	private frostBursts: { graphic: Graphics; progress: number }[] = [];
	private frostBurstDuration: number = 0.15;

	// Arcane beam state
	private isCastingBeam: boolean = false;
	private resolveBeam: (() => void) | null = null;
	private beamProgress: number = 0;
	private beamDuration: number = 0.5;
	private beamGraphic: Graphics | null = null;
	private beamTargetX: number = 0;
	private beamTargetY: number = 0;

	// Meteor strike state
	private isCastingMeteor: boolean = false;
	private resolveMeteor: (() => void) | null = null;
	private meteorProgress: number = 0;
	private meteorDuration: number = 0.5;
	private meteorGraphic: Graphics | null = null;
	private meteorTargetX: number = 0;
	private meteorTargetY: number = 0;
	private meteorBurst: Graphics | null = null;
	private meteorBurstProgress: number = 0;
	private isMeteorBursting: boolean = false;
	private meteorBurstDuration: number = 0.25;

	constructor(xp: number) {
		const xpFactor = 1 + xp / 100;
		super({
			texture: wizardTexture,
			textureScale: 0.1,
			health: Math.floor(100 * xpFactor),
			attackPower: Math.floor(5 * xpFactor),
			defensePower: Math.floor(xpFactor),
			speed: Math.floor(6 * xpFactor),
			xpDrop: 0,
		});
	}

	updateHealthBar() {
		const ratio = Math.max(this.health / this.maxHealth, 0.02);
		this.healthBar.setHealth(ratio);
	}

	override async attack(defenders: Actor[]): Promise<{
		target: Actor;
		damage: number;
	}[]> {
		let isCritical = false;
		await this.twitch();

		const level = getWizardLevel(this.xp);

		const target = defenders[0]!;

		let damage = this.attackPower;


		if (level > 1) {
			if (Math.random() < 0.25) {
				isCritical = true;
				damage *= 2;
			}
		}

		await this.castMagic(isCritical, target);
		return [{
			target,
			damage
		}];
	}

	castMagic(isCritical: boolean, defender: Actor): Promise<void> {
		this.isCastingMagic = true;
		this.magicProgress = 0;
		this.magicIsCritical = isCritical;
		this.magicLastTime = 0;
		this.isBursting = false;
		this.magicTrails = [];
		this.magicTargetX = defender.x - this.x;
		this.magicTargetY = defender.y - this.y - 80;

		const orb = new Graphics();
		this.drawOrb(orb, isCritical);
		this.magicOrb = orb;
		orb.zIndex = 1000;
		this.parent!.addChild(orb);

		return new Promise((resolve) => {
			if (this.resolveMagic) {
				this.resolveMagic();
			}
			this.resolveMagic = resolve;
		});
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
		this.isCastingMissiles = true;
		this.missileTargetX = defender.x - this.x;
		this.missileTargetY = defender.y - this.y - 80;
		this.magicLastTime = 0;
		this.missiles = [];
		this.missileBursts = [];

		const offsets = [-35, 0, 35];
		for (let i = 0; i < 3; i++) {
			const missile = new Graphics();
			this.drawMissile(missile);
			missile.zIndex = 1000;
			missile.visible = false;
			this.parent!.addChild(missile);
			this.missiles.push({
				graphic: missile,
				progress: 0,
				startDelay: i * 0.07,
				offsetY: offsets[i]!,
				hit: false
			});
		}

		return new Promise((resolve) => {
			if (this.resolveMissiles) {
				this.resolveMissiles();
			}
			this.resolveMissiles = resolve;
		});
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
		this.magicTrails.push({graphic: trail, life: 0.2});
	}

	castAreaMagic(): Promise<void> {
		this.isAreaCasting = true;
		this.areaProgress = 0;
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

		return new Promise((resolve) => {
			if (this.resolveAreaMagic) {
				this.resolveAreaMagic();
			}
			this.resolveAreaMagic = resolve;
		});
	}

	// --- Lightning Bolt ---

	async lightningBoltAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castLightningBolt(defender);
		return this.attackPower;
	}

	castLightningBolt(defender: Actor): Promise<void> {
		this.isCastingLightning = true;
		this.lightningProgress = 0;
		this.magicLastTime = 0;
		this.isLightningBursting = false;
		this.lightningTargetX = defender.x;
		this.lightningTargetY = defender.y - 80;

		const bolt = new Graphics();
		bolt.zIndex = 1000;
		this.parent!.addChild(bolt);
		this.lightningBolt = bolt;

		return new Promise((resolve) => {
			if (this.resolveLightning) this.resolveLightning();
			this.resolveLightning = resolve;
		});
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
		this.isCastingFireBolt = true;
		this.fireBoltProgress = 0;
		this.magicLastTime = 0;
		this.isFireBoltBursting = false;
		this.fireBoltTargetX = defender.x - this.x;
		this.fireBoltTargetY = defender.y - this.y - 80;

		const orb = new Graphics();
		this.drawFireBoltOrb(orb);
		this.fireBoltOrb = orb;
		orb.zIndex = 1000;
		this.parent!.addChild(orb);

		return new Promise((resolve) => {
			if (this.resolveFireBolt) this.resolveFireBolt();
			this.resolveFireBolt = resolve;
		});
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
		this.magicTrails.push({graphic: trail, life: 0.3});
	}

	// --- Frost Shard ---

	async frostShardAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castFrostShard(defender);
		return this.attackPower;
	}

	castFrostShard(defender: Actor): Promise<void> {
		this.isCastingFrost = true;
		this.magicLastTime = 0;
		this.frostShards = [];
		this.frostBursts = [];
		this.frostTargetX = defender.x - this.x;
		this.frostTargetY = defender.y - this.y - 80;

		const offsets = [-30, -15, 0, 15, 30];
		for (let i = 0; i < 5; i++) {
			const shard = new Graphics();
			this.drawFrostShard(shard);
			shard.zIndex = 1000;
			shard.visible = false;
			this.parent!.addChild(shard);
			this.frostShards.push({
				graphic: shard,
				progress: 0,
				offsetY: offsets[i]!,
				hit: false,
			});
		}

		return new Promise((resolve) => {
			if (this.resolveFrost) this.resolveFrost();
			this.resolveFrost = resolve;
		});
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
		this.magicTrails.push({graphic: trail, life: 0.2});
	}

	// --- Arcane Beam ---

	async arcaneBeamAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castArcaneBeam(defender);
		return this.attackPower;
	}

	castArcaneBeam(defender: Actor): Promise<void> {
		this.isCastingBeam = true;
		this.beamProgress = 0;
		this.magicLastTime = 0;
		this.beamTargetX = defender.x;
		this.beamTargetY = defender.y - 80;

		const beam = new Graphics();
		beam.zIndex = 1000;
		this.parent!.addChild(beam);
		this.beamGraphic = beam;

		return new Promise((resolve) => {
			if (this.resolveBeam) this.resolveBeam();
			this.resolveBeam = resolve;
		});
	}

	// --- Meteor Strike ---

	async meteorStrikeAttack(defender: Actor): Promise<number> {
		await this.twitch();
		await this.castMeteorStrike(defender);
		return this.attackPower;
	}

	castMeteorStrike(defender: Actor): Promise<void> {
		this.isCastingMeteor = true;
		this.meteorProgress = 0;
		this.magicLastTime = 0;
		this.isMeteorBursting = false;
		this.meteorTargetX = defender.x;
		this.meteorTargetY = defender.y - 80;

		const meteor = new Graphics();
		this.drawMeteor(meteor);
		meteor.zIndex = 1000;
		this.parent!.addChild(meteor);
		this.meteorGraphic = meteor;

		return new Promise((resolve) => {
			if (this.resolveMeteor) this.resolveMeteor();
			this.resolveMeteor = resolve;
		});
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
		this.magicTrails.push({graphic: trail, life: 0.35});
	}

	levelUpStats(newXp: number) {
		this.xp += newXp;
		const xpFactor = 1 + newXp / 100;
		this.maxHealth = Math.floor(100 * xpFactor);
		this.health = this.maxHealth;
		this.attackPower = Math.floor(5 * xpFactor);
		this.defensePower = Math.floor(xpFactor);
		this.speed = Math.floor(6 * xpFactor);
	}

	async levelUp(newXp: number): Promise<void> {
		const newLevel = getWizardLevel(newXp);
		const newTexturePath = `assets/wizard${newLevel}.png`;
		this.levelUpNewTexture = await Assets.load(newTexturePath);

		// Update stats
		this.levelUpStats(newXp);
		this.updateHealthBar();

		this.isLevelingUp = true;
		this.levelUpProgress = 0;
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

		return new Promise((resolve) => {
			if (this.resolveLevelUp) {
				this.resolveLevelUp();
			}
			this.resolveLevelUp = resolve;
		});
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
		this.magicTrails.push({graphic: trail, life: 0.3});
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
		this.magicTrails.push({graphic: trail, life: 0.3});
	}

	override update(time: number, isSine: boolean) {
		super.update(time, isSine);

		const hasWork =
			this.isCastingMagic ||
			this.isBursting ||
			this.isAreaCasting ||
			this.isCastingMissiles || this.missileBursts.length > 0 ||
			this.isCastingLightning || this.isLightningBursting ||
			this.isCastingFireBolt || this.isFireBoltBursting ||
			this.isCastingFrost || this.frostBursts.length > 0 ||
			this.isCastingBeam ||
			this.isCastingMeteor || this.isMeteorBursting ||
			this.magicTrails.length > 0 || this.isLevelingUp || this.levelUpParticles.length > 0;
		if (!hasWork) return;

		if (this.magicLastTime === 0) {
			this.magicLastTime = time;
			return;
		}

		const delta = (time - this.magicLastTime) / 1000;
		this.magicLastTime = time;

		// Update trail particles
		for (let i = this.magicTrails.length - 1; i >= 0; i--) {
			const trail = this.magicTrails[i]!;
			trail.life -= delta;
			trail.graphic.alpha = Math.max(0, trail.life / 0.3) * 0.5;
			trail.graphic.scale.set(Math.max(0.01, trail.life / 0.3));
			if (trail.life <= 0) {
				this.parent!.removeChild(trail.graphic);
				trail.graphic.destroy();
				this.magicTrails.splice(i, 1);
			}
		}

		// Orb flight animation
		if (this.isCastingMagic && this.magicOrb) {
			this.magicProgress += delta;
			const t = Math.min(this.magicProgress / this.magicDuration, 1);

			// Ease-in for accelerating projectile
			const eased = t * t;

			const startX = 100;
			const startY = -180;
			const endX = this.magicTargetX;
			const endY = this.magicTargetY;

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
				this.parent!.removeChild(this.magicOrb);
				this.magicOrb.destroy();
				this.magicOrb = null;
				this.isCastingMagic = false;

				// Start impact burst
				this.isBursting = true;
				this.burstProgress = 0;
				const burst = new Graphics();
				const color = this.magicIsCritical ? 0xffdd44 : 0x44aaff;
				burst.circle(0, 0, 1);
				burst.fill({color, alpha: 0.6});
				burst.x = burstX;
				burst.y = burstY;
				this.magicBurst = burst;
				burst.zIndex = 1000;
				this.parent!.addChild(burst);
			}
		}

		// Magic missile animation
		if (this.isCastingMissiles) {
			let allHit = true;
			for (const missile of this.missiles) {
				if (missile.hit) continue;

				if (missile.startDelay > 0) {
					missile.startDelay -= delta;
					allHit = false;
					continue;
				}

				missile.graphic.visible = true;
				missile.progress += delta;
				const t = Math.min(missile.progress / this.missileDuration, 1);

				const eased = t * t;

				const startX = 80;
				const startY = -160;
				const endX = this.missileTargetX;
				const endY = this.missileTargetY;

				const x = startX + (endX - startX) * eased;
				const y = startY + (endY - startY) * eased + Math.sin(t * Math.PI) * missile.offsetY;

				missile.graphic.x = this.x + x;
				missile.graphic.y = this.y + y;

				if (t > 0.05 && t < 0.9 && Math.random() < 0.4) {
					this.spawnMissileTrail(x, y);
				}

				if (t >= 1) {
					missile.hit = true;
					this.parent!.removeChild(missile.graphic);
					missile.graphic.destroy();

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
				this.isCastingMissiles = false;
				this.magicLastTime = 0;
				if (this.resolveMissiles) {
					this.resolveMissiles();
					this.resolveMissiles = null;
				}
			}
		}

		// Magic missile bursts
		for (let i = this.missileBursts.length - 1; i >= 0; i--) {
			const burst = this.missileBursts[i]!;
			burst.progress += delta;
			const t = Math.min(burst.progress / this.missileBurstDuration, 1);
			burst.graphic.scale.set(15 * t);
			burst.graphic.alpha = (1 - t) * 0.6;

			if (t >= 1) {
				this.parent!.removeChild(burst.graphic);
				burst.graphic.destroy();
				this.missileBursts.splice(i, 1);
			}
		}

		// Resolve missiles when all bursts done
		if (this.isCastingMissiles && this.missiles.every(m => m.hit) && this.missileBursts.length === 0) {
			this.isCastingMissiles = false;
			this.magicLastTime = 0;
			if (this.resolveMissiles) {
				this.resolveMissiles();
				this.resolveMissiles = null;
			}
		}

		// Area attack ring animation
		if (this.isAreaCasting && this.areaRing) {
			this.areaProgress += delta;
			const t = Math.min(this.areaProgress / this.areaDuration, 1);

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
				this.parent!.removeChild(this.areaRing);
				this.areaRing.destroy();
				this.areaRing = null;
				this.isAreaCasting = false;
				this.magicLastTime = 0;
				if (this.resolveAreaMagic) {
					this.resolveAreaMagic();
					this.resolveAreaMagic = null;
				}
			}
		}

		// Lightning bolt animation
		if (this.isCastingLightning && this.lightningBolt) {
			this.lightningProgress += delta;
			const t = Math.min(this.lightningProgress / this.lightningDuration, 1);

			const startX = this.x + 100;
			const startY = this.y - 180;

			// Redraw jagged bolt each frame for flicker effect
			this.drawLightningBolt(this.lightningBolt, startX, startY, this.lightningTargetX, this.lightningTargetY);
			this.lightningBolt.alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;

			if (t >= 1) {
				const burstX = this.lightningTargetX;
				const burstY = this.lightningTargetY;
				this.parent!.removeChild(this.lightningBolt);
				this.lightningBolt.destroy();
				this.lightningBolt = null;
				this.isCastingLightning = false;

				this.isLightningBursting = true;
				this.lightningBurstProgress = 0;
				const burst = new Graphics();
				burst.circle(0, 0, 1);
				burst.fill({color: 0x88ccff, alpha: 0.7});
				burst.x = burstX;
				burst.y = burstY;
				burst.zIndex = 1000;
				this.parent!.addChild(burst);
				this.lightningBurst = burst;
			}
		}

		if (this.isLightningBursting && this.lightningBurst) {
			this.lightningBurstProgress += delta;
			const t = Math.min(this.lightningBurstProgress / this.lightningBurstDuration, 1);
			this.lightningBurst.scale.set(30 * t);
			this.lightningBurst.alpha = (1 - t) * 0.7;

			if (t >= 1) {
				this.parent!.removeChild(this.lightningBurst);
				this.lightningBurst.destroy();
				this.lightningBurst = null;
				this.isLightningBursting = false;
				this.magicLastTime = 0;
				if (this.resolveLightning) {
					this.resolveLightning();
					this.resolveLightning = null;
				}
			}
		}

		// Fire bolt animation
		if (this.isCastingFireBolt && this.fireBoltOrb) {
			this.fireBoltProgress += delta;
			const t = Math.min(this.fireBoltProgress / this.fireBoltDuration, 1);
			const eased = t * t;

			const startX = 100;
			const startY = -180;
			const endX = this.fireBoltTargetX;
			const endY = this.fireBoltTargetY;

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
				this.parent!.removeChild(this.fireBoltOrb);
				this.fireBoltOrb.destroy();
				this.fireBoltOrb = null;
				this.isCastingFireBolt = false;

				this.isFireBoltBursting = true;
				this.fireBoltBurstProgress = 0;
				const burst = new Graphics();
				burst.circle(0, 0, 1);
				burst.fill({color: 0xff6600, alpha: 0.7});
				burst.x = burstX;
				burst.y = burstY;
				burst.zIndex = 1000;
				this.parent!.addChild(burst);
				this.fireBoltBurst = burst;
			}
		}

		if (this.isFireBoltBursting && this.fireBoltBurst) {
			this.fireBoltBurstProgress += delta;
			const t = Math.min(this.fireBoltBurstProgress / this.fireBoltBurstDuration, 1);
			this.fireBoltBurst.scale.set(35 * t);
			this.fireBoltBurst.alpha = (1 - t) * 0.7;

			if (t >= 1) {
				this.parent!.removeChild(this.fireBoltBurst);
				this.fireBoltBurst.destroy();
				this.fireBoltBurst = null;
				this.isFireBoltBursting = false;
				this.magicLastTime = 0;
				if (this.resolveFireBolt) {
					this.resolveFireBolt();
					this.resolveFireBolt = null;
				}
			}
		}

		// Frost shard animation
		if (this.isCastingFrost) {
			let allHit = true;
			for (const shard of this.frostShards) {
				if (shard.hit) continue;

				shard.progress += delta;
				if (shard.progress <= 0) {
					allHit = false;
					continue;
				}

				shard.graphic.visible = true;
				const t = Math.min(shard.progress / this.frostDuration, 1);
				const eased = t * t;

				const startX = 80;
				const startY = -160;
				const endX = this.frostTargetX;
				const endY = this.frostTargetY;

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
					this.parent!.removeChild(shard.graphic);
					shard.graphic.destroy();

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
				this.isCastingFrost = false;
				this.magicLastTime = 0;
				if (this.resolveFrost) {
					this.resolveFrost();
					this.resolveFrost = null;
				}
			}
		}

		// Frost shard bursts
		for (let i = this.frostBursts.length - 1; i >= 0; i--) {
			const burst = this.frostBursts[i]!;
			burst.progress += delta;
			const t = Math.min(burst.progress / this.frostBurstDuration, 1);
			burst.graphic.scale.set(15 * t);
			burst.graphic.alpha = (1 - t) * 0.6;

			if (t >= 1) {
				this.parent!.removeChild(burst.graphic);
				burst.graphic.destroy();
				this.frostBursts.splice(i, 1);
			}
		}

		// Resolve frost when all bursts done
		if (this.isCastingFrost && this.frostShards.every(s => s.hit) && this.frostBursts.length === 0) {
			this.isCastingFrost = false;
			this.magicLastTime = 0;
			if (this.resolveFrost) {
				this.resolveFrost();
				this.resolveFrost = null;
			}
		}

		// Arcane beam animation
		if (this.isCastingBeam && this.beamGraphic) {
			this.beamProgress += delta;
			const t = Math.min(this.beamProgress / this.beamDuration, 1);

			const startX = this.x + 100;
			const startY = this.y - 180;
			const endX = this.beamTargetX;
			const endY = this.beamTargetY;

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
				this.magicTrails.push({graphic: trail, life: 0.2});
			}

			if (t >= 1) {
				this.parent!.removeChild(this.beamGraphic);
				this.beamGraphic.destroy();
				this.beamGraphic = null;
				this.isCastingBeam = false;
				this.magicLastTime = 0;
				if (this.resolveBeam) {
					this.resolveBeam();
					this.resolveBeam = null;
				}
			}
		}

		// Meteor strike animation
		if (this.isCastingMeteor && this.meteorGraphic) {
			this.meteorProgress += delta;
			const t = Math.min(this.meteorProgress / this.meteorDuration, 1);

			// Falls diagonally from upper-right
			const startX = this.meteorTargetX + 150;
			const startY = -100;
			const endX = this.meteorTargetX;
			const endY = this.meteorTargetY;

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
				this.parent!.removeChild(this.meteorGraphic);
				this.meteorGraphic.destroy();
				this.meteorGraphic = null;
				this.isCastingMeteor = false;

				this.isMeteorBursting = true;
				this.meteorBurstProgress = 0;
				const burst = new Graphics();
				burst.circle(0, 0, 1);
				burst.fill({color: 0xff6600, alpha: 0.8});
				burst.x = burstX;
				burst.y = burstY;
				burst.zIndex = 1000;
				this.parent!.addChild(burst);
				this.meteorBurst = burst;
			}
		}

		if (this.isMeteorBursting && this.meteorBurst) {
			this.meteorBurstProgress += delta;
			const t = Math.min(this.meteorBurstProgress / this.meteorBurstDuration, 1);
			this.meteorBurst.scale.set(50 * t);
			this.meteorBurst.alpha = (1 - t) * 0.8;

			if (t >= 1) {
				this.parent!.removeChild(this.meteorBurst);
				this.meteorBurst.destroy();
				this.meteorBurst = null;
				this.isMeteorBursting = false;
				this.magicLastTime = 0;
				if (this.resolveMeteor) {
					this.resolveMeteor();
					this.resolveMeteor = null;
				}
			}
		}

		// Level-up animation
		if (this.isLevelingUp) {
			this.levelUpProgress += delta;
			const t = Math.min(this.levelUpProgress / this.levelUpDuration, 1);
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
				this.isLevelingUp = false;
				this.sprite.scale.set(0.1);

				if (this.levelUpGlow) {
					this.parent!.removeChild(this.levelUpGlow);
					this.levelUpGlow.destroy();
					this.levelUpGlow = null;
				}
				if (this.levelUpFlash) {
					this.parent!.removeChild(this.levelUpFlash);
					this.levelUpFlash.destroy();
					this.levelUpFlash = null;
				}

				this.levelUpNewTexture = null;
				this.magicLastTime = 0;

				if (this.resolveLevelUp) {
					this.resolveLevelUp();
					this.resolveLevelUp = null;
				}
			}
		}

		// Update level-up particles
		for (let i = this.levelUpParticles.length - 1; i >= 0; i--) {
			const p = this.levelUpParticles[i]!;
			p.life -= delta;
			p.graphic.x += p.vx * delta;
			p.graphic.y += p.vy * delta;
			const lifeRatio = Math.max(0, p.life / 1.0);
			p.graphic.alpha = lifeRatio * 0.8;
			p.graphic.scale.set(Math.max(0.01, lifeRatio));
			if (p.life <= 0) {
				this.parent!.removeChild(p.graphic);
				p.graphic.destroy();
				this.levelUpParticles.splice(i, 1);
			}
		}

		// Impact burst animation
		if (this.isBursting && this.magicBurst) {
			this.burstProgress += delta;
			const t = Math.min(this.burstProgress / this.burstDuration, 1);
			const maxScale = this.magicIsCritical ? 40 : 25;
			this.magicBurst.scale.set(maxScale * t);
			this.magicBurst.alpha = (1 - t) * 0.6;

			if (t >= 1) {
				this.parent!.removeChild(this.magicBurst);
				this.magicBurst.destroy();
				this.magicBurst = null;
				this.isBursting = false;
				this.magicLastTime = 0;
				if (this.resolveMagic) {
					this.resolveMagic();
					this.resolveMagic = null;
				}
			}
		}
	}
}

let wizardTexture: Texture;
let wizardTextureLevel: number;

export async function initWizard(xp: number) {
	const level = getWizardLevel(xp);
	if (wizardTextureLevel === level) return;
	wizardTextureLevel = level;
	wizardTexture = await Assets.load(`assets/wizard${level}.png`);
}

export function getWizardLevel(xp: number): number {
	if (xp < 51) {
		return 1;
	}
	return Math.ceil((xp - 50) / 100) + 1;
}
