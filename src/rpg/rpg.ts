import { Application, Assets, Container, Sprite, Text, TextStyle } from 'pixi.js';
import { initWizard, Wizard } from './Wizard.js';
import { initRat, Rat } from './Rat.js';
import { standardHeight, standardWidth } from './constants.js';
import { Actor } from './Actor.js';

class ProblemUI {
    private app: Application;
    private problemText: Text;
    private container: HTMLDivElement;
    private input: HTMLInputElement;

    constructor(app: Application, parentContainer: Container) {
        this.app = app;

        // Create Pixi Text for the problem
        const style = new TextStyle({
            fontFamily: 'Inter, Arial',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#ffffff',
            dropShadow: {
                alpha: 0.8,
                angle: Math.PI / 6,
                blur: 4,
                color: '#000000',
                distance: 6,
            },
        });

        this.problemText = new Text({ text: '1 + 2 = ?', style });
        this.problemText.anchor.set(0.5);
        this.problemText.x = standardWidth / 2;
        this.problemText.y = standardHeight * 0.4;
        parentContainer.addChild(this.problemText);

        // Create HTML Overlay for Input
        this.container = document.createElement('div');
        this.container.id = 'solution-container';
        this.container.style.position = 'absolute';

        this.input = document.createElement('input');
        this.input.id = 'solution-input';
        this.input.type = 'text';
        this.input.placeholder = '?';
        this.input.autocomplete = 'off';

        this.container.appendChild(this.input);
        document.body.appendChild(this.container);

        this.input.focus();
    }

    updateTransform(scale: number, offsetX: number, offsetY: number) {
        // Position the container relative to the game stage
        // The problemText is at (standardWidth / 2, standardHeight * 0.4)
        // We want the input slightly below it.

        const gameX = standardWidth / 2;
        const gameY = standardHeight * 0.5; // Slightly below text

        const screenX = gameX * scale + offsetX;
        const screenY = gameY * scale + offsetY;

        this.container.style.left = `${screenX}px`;
        this.container.style.top = `${screenY}px`;
        this.container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    setProblem(text: string) {
        this.problemText.text = text;
    }

    getSolution(): string {
        return this.input.value;
    }

    clearInput() {
        this.input.value = '';
    }
}

class BattleManager {
    heroParty: Actor[] = [];
    enemyParty: Actor[] = [];

    app: Application;
    stage: Container;

    constructor(app: Application, stage: Container) {
        this.app = app;
        this.stage = stage;
    }

    async init() {
        await initWizard();
        await initRat();

        this.heroParty = [new Wizard(this.app, 150, 550)];
        this.enemyParty = [new Rat(this.app, 600, 550)];

        for (const actor of this.heroParty) {
            this.stage.addChild(actor);
        }
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
                this.init();
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

async function init() {
    const app = new Application();

    await app.init({
        resizeTo: window,
        backgroundColor: 0x000000,
        antialias: true
    });
    document.body.appendChild(app.canvas);

    // Create a container for the game world
    const gameStage = new Container();
    app.stage.addChild(gameStage);

    // Load assets
    const dungeonTexture = await Assets.load('assets/dungeon.png');

    // Create Background
    const background = new Sprite(dungeonTexture);
    background.width = standardWidth;
    background.height = standardHeight;
    gameStage.addChild(background);

    const battleManager = new BattleManager(app, gameStage);
    await battleManager.init();

    // Create Math UI
    const mathUI = new ProblemUI(app, gameStage);

    // Add Battle Text
    const style = new TextStyle({
        fontFamily: 'Inter, Arial',
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#ffffff',
    });

    const battleText = new Text({ text: 'WIZARD vs RAT', style });
    battleText.alpha = 0.6;
    battleText.anchor.set(0.5);
    battleText.x = standardWidth / 2;
    battleText.y = 60;
    gameStage.addChild(battleText);

    // Basic animation
    app.ticker.add((time) => {
        battleManager.update(time.lastTime);
    });

    // Handle resize
    function resize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const scaleX = screenWidth / standardWidth;
        const scaleY = screenHeight / standardHeight;
        const scale = Math.min(scaleX, scaleY);

        const newWidth = Math.ceil(standardWidth * scale);
        const newHeight = Math.ceil(standardHeight * scale);

        const x = (screenWidth - newWidth) / 2;
        const y = (screenHeight - newHeight) / 2;

        gameStage.position.set(x, y);
        gameStage.scale.set(scale);

        mathUI.updateTransform(scale, x, y);
    }

    window.addEventListener('resize', resize);
    resize(); // Initial resize

    // Listen for entry to "submit"
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const solution = mathUI.getSolution();
            if (solution === '3') {
                console.log('Correct!');
                mathUI.clearInput();

                battleManager.correctAnswer();
            } else {
                battleManager.incorrectAnswer();
            }
        }
    });
}

init();

