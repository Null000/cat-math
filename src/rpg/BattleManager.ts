import { Container, Sprite } from 'pixi.js';
import { Actor } from './Actor.ts';
import { makeEnemies, EnemyType } from './enemies/enemyMaker.ts';
import { makeWizard } from './enemies/wizardMaker.ts';
import { makeBackground } from './backgroundMaker.ts';
import { areas, Area } from './areas.ts';

export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];
    turns: { actor: Actor, isHero: boolean, timeTillTurn: number }[] = [];

    areaIndex: number = 0;
    wave: number = 0;
    turnCounter: number = 0;

    stage: Container;
    background: Sprite | null = null;

    xp: number = 0;

    //for simulator
    _makeEnemies = makeEnemies;
    _makeWizard = makeWizard;
    _areas: Area[] = areas;

    constructor(stage: Container, xp: number) {
        this.stage = stage;
        this.xp = xp;
    }

    private get currentArea(): Area {
        return this._areas[this.areaIndex] ?? this._areas[this._areas.length - 1]!;
    }

    private getWavePlan(): EnemyType[] {
        const area = this.currentArea;
        return area.waves[this.wave] ?? area.waves[area.waves.length - 1]!;
    }

    async init() {
        this.areaIndex = 0;
        this.wave = 0;
        this.turnCounter = 0;

        await this.setBackground();

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

    private async setBackground() {
        if (this.background) {
            this.stage.removeChild(this.background);
        }
        this.background = await makeBackground(this.currentArea.background);
        this.stage.addChildAt(this.background, 0);
    }

    private async initEnemy() {
        this.enemyParty = [];

        this.enemyParty.push(...await this._makeEnemies(this.getWavePlan()));

        const count = this.enemyParty.length;
        const minX = 450;
        const maxX = 750;
        const minY = 480;
        const maxY = 570;

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
        }
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
                this.wave++;
                if (this.wave >= this.currentArea.waves.length) {
                    // advance to next area
                    this.areaIndex++;
                    this.wave = 0;
                    await this.setBackground();
                }
                await this.initEnemy();
                this.initTurns();
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
        for (const actor of this.heroParty) {
            actor.update(lastTime, true);
        }
        for (const actor of this.enemyParty) {
            actor.update(lastTime, false);
        }
    }
}
