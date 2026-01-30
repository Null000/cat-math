import { Container } from 'pixi.js';
import { Actor } from './Actor.js';
import { initRat, Rat } from './enemies/Rat.js';
import { initWizard, Wizard } from './Wizard.js';
import { makeEnemy, EnemyType } from './enemies/enemyMaker.js';

export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];
    turns: { actor: Actor, isHero: boolean, timeTillTurn: number }[] = [];

    wave: number = 1;

    stage: Container;

    constructor(stage: Container) {
        this.stage = stage;
    }

    async init() {
        await initWizard();

        this.heroParty = [new Wizard()];
        this.heroParty[0]!.x = 150;
        this.heroParty[0]!.y = 550;

        for (const actor of this.heroParty) {
            this.stage.addChild(actor);
        }

        await this.initEnemy();
        this.initTurns();
    }

    async initEnemy() {
        console.log('initEnemy');
        this.enemyParty = [];

        for (let i = 0; i < this.wave; i++) {
            this.enemyParty.push(await makeEnemy(EnemyType.Rat));
        }

        for (let i = 0; i < this.enemyParty.length; i++) {
            const actor = this.enemyParty[i]!;
            actor.x = 600 + i * 100;
            actor.y = 550;

            this.stage.addChild(actor);
        }
    }

    initTurns() {
        console.log('initTurns');
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
        console.log('Turns sorted! ' + this.turns.map(t => t.actor.constructor.name).join(', '));
    }

    async doTurns() {
        while (!this.turns[0]?.isHero) {
            const turn = this.turns[0]!;

            await this.enemyAttack(turn.actor);
            this.shiftTurns();
        }
    }

    shiftTurns() {
        const turn = this.turns.shift()!;
        const timePassed = turn.timeTillTurn;
        for (const otherTurn of this.turns) {
            otherTurn.timeTillTurn -= timePassed;
        }
        turn.timeTillTurn = 1 / turn.actor.speed;
        this.turns.push(turn);
        this.sortTurns();

        console.log('Turn shifted! ' + this.turns.map(t => t.actor.constructor.name).join(', '));
    }

    async correctAnswer() {
        const attacker = this.heroParty[0]!;
        const defender = this.enemyParty[0]!;
        if (await defender.takeDamage(attacker.attack())) {
            console.log('Enemy defeated!');

            await defender.die();

            //remove defender
            this.stage.removeChild(defender);
            this.enemyParty.shift();
            this.turns = this.turns.filter(turn => turn.actor !== defender);

            if (this.enemyParty.length === 0) {
                console.log('Hero wins!');
                //reset
                this.wave++;
                await this.initEnemy();
                this.initTurns();
            }
        } else {
            this.shiftTurns();
        }
    }

    async enemyAttack(attacker: Actor) {
        console.log('Enemy attack!' + attacker.constructor.name);
        const defender = this.heroParty[0]!;
        if (await defender.takeDamage(attacker.attack())) {
            console.log('Hero defeated!');

            await defender.die();

            //remove all
            for (const actor of this.heroParty) {
                this.stage.removeChild(actor);
            }
            for (const actor of this.enemyParty) {
                this.stage.removeChild(actor);
            }

            //reset
            this.wave = 0;
            this.init();
        }
    }

    async incorrectAnswer() {
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
