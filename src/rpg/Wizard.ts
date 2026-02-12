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
        orb.zIndex = 100;
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
        trail.zIndex = 100;
        this.parent!.addChild(trail);
        this.magicTrails.push({ graphic: trail, life: 0.3 });
    }

    override update(time: number, isSine: boolean) {
        super.update(time, isSine);

        const hasWork = this.isCastingMagic || this.isBursting || this.isAreaCasting || this.magicTrails.length > 0;
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
                burst.zIndex = 100;
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
