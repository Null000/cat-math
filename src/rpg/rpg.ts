import { Application, Sprite, Assets, Text, TextStyle, Graphics, Container, Texture } from 'pixi.js';

class HealthBar extends Container {
    private bg: Graphics;
    private fill: Graphics;
    private widthMax: number;
    private heightBar: number;

    constructor(width = 100, height = 10) {
        super();
        this.widthMax = width;
        this.heightBar = height;

        this.bg = new Graphics();
        this.bg.rect(0, 0, width, height);
        this.bg.fill(0x333333);
        this.addChild(this.bg);

        this.fill = new Graphics();
        this.fill.rect(0, 0, width, height);
        this.fill.fill(0x2ecc71);
        this.addChild(this.fill);
    }

    setHealth(percent: number) {
        const p = Math.max(0, Math.min(1, percent / 100));
        this.fill.clear();
        this.fill.rect(0, 0, this.widthMax * p, this.heightBar);
        this.fill.fill(p > 0.3 ? 0x2ecc71 : 0xe74c3c);
    }
}

abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;
    private initialY: number;
    health = 100;

    constructor(texture: Texture, hbWidth: number, hbHeight: number, hbYOffset: number) {
        super();
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.addChild(this.sprite);

        this.healthBar = new HealthBar(hbWidth, hbHeight);
        this.healthBar.pivot.set(hbWidth / 2, hbHeight / 2);
        this.healthBar.y = -hbYOffset;
        this.addChild(this.healthBar);

        this.initialY = 0;
    }

    setHealth(percent: number) {
        this.health = percent;
        this.healthBar.setHealth(percent);
    }

    update(time: number, isSine: boolean) {
        const offset = isSine ? Math.sin(time / 500) : Math.cos(time / 500);
        this.sprite.y = this.initialY + offset * 10;
        this.healthBar.y = - (this.sprite.height / 2 + 20) + offset * 10;
    }
}

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
    const wizardTexture = await Assets.load('assets/wizard.png');
    const ratTexture = await Assets.load('assets/rat.png');

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
                // We could add attack animation here later
            } else {
                console.log('Wrong!');
            }
        }
    });
}

init();
