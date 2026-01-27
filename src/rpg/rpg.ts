import { Application, Sprite, Assets, Text, TextStyle } from 'pixi.js';

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
    // Flip rat to face wizard
    rat.scale.x *= -1;
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
        wizard.y = (app.screen.height * 0.6) + Math.sin(time.lastTime / 500) * 10;
        rat.y = (app.screen.height * 0.6) + Math.cos(time.lastTime / 500) * 10;
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
