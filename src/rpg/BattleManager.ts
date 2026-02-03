import { Container } from 'pixi.js';
import { Actor } from './Actor.ts';
import { makeEnemy, EnemyType } from './enemies/enemyMaker.ts';
import { makeWizard } from './enemies/wizardMaker.ts';

export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];
    turns: { actor: Actor, isHero: boolean, timeTillTurn: number }[] = [];

    wave: number = 1;
    turnCounter: number = 0;

    stage: Container;

    //for simulator
    _makeEnemy = makeEnemy;
    _makeWizard = makeWizard;

    constructor(stage: Container) {
        this.stage = stage;
    }

    async init() {
        this.wave = 1;
        this.turnCounter = 0;

        const wiz = await this._makeWizard();
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

        for (let i = 0; i < this.wave; i++) {
            this.enemyParty.push(await this._makeEnemy(EnemyType.Rat));
        }

        for (let i = 0; i < this.enemyParty.length; i++) {
            const actor = this.enemyParty[i]!;
            actor.x = 600 + i * 100;
            actor.y = 550;

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
        const attacker = this.heroParty[0]!;
        const defender = this.enemyParty[0]!;
        if (await defender.takeDamage(attacker.attack())) {
            await defender.die();

            //remove defender
            this.stage.removeChild(defender);
            this.enemyParty.shift();
            this.turns = this.turns.filter(turn => turn.actor !== defender);

            if (this.enemyParty.length === 0) {
                //reset
                this.wave++;
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
        if (await defender.takeDamage(attacker.attack())) {
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
