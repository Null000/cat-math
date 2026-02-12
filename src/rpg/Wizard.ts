import { Texture, Assets, Graphics } from 'pixi.js';
import { Actor } from './Actor.ts';

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

    // Level-up animation state
    private isLevelingUp: boolean = false;
    private resolveLevelUp: (() => void) | null = null;
    private levelUpProgress: number = 0;
    private levelUpDuration: number = 1.5;
    private levelUpGlow: Graphics | null = null;
    private levelUpFlash: Graphics | null = null;
    private levelUpParticles: { graphic: Graphics; life: number; vx: number; vy: number }[] = [];
    private levelUpNewTexture: Texture | null = null;
    private levelUpTextureSwapped: boolean = false;

    constructor(xp: number) {
        const xpFactor = 1 + xp / 100;
        super({
            texture: wizardTexture,
            textureScale: 0.1,
            health: Math.floor(100 * xpFactor),
            attackPower: Math.floor(5 * xpFactor),
            defensePower: Math.floor(xpFactor),
            speed: Math.floor(6 * xpFactor),
            xpDrop: 0
        });
    }

    updateHealthBar() {
        const ratio = Math.max(this.health / this.maxHealth, 0.02);
        this.healthBar.setHealth(ratio);
    }

    override async attack(defender: Actor): Promise<number> {
        // return super.attack(defender);
        const isCritical = false;
        await this.twitch();
        await this.castMagic(isCritical, defender);
        return isCritical ? this.attackPower * 2 : this.attackPower;
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

    private castAreaMagic(): Promise<void> {
        this.isAreaCasting = true;
        this.areaProgress = 0;
        this.magicLastTime = 0;

        const ring = new Graphics();
        const color = 0xaa44ff;
        // Outer glow
        ring.circle(0, 0, 10);
        ring.stroke({ color, alpha: 0.2, width: 12 });
        // Main ring
        ring.circle(0, 0, 10);
        ring.stroke({ color, alpha: 0.5, width: 4 });
        // Inner bright ring
        ring.circle(0, 0, 10);
        ring.stroke({ color: 0xddaaff, alpha: 0.7, width: 2 });
        // Core fill
        ring.circle(0, 0, 8);
        ring.fill({ color, alpha: 0.1 });

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

    async levelUp(newXp: number): Promise<void> {
        const newLevel = getWizardLevel(newXp);
        const newTexturePath = `assets/wizard${newLevel}.png`;
        this.levelUpNewTexture = await Assets.load(newTexturePath);

        // Update stats
        const xpFactor = 1 + newXp / 100;
        this.maxHealth = Math.floor(100 * xpFactor);
        this.health = this.maxHealth;
        this.attackPower = Math.floor(5 * xpFactor);
        this.defensePower = Math.floor(xpFactor);
        this.speed = Math.floor(6 * xpFactor);
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
        flash.fill({ color: 0xffffff, alpha: 0 });
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

    private spawnLevelUpParticle(centerX: number, centerY: number, phase: 'rise' | 'burst') {
        const particle = new Graphics();
        const size = 2 + Math.random() * 4;
        const colors = [0xffd700, 0xffea00, 0xffffff, 0xffb800];
        const color = colors[Math.floor(Math.random() * colors.length)]!;

        particle.circle(0, 0, size);
        particle.fill({ color, alpha: 0.8 });
        particle.zIndex = 9001;

        let vx: number;
        let vy: number;

        if (phase === 'rise') {
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
        this.levelUpParticles.push({ graphic: particle, life: 0.8 + Math.random() * 0.4, vx, vy });
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
            glowAlpha = 0.4 + (t - 0.35) / 0.15 * 0.3;
            glowRadius = 70 + ((t - 0.35) / 0.15) * 20;
        } else {
            // Fade out
            const p = Math.min((t - 0.5) / 0.5, 1);
            glowAlpha = 0.7 * (1 - p);
            glowRadius = 90 * (1 - p * 0.3);
        }

        // Outer glow
        this.levelUpGlow.circle(0, 0, glowRadius);
        this.levelUpGlow.fill({ color: 0xffd700, alpha: glowAlpha * 0.3 });
        // Middle glow
        this.levelUpGlow.circle(0, 0, glowRadius * 0.6);
        this.levelUpGlow.fill({ color: 0xffea00, alpha: glowAlpha * 0.5 });
        // Inner glow
        this.levelUpGlow.circle(0, 0, glowRadius * 0.3);
        this.levelUpGlow.fill({ color: 0xffffff, alpha: glowAlpha * 0.7 });
    }

    private spawnAreaTrail(x: number, y: number) {
        const trail = new Graphics();
        trail.circle(0, 0, 3);
        trail.fill({ color: 0xaa44ff, alpha: 0.5 });
        trail.x = x;
        trail.y = y;
        trail.zIndex = 100;
        this.parent!.addChild(trail);
        this.magicTrails.push({ graphic: trail, life: 0.3 });
    }

    private drawOrb(orb: Graphics, isCritical: boolean) {
        const baseRadius = isCritical ? 28 : 10;
        const color = isCritical ? 0xffdd44 : 0x44aaff;

        // Outer glow
        orb.circle(0, 0, baseRadius * 2.5);
        orb.fill({ color, alpha: 0.15 });
        // Middle glow
        orb.circle(0, 0, baseRadius * 1.5);
        orb.fill({ color, alpha: 0.3 });
        // Inner glow
        orb.circle(0, 0, baseRadius);
        orb.fill({ color, alpha: 0.6 });
        // Core
        orb.circle(0, 0, baseRadius * 0.5);
        orb.fill({ color: 0xffffff, alpha: 0.95 });
    }

    private spawnTrail(x: number, y: number) {
        const trail = new Graphics();
        const radius = this.magicIsCritical ? 4 : 3;
        const color = this.magicIsCritical ? 0xffdd44 : 0x44aaff;
        trail.circle(0, 0, radius);
        trail.fill({ color, alpha: 0.5 });
        trail.x = this.x + x;
        trail.y = this.y + y;
        trail.zIndex = 1000;
        this.parent!.addChild(trail);
        this.magicTrails.push({ graphic: trail, life: 0.3 });
    }

    override update(time: number, isSine: boolean) {
        super.update(time, isSine);

        const hasWork = this.isCastingMagic || this.isBursting || this.isAreaCasting || this.magicTrails.length > 0 || this.isLevelingUp || this.levelUpParticles.length > 0;
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
            const orbY = startY + (endY - startY) * eased - Math.sin(t * Math.PI) * 50;

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
                burst.fill({ color, alpha: 0.6 });
                burst.x = burstX;
                burst.y = burstY;
                this.magicBurst = burst;
                burst.zIndex = 1000;
                this.parent!.addChild(burst);
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
                const py = (this.y - 80) + Math.sin(angle) * actualRadius;
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
                this.spawnLevelUpParticle(centerX, centerY, 'rise');
            }

            // Phase 2: Flash and texture swap (0.4 - 0.55)
            if (this.levelUpFlash) {
                if (t >= 0.4 && t < 0.55) {
                    const flashT = (t - 0.4) / 0.15;
                    // Flash peaks at 0.475 then fades
                    const flashAlpha = flashT < 0.5
                        ? flashT * 2 * 0.7
                        : (1 - (flashT - 0.5) * 2) * 0.7;
                    this.levelUpFlash.alpha = Math.max(0, flashAlpha);
                } else {
                    this.levelUpFlash.alpha = 0;
                }
            }

            // Swap texture at peak flash
            if (!this.levelUpTextureSwapped && t >= 0.475 && this.levelUpNewTexture) {
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
                this.spawnLevelUpParticle(centerX, centerY, 'burst');
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
    return xp === 0 ? 1 : Math.ceil(xp / 100);
}
