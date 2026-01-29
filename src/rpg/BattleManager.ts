import { Container } from 'pixi.js';
import { Actor } from './Actor.js';
import { initRat, Rat } from './enemies/Rat.js';
import { initWizard, Wizard } from './Wizard.js';

export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];
    turns: { actor: Actor, isHero: boolean, timeTillTurn: number }[] = [];

    stage: Container;

    constructor(stage: Container) {
        this.stage = stage;
    }

    async init() {
        await initWizard();

        this.heroParty = [new Wizard(150, 550)];

        for (const actor of this.heroParty) {
            this.stage.addChild(actor);
        }

        await this.initEnemy();
        this.initTurns();
    }

    async initEnemy() {
        await initRat();
        this.enemyParty = [new Rat(600, 550)];

        if (Math.random() < 0.5) {
            this.enemyParty.push(new Rat(500, 450));
        }

        this.stage.addChild(this.enemyParty[0]!);
        for (const actor of this.enemyParty) {
            this.stage.addChild(actor);
        }
    }

    initTurns() {
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
                this.initEnemy();
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
            this.init();
        }
    }

    async incorrectAnswer() {
        await this.enemyAttack(this.enemyParty[0]!);
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
