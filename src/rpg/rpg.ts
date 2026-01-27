import { Application, Assets, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Actor } from './Actor.js';

class Wizard extends Actor {
    constructor(texture: Texture) {
        super(texture, 120, 12, 120);
    }
}

class Rat extends Actor {
    constructor(texture: Texture) {
        super(texture, 100, 10, 80);
    }
}

class ProblemUI {
    private app: Application;
    private problemText: Text;
    private container: HTMLDivElement;
    private input: HTMLInputElement;

    constructor(app: Application) {
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
        this.problemText.x = app.screen.width / 2;
        this.problemText.y = app.screen.height * 0.4;
        app.stage.addChild(this.problemText);

        // Create HTML Overlay for Input
        this.container = document.createElement('div');
        this.container.id = 'solution-container';
        this.container.style.top = '50%';

        this.input = document.createElement('input');
        this.input.id = 'solution-input';
        this.input.type = 'text';
        this.input.placeholder = '?';
        this.input.autocomplete = 'off';

        this.container.appendChild(this.input);
        document.body.appendChild(this.container);

        this.input.focus();
    }

    resize() {
        this.problemText.x = this.app.screen.width / 2;
        this.problemText.y = this.app.screen.height * 0.4;
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

async function init() {
    const app = new Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1a1a2e,
        antialias: true
    });
    document.body.appendChild(app.canvas);

    // Load assets
    const dungeonTexture = await Assets.load('assets/dungeon.png');
    const wizardTexture = await Assets.load('assets/wizard.png');
    const ratTexture = await Assets.load('assets/rat.png');

    // Create Background
    const background = new Sprite(dungeonTexture);
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    app.stage.addChild(background);

    // Create Actors
    const wizard = new Wizard(wizardTexture);
    wizard.x = app.screen.width * 0.25;
    wizard.y = app.screen.height * 0.6;
    app.stage.addChild(wizard);

    const rat = new Rat(ratTexture);
    rat.x = app.screen.width * 0.75;
    rat.y = app.screen.height * 0.6;
    app.stage.addChild(rat);

    // Create Math UI
    const mathUI = new ProblemUI(app);

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
    battleText.x = app.screen.width / 2;
    battleText.y = 60;
    app.stage.addChild(battleText);

    // Basic animation
    app.ticker.add((time) => {
        wizard.update(time.lastTime, true);
        rat.update(time.lastTime, false);

        // Visual test: health oscillates
        // wizard.setHealth(0.5 + Math.sin(time.lastTime / 1000) * 0.5);
        // rat.setHealth(0.5 + Math.cos(time.lastTime / 1000) * 0.5);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        background.width = app.screen.width;
        background.height = app.screen.height;
        wizard.x = app.screen.width * 0.25;
        wizard.y = app.screen.height * 0.6;
        rat.x = app.screen.width * 0.75;
        rat.y = app.screen.height * 0.6;

        battleText.x = app.screen.width / 2;
        mathUI.resize();
    });

    // Listen for entry to "submit"
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const solution = mathUI.getSolution();
            if (solution === '3') {
                console.log('Correct!');
                mathUI.clearInput();

                rat.setHealth(rat.health - 10);
                // We could add attack animation here later
            } else {
                wizard.setHealth(wizard.health - 10);
                console.log('Wrong!');
            }
        }
    });
}

init();
