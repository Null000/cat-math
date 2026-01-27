import { Application, Sprite, Assets, Text, TextStyle, Graphics, Container } from 'pixi.js';

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
        const p = Math.max(0, Math.min(1, percent));
        this.fill.clear();
        this.fill.rect(0, 0, this.widthMax * p, this.heightBar);
        this.fill.fill(p > 0.3 ? 0x2ecc71 : 0xe74c3c);
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

    // Create Wizard
    const wizard = new Sprite(wizardTexture);
    wizard.anchor.set(0.5);
    wizard.x = app.screen.width * 0.25;
    wizard.y = app.screen.height * 0.6;
    wizard.scale.set(0.5);
    app.stage.addChild(wizard);

    // Create Rat
    const rat = new Sprite(ratTexture);
    rat.anchor.set(0.5);
    rat.x = app.screen.width * 0.75;
    rat.y = app.screen.height * 0.6;
    rat.scale.set(0.5);
    app.stage.addChild(rat);

    // Add Health Bars
    const wizardHB = new HealthBar(120, 12);
    wizardHB.pivot.set(60, 6);
    wizardHB.x = wizard.x;
    wizardHB.y = wizard.y - 120;
    app.stage.addChild(wizardHB);

    const ratHB = new HealthBar(100, 10);
    ratHB.pivot.set(50, 5);
    ratHB.x = rat.x;
    ratHB.y = rat.y - 80;
    app.stage.addChild(ratHB);

    // Add Battle Text
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
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

    const battleText = new Text({ text: 'WIZARD vs RAT', style });
    battleText.anchor.set(0.5);
    battleText.x = app.screen.width / 2;
    battleText.y = 100;
    app.stage.addChild(battleText);

    // Basic animation
    app.ticker.add((time) => {
        wizard.y = (app.screen.height * 0.6) + Math.sin(time.lastTime / 500) * 10;
        rat.y = (app.screen.height * 0.6) + Math.cos(time.lastTime / 500) * 10;

        wizardHB.y = wizard.y - 120;
        ratHB.y = rat.y - 80;

        // Visual test: health oscillates
        wizardHB.setHealth(0.5 + Math.sin(time.lastTime / 1000) * 0.5);
        ratHB.setHealth(0.5 + Math.cos(time.lastTime / 1000) * 0.5);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        wizard.x = app.screen.width * 0.25;
        wizard.y = app.screen.height * 0.6;
        rat.x = app.screen.width * 0.75;
        rat.y = app.screen.height * 0.6;

        wizardHB.x = wizard.x;
        ratHB.x = rat.x;

        battleText.x = app.screen.width / 2;
    });
}

init();
