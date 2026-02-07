import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import { standardHeight, standardWidth } from './constants.ts';
import { BattleManager } from './BattleManager.ts';
import { getProblem } from '../app.ts';
import { Category } from '../common.ts';
import { ProblemUI } from './ProblemUI.ts';

declare function gtag(...args: any[]): void;

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

    // Create a container for masked content (background + actors)
    const world = new Container();
    gameStage.addChild(world);

    // Create a mask for the world
    const mask = new Graphics()
        .rect(0, 0, standardWidth, standardHeight)
        .fill(0xffffff);
    world.mask = mask;
    world.addChild(mask);

    // Load assets
    const dungeonTexture = await Assets.load('assets/dungeon.png');

    // Create Background
    const background = new Sprite(dungeonTexture);
    background.width = standardWidth;
    background.height = standardHeight;
    world.addChild(background);

    const urlParams = new URLSearchParams(window.location.search);
    const categoriesParam = urlParams.get('categories');
    let selectedCategories: Category[];
    if (categoriesParam) {
        selectedCategories = categoriesParam.split(';').map(decodeURIComponent) as Category[];
    } else {
        selectedCategories = [Category.Addition_Ten];
    }
    let currentProblem = getProblem(selectedCategories);

    const startXp = parseInt(localStorage.getItem('xp') || '0');
    const battleManager = new BattleManager(world, startXp);
    await battleManager.init();

    // Create Math UI
    const mathUI = new ProblemUI(gameStage);
    mathUI.setProblem(currentProblem.problem.text);

    function nextProblem() {
        currentProblem = getProblem(selectedCategories);
        mathUI.setProblem(currentProblem.problem.text);
    }

    // Basic animation runner
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

    // Queue for storing answers to prevent race conditions with doTurns
    const answerQueue: boolean[] = [];
    let isProcessingTurns = false;

    async function processQueue() {
        if (isProcessingTurns) return;
        isProcessingTurns = true;

        while (answerQueue.length > 0) {
            const isCorrect = answerQueue.shift()!;
            if (isCorrect) {
                await battleManager.correctAnswer();
            } else {
                await battleManager.incorrectAnswer();
            }

            if (await battleManager.doTurns()) {
                await battleManager.init();
            }
        }

        isProcessingTurns = false;
    }

    // Listen for entry to "submit"
    window.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const solution = mathUI.getSolution();
            if (solution === '') return;
            const isCorrect = solution.trim() === currentProblem.problem.answer.toString();

            gtag("event", "problem_answer", {
                category: currentProblem.category,
                correct: isCorrect,
            });

            if (isCorrect) {
                localStorage.setItem('xp', battleManager.xp.toString());
                await mathUI.showSuccess();
                nextProblem();
            } else {
                await mathUI.showError();
            }

            mathUI.clearInput();
            answerQueue.push(isCorrect);
            processQueue();
        }
    });

    await battleManager.doTurns();
}

init();

