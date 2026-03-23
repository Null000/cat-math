import { Application, Container, Graphics } from "pixi.js";
import { standardHeight, standardWidth } from "./constants.ts";
import { BattleManager } from "./BattleManager.ts";
import { getProblem } from "../app.ts";
import { Category } from "../common.ts";
import { ProblemUI } from "./ProblemUI.ts";

declare function gtag(...args: any[]): void;

function show67EasterEgg() {
	const container = document.createElement("div");
	container.style.cssText =
		"position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;pointer-events:none;display:flex;gap:8px;";
	const digits = ["6", "7"].map((d, i) => {
		const el = document.createElement("div");
		el.textContent = d;
		el.style.cssText = `font-size:100px;font-weight:bold;color:#667eea;animation:jump67 0.4s ease-in-out ${i * 0.2}s infinite alternate;`;
		return el;
	});
	digits.forEach((d) => container.appendChild(d));
	const style = document.createElement("style");
	style.textContent = "@keyframes jump67{0%{transform:translateY(0)}100%{transform:translateY(-40px)}}";
	container.appendChild(style);
	document.body.appendChild(container);
	setTimeout(() => {
		container.style.transition = "opacity 0.3s";
		container.style.opacity = "0";
		container.addEventListener("transitionend", () => container.remove());
	}, 1500);
}

async function init() {
	const app = new Application();

	(globalThis as any).__PIXI_APP__ = app;

	await app.init({
		resizeTo: window,
		backgroundColor: 0x000000,
		antialias: true,
	});
	document.body.appendChild(app.canvas);

	const turbo = parseFloat(localStorage.getItem("turbo") ?? "");
	if (!isNaN(turbo) && turbo > 0) {
		app.ticker.speed = turbo;
	}

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

	const urlParams = new URLSearchParams(window.location.search);
	const categoriesParam = urlParams.get("categories");
	let selectedCategories: Category[];
	if (categoriesParam) {
		selectedCategories = categoriesParam
			.split(";")
			.map(decodeURIComponent) as Category[];
	} else {
		selectedCategories = [Category.Addition_Ten];
	}
	let currentProblem = getProblem(selectedCategories);

	const startXp = parseInt(localStorage.getItem("xp") || "0");
	const startArea = parseInt(localStorage.getItem("rpg_area") || "0");
	const battleManager = new BattleManager(world, startXp, startArea);
	battleManager.onXpChange = (xp) =>
		localStorage.setItem("xp", xp.toString());
	battleManager.onAreaChange = (area) =>
		localStorage.setItem("rpg_area", area.toString());
	await battleManager.init();

	// Create Math UI
	const mathUI = new ProblemUI(gameStage, onSubmit);
	mathUI.setProblem(
		currentProblem.problem.text,
		currentProblem.problem.options,
		typeof currentProblem.problem.answer as "string" | "number"
	);

	function nextProblem() {
		currentProblem = getProblem(selectedCategories);
		mathUI.setProblem(
			currentProblem.problem.text,
			currentProblem.problem.options,
			typeof currentProblem.problem.answer as "string" | "number"
		);
	}

	// Basic animation runner
	app.ticker.add((time) => {
		battleManager.update(time);
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

	window.addEventListener("resize", resize);
	resize(); // Initial resize

	// Queue for storing answers to prevent race conditions with doTurns
	const answerQueue: boolean[] = [];
	let isProcessingTurns = false;

	let lastCorrectTimestamp = -1;
	let correctCount = 0;
	let turnTimeSum = 0;

	async function processQueue() {
		if (isProcessingTurns) return;
		isProcessingTurns = true;

		while (answerQueue.length > 0) {
			const isCorrect = answerQueue.shift()!;
			if (isCorrect) {
				const now = Date.now();

				if (lastCorrectTimestamp > 0) {
					correctCount++;
					turnTimeSum += now - lastCorrectTimestamp;
					console.log(`Correct count: ${correctCount}, Avg turn time: ${turnTimeSum / correctCount}`);
				}
				lastCorrectTimestamp = now;

				await battleManager.correctAnswer();
			} else {
				await battleManager.incorrectAnswer();
			}

			if (await battleManager.doTurns()) {
				await battleManager.fadeOut();
				await battleManager.init();
				await battleManager.fadeIn();
			}
		}

		isProcessingTurns = false;
	}

	async function onSubmit(solution: string) {
		if (solution === "") return;

		if (solution === "Makonja") {
			for (let i = 0; i < 1000; i++) {
				answerQueue.push(true);
			}
			void processQueue();
			return;
		}

		let isCorrect = false;
		if (typeof currentProblem.problem.answer === "string") {
			isCorrect = solution.trim().toLowerCase() === (currentProblem.problem.answer as string).toLowerCase();
		} else {
			isCorrect = solution.trim() === currentProblem.problem.answer.toString();
		}

		gtag("event", "problem_answer", {
			category: currentProblem.category,
			correct: isCorrect,
		});

		if (isCorrect) {
			if (currentProblem.problem.answer === 67) show67EasterEgg();
			await mathUI.showSuccess();
			nextProblem();
		} else {
			await mathUI.showError();
		}

		mathUI.clearInput();
		answerQueue.push(isCorrect);
		void processQueue();
	}

	await battleManager.doTurns();
}

init();
