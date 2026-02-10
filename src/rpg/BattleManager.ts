import { Container, Graphics } from 'pixi.js';
import { Actor } from './Actor.ts';
import { makeEnemies, EnemyType } from './enemies/enemyMaker.ts';
import { makeWizard } from './enemies/wizardMaker.ts';
import { makeBackground, BackgroundType } from './backgroundMaker.ts';
import { standardWidth, standardHeight } from './constants.ts';
import { areas } from './areas.ts';


export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];
    turns: { actor: Actor, isHero: boolean, timeTillTurn: number }[] = [];

    wave: number = 0;
    area: number = 0;
    turnCounter: number = 0;

    stage: Container;
    background!: Container;

    xp: number = 0;

    private fadeOverlay: Graphics;
    private isFading: boolean = false;
    private fadeProgress: number = 0;
    private fadeDuration: number = 0.5;
    private fadeDirection: 1 | -1 = 1; // 1 = fade out (to black), -1 = fade in (from black)
    private resolveFade: (() => void) | null = null;
    private lastFadeTime: number = 0;

    //for simulator
    _makeEnemies = makeEnemies;
    _makeWizard = makeWizard;
    _makeBackground = makeBackground;

    constructor(stage: Container, xp: number) {
        this.stage = stage;
        this.xp = xp;

        this.fadeOverlay = new Graphics()
            .rect(0, 0, standardWidth, standardHeight)
            .fill(0x000000);
        this.fadeOverlay.alpha = 0;
        this.fadeOverlay.zIndex = 9999;
        this.stage.sortableChildren = true;
    }

    fadeOut(duration: number = 0.5): Promise<void> {
        this.isFading = true;
        this.fadeProgress = 0;
        this.fadeDuration = duration;
        this.fadeDirection = 1;
        this.lastFadeTime = 0;
        this.fadeOverlay.alpha = 0;
        this.stage.addChild(this.fadeOverlay);
        return new Promise((resolve) => {
            this.resolveFade = resolve;
        });
    }

    fadeIn(duration: number = 0.5): Promise<void> {
        this.isFading = true;
        this.fadeProgress = 0;
        this.fadeDuration = duration;
        this.fadeDirection = -1;
        this.lastFadeTime = 0;
        this.fadeOverlay.alpha = 1;
        this.stage.addChild(this.fadeOverlay);
        return new Promise((resolve) => {
            this.resolveFade = resolve;
        });
    }

    private updateFade(time: number) {
        if (!this.isFading) return;

        if (this.lastFadeTime === 0) {
            this.lastFadeTime = time;
        }
        const delta = (time - this.lastFadeTime) / 1000;
        this.lastFadeTime = time;

        this.fadeProgress += delta;
        const t = Math.min(this.fadeProgress / this.fadeDuration, 1);

        if (this.fadeDirection === 1) {
            this.fadeOverlay.alpha = t;
        } else {
            this.fadeOverlay.alpha = 1 - t;
        }

        if (t >= 1) {
            this.isFading = false;
            if (this.fadeDirection === -1) {
                this.stage.removeChild(this.fadeOverlay);
            }
            if (this.resolveFade) {
                this.resolveFade();
                this.resolveFade = null;
            }
        }
    }

    async init() {
        this.wave = 0;
        this.turnCounter = 0;
        const area = areas[this.area]!;

        if (this.background) {
            this.stage.removeChild(this.background);
        }

        const background = await this._makeBackground(area.background);
        this.background = background;
        this.stage.addChild(background);

        const wiz = await this._makeWizard(this.xp);
        wiz.x = 150;
        wiz.y = 550;
        this.heroParty = [wiz];


        for (const actor of this.heroParty) {
            this.stage.addChild(actor);
        }

        await this.initEnemy();
        this.initTurns();
    }

    private async initEnemy() {
        this.enemyParty = [];

        const area = areas[this.area]!;
        this.enemyParty.push(...await this._makeEnemies(area.waves[this.wave]!));

        const count = this.enemyParty.length;
        const minX = 450;
        const maxX = 750;
        const minY = 480;
        const maxY = 570;

        const enterPromises: Promise<void>[] = [];
        const enterFromX = standardWidth + 100;

        for (let i = 0; i < count; i++) {
            const actor = this.enemyParty[i]!;

            if (count === 1) {
                actor.x = (minX + maxX) / 2;
                actor.y = (minY + maxY) / 2;
            } else {
                actor.x = minX + (i / (count - 1)) * (maxX - minX);
                actor.y = minY + (i % 2) * (maxY - minY);
            }

            this.stage.addChild(actor);
            enterPromises.push(actor.enter(enterFromX, 0.6, i * 0.15));
        }

        // TODO this gets the game stuck
        // await Promise.all(enterPromises);
    }

    private initTurns() {
        this.turns = [];
        for (const actor of this.heroParty) {
            this.turns.push({ actor, isHero: true, timeTillTurn: 1 / actor.speed });
        }
        for (const actor of this.enemyParty) {
            this.turns.push({ actor, isHero: false, timeTillTurn: 1 / actor.speed });
        }
        this.sortTurns();
    }

    sortTurns() {
        this.turns.sort((a, b) => {
            if (a.timeTillTurn === b.timeTillTurn) {
                return (a.isHero ? 0 : 1) - (b.isHero ? 0 : 1);
            }
            return a.timeTillTurn - b.timeTillTurn;
        });
    }

    //return true if hero is defeated
    async doTurns(): Promise<boolean> {
        while (!this.turns[0]?.isHero) {
            const turn = this.turns[0]!;
            this.turnCounter++;
            if (await this.enemyAttack(turn.actor)) {
                await turn.actor.runLeft();
                return true;
            }
            this.shiftTurns();
        }
        return false;
    }

    private shiftTurns() {
        const turn = this.turns.shift()!;
        const timePassed = turn.timeTillTurn;
        for (const otherTurn of this.turns) {
            otherTurn.timeTillTurn -= timePassed;
        }
        turn.timeTillTurn = 1 / turn.actor.speed;
        this.turns.push(turn);
        this.sortTurns();
    }

    async correctAnswer() {
        this.turnCounter++;

        this.xp++;

        const attacker = this.heroParty[0]!;
        const defender = this.enemyParty[0]!;
        if (await defender.takeDamage(await attacker.attack())) {
            await defender.die();
            //remove defender
            this.stage.removeChild(defender);
            this.enemyParty.shift();
            this.turns = this.turns.filter(turn => turn.actor !== defender);

            if (this.enemyParty.length === 0) {
                //reset
                this.wave++;
                const area = areas[this.area]!;
                if (this.wave >= area.waves.length) {
                    this.area++;
                    await this.fadeOut();
                    //TODO heal heros
                    await this.init();
                    await this.fadeIn();
                } else {
                    await this.initEnemy();
                    this.initTurns();
                }
            }
        } else {
            this.shiftTurns();
        }
    }

    //return true if hero is defeated
    private async enemyAttack(attacker: Actor): Promise<boolean> {
        const defender = this.heroParty[0]!;
        if (await defender.takeDamage(await attacker.attack())) {
            await defender.runLeft();

            //remove all
            for (const actor of this.heroParty) {
                this.stage.removeChild(actor);
            }
            for (const actor of this.enemyParty) {
                this.stage.removeChild(actor);
            }

            return true
        }
        return false
    }

    async incorrectAnswer() {
        this.turnCounter++;
        this.shiftTurns();
    }

    update(lastTime: number) {
        this.updateFade(lastTime);
        for (const actor of this.heroParty) {
            actor.update(lastTime, true);
        }
        for (const actor of this.enemyParty) {
            actor.update(lastTime, false);
        }
    }
}
