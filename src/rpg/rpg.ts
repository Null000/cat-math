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
        const p = Math.max(0, Math.min(1, percent));
        this.fill.clear();
        this.fill.rect(0, 0, this.widthMax * p, this.heightBar);
        this.fill.fill(p > 0.3 ? 0x2ecc71 : 0xe74c3c);
    }
}

abstract class Actor extends Container {
    protected sprite: Sprite;
    protected healthBar: HealthBar;
    private initialY: number;

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
        wizard.update(time.lastTime, true);
        rat.update(time.lastTime, false);

        // Visual test: health oscillates
        wizard.setHealth(0.5 + Math.sin(time.lastTime / 1000) * 0.5);
        rat.setHealth(0.5 + Math.cos(time.lastTime / 1000) * 0.5);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        wizard.x = app.screen.width * 0.25;
        wizard.y = app.screen.height * 0.6;
        rat.x = app.screen.width * 0.75;
        rat.y = app.screen.height * 0.6;

        battleText.x = app.screen.width / 2;
    });
}

init();
