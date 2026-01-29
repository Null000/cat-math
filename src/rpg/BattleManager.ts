import { Container } from 'pixi.js';
import { Actor } from './Actor.js';
import { initRat, Rat } from './enemies/Rat.js';
import { initWizard, Wizard } from './Wizard.js';

export class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];

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
    }

    async initEnemy() {
        await initRat();
        this.enemyParty = [new Rat(600, 550)];

        if (Math.random() < 0.5) {
            await initWizard();
            this.enemyParty.push(new Rat(500, 450));
        }

        this.stage.addChild(this.enemyParty[0]!);
        for (const actor of this.enemyParty) {
            this.stage.addChild(actor);
        }
    }

    correctAnswer() {
        const attacker = this.heroParty[0]!;
        const defender = this.enemyParty[0]!;
        if (defender.takeDamage(attacker.attack())) {
            console.log('Enemy defeated!');
            //remove defender
            this.stage.removeChild(defender);
            this.enemyParty.shift();

            if (this.enemyParty.length === 0) {
                console.log('Hero wins!');
                //reset
                this.initEnemy();
            }
        }
    }

    incorrectAnswer() {
        const attacker = this.enemyParty[0]!;
        const defender = this.heroParty[0]!;
        if (defender.takeDamage(attacker.attack())) {
            console.log('Hero defeated!');
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

    update(lastTime: number) {
        for (const actor of this.heroParty) {
            actor.update(lastTime, true);
        }
        for (const actor of this.enemyParty) {
            actor.update(lastTime, false);
        }
    }
}
