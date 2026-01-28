import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js';
import { initWizard, Wizard } from './Wizard.js';
import { initRat, Rat } from './Rat.js';
import { standardHeight, standardWidth } from './constants.js';

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

function desiredSize() {
    const desiredRatio = standardWidth / standardHeight;
    const windowRatio = window.innerWidth / window.innerHeight;

    if (windowRatio < desiredRatio) {
        return {
            width: window.innerWidth,
            height: window.innerWidth / desiredRatio,
            ratio: window.innerWidth / standardWidth
        }
    } else {
        return {
            width: window.innerHeight * desiredRatio,
            height: window.innerHeight,
            ratio: window.innerHeight / standardHeight
        }
    }
}

async function init() {
    const app = new Application();


    const targetSize = desiredSize();
    await app.init({
        width: targetSize.width,
        height: targetSize.height,
        backgroundColor: 0xFF0000,
        antialias: true
    });
    document.body.appendChild(app.canvas);

    // Load assets
    const dungeonTexture = await Assets.load('assets/dungeon.png');

    // Create Background
    const background = new Sprite(dungeonTexture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.x = 0;
    background.y = 0;

    app.stage.addChild(background);

    // Create Actors
    await initWizard();
    const wizard = new Wizard(app, 150, 550);
    app.stage.addChild(wizard);

    await initRat();
    const rat = new Rat(app, 600, 550);
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
    battleText.scale.set(targetSize.ratio);
    app.stage.addChild(battleText);

    // Basic animation
    app.ticker.add((time) => {
        wizard.update(time.lastTime, true);
        rat.update(time.lastTime, false);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const targetSize = desiredSize();
        app.renderer.resize(targetSize.width, targetSize.height);

        console.log(targetSize.ratio);
        background.width = app.screen.width;
        background.height = app.screen.height;


        console.log('background scale', background.scale.x);
        wizard.onResize(app);
        rat.onResize(app);

        battleText.scale.set(targetSize.ratio);
        battleText.x = app.screen.width / 2;
        battleText.y = app.screen.height * 0.1;
        mathUI.resize();
    });

    // Listen for entry to "submit"
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const solution = mathUI.getSolution();
            if (solution === '3') {
                console.log('Correct!');
                mathUI.clearInput();

                if (rat.damage(20)) {
                    console.log('Rat defeated!');
                }
                // We could add attack animation here later
            } else {
                if (wizard.damage(10)) {
                    console.log('Wizard defeated!');
                }
            }
        }
    });
}

init();
