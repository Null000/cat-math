import {Application, Container, Graphics} from "pixi.js";
import {standardHeight, standardWidth} from "./constants.ts";
import {Actor} from "./Actor.ts";
import {getWizardLevel, initWizard, Wizard} from "./Wizard.ts";
import {EnemyType, makeEnemies} from "./enemies/enemyMaker.ts";
import {BackgroundType, makeBackground} from "./backgroundMaker.ts";

const ACTOR_X = 400;
const ACTOR_Y = 500;
const DUMMY_X = 650;
const DUMMY_Y = 500;

let app: Application;
let world: Container;
let currentActor: Actor | null = null;
let dummyTarget: Actor | null = null;
let wizardXp: number = 0;

function $(id: string) {
	return document.getElementById(id)!;
}

function log(msg: string) {
	const el = $("log");
	const line = document.createElement("div");
	line.textContent = `> ${msg}`;
	el.prepend(line);
	while (el.children.length > 20) el.removeChild(el.lastChild!);
}

function updateStats(actor: Actor | null) {
	if (!actor) {
		$("stat-name").textContent = "-";
		$("stat-hp").textContent = "-";
		$("stat-atk").textContent = "-";
		$("stat-def").textContent = "-";
		$("stat-spd").textContent = "-";
		$("stat-xp").textContent = "-";
		return;
	}
	$("stat-name").textContent = actor.constructor.name;
	$("stat-hp").textContent = `${actor.health}/${actor.maxHealth}`;
	$("stat-atk").textContent = String(actor.attackPower);
	$("stat-def").textContent = String(actor.defensePower);
	$("stat-spd").textContent = String(actor.speed);
	$("stat-xp").textContent = String(actor.xpDrop);
}

function setButtons(enabled: boolean) {
	const ids = [
		"btn-enter",
		"btn-shake",
		"btn-twitch",
		"btn-attack",
		"btn-take-damage",
		"btn-die",
		"btn-run-left",
		"btn-cast-magic",
		"btn-area-attack",
		"btn-magic-missile",
		"btn-lightning-bolt",
		"btn-fire-bolt",
		"btn-frost-shard",
		"btn-arcane-beam",
		"btn-meteor-strike",
		"btn-level-up",
		"btn-heal",
		"btn-reset",
		"btn-show-bubble",
		"btn-show-bubble-forever",
		"btn-hide-bubble",
	];
	for (const id of ids) {
		($(id) as HTMLButtonElement).disabled = !enabled;
	}
	// Cast magic and level up only for wizard
	const isWizard = enabled && currentActor instanceof Wizard;
	($("btn-cast-magic") as HTMLButtonElement).disabled = !isWizard;
	($("btn-area-attack") as HTMLButtonElement).disabled = !isWizard;
	($("btn-magic-missile") as HTMLButtonElement).disabled = !isWizard;
	($("btn-lightning-bolt") as HTMLButtonElement).disabled = !isWizard;
	($("btn-fire-bolt") as HTMLButtonElement).disabled = !isWizard;
	($("btn-frost-shard") as HTMLButtonElement).disabled = !isWizard;
	($("btn-arcane-beam") as HTMLButtonElement).disabled = !isWizard;
	($("btn-meteor-strike") as HTMLButtonElement).disabled = !isWizard;
	($("btn-level-up") as HTMLButtonElement).disabled = !isWizard;
}

async function ensureDummyTarget(): Promise<Actor> {
	if (dummyTarget && dummyTarget.parent) return dummyTarget;
	const enemies = await makeEnemies([EnemyType.Dummy]);
	dummyTarget = enemies[0]!;
	dummyTarget.position.set(DUMMY_X, DUMMY_Y);
	world.addChild(dummyTarget);
	return dummyTarget;
}

function removeDummyTarget() {
	if (dummyTarget && dummyTarget.parent) {
		world.removeChild(dummyTarget);
	}
	dummyTarget = null;
}

function removeCurrentActor() {
	if (currentActor && currentActor.parent) {
		world.removeChild(currentActor);
	}
	currentActor = null;
	updateStats(null);
	setButtons(false);
}

async function createActor(type: string, xp: number) {
	removeCurrentActor();
	removeDummyTarget();

	let actor: Actor;

	if (type === "wizard") {
		await initWizard(xp);
		actor = new Wizard(xp);
		wizardXp = xp;
	} else {
		const enemies = await makeEnemies([type as EnemyType]);
		actor = enemies[0]!;
	}

	actor.position.set(ACTOR_X, ACTOR_Y);
	world.addChild(actor);
	currentActor = actor;
	updateStats(actor);
	setButtons(true);
	log(`Created ${actor.constructor.name}`);
}

async function init() {
	app = new Application();
	await app.init({
		width: standardWidth,
		height: standardHeight,
		backgroundColor: 0x000000,
		antialias: true,
	});

	$("canvas-wrapper").appendChild(app.canvas);

	world = new Container();
	app.stage.addChild(world);

	const mask = new Graphics()
		.rect(0, 0, standardWidth, standardHeight)
		.fill(0xffffff);
	world.mask = mask;
	world.addChild(mask);

	// Default background
	const bg = await makeBackground(BackgroundType.Village);
	world.addChild(bg);

	// Animation loop
	let sineToggle = true;
	app.ticker.add((time) => {
		if (currentActor) currentActor.update(time, sineToggle);
		if (dummyTarget) dummyTarget.update(time, !sineToggle);
	});

	// Wire up create button
	$("btn-create").addEventListener("click", () => {
		const type = ($("actor-type") as HTMLSelectElement).value;
		const xp = parseInt(($("wizard-xp") as HTMLInputElement).value) || 0;
		createActor(type, xp);
	});

	// XP field only relevant for wizard
	($("actor-type") as HTMLSelectElement).addEventListener("change", (e) => {
		const isWizard = (e.target as HTMLSelectElement).value === "wizard";
		const label = ($("wizard-xp") as HTMLInputElement)
			.parentElement as HTMLLabelElement;
		label.style.visibility = isWizard ? "visible" : "hidden";
	});

	// Clear all
	$("btn-clear").addEventListener("click", () => {
		removeCurrentActor();
		removeDummyTarget();
		log("Cleared all actors");
	});

	// --- Animation buttons ---

	$("btn-enter").addEventListener("click", async () => {
		if (!currentActor) return;
		currentActor.alpha = 0;
		log("Enter animation");
		await currentActor.enter(900, 0.8);
		log("Enter complete");
		updateStats(currentActor);
	});

	$("btn-shake").addEventListener("click", async () => {
		if (!currentActor) return;
		log("Shake animation");
		await currentActor.shake(2000, 10);
		log("Shake complete");
	});

	$("btn-twitch").addEventListener("click", async () => {
		if (!currentActor) return;
		log("Twitch animation");
		await currentActor.twitch();
		log("Twitch complete");
	});

	$("btn-attack").addEventListener("click", async () => {
		if (!currentActor) return;
		const target = await ensureDummyTarget();
		log("Attack animation");
		const attackResult = await currentActor.attack([target]);
		await target.takeDamage(attackResult[0]!.damage);
		log(`Attack dealt ${attackResult[0]!.damage} damage to Dummy`);
		updateStats(currentActor);
	});

	$("btn-take-damage").addEventListener("click", async () => {
		if (!currentActor) return;
		const dmg = Math.ceil(currentActor.maxHealth * 0.2);
		log(`Taking ${dmg} raw damage`);
		const died = await currentActor.takeDamage(dmg);
		if (died) log("Actor has died from damage!");
		updateStats(currentActor);
	});

	$("btn-die").addEventListener("click", async () => {
		if (!currentActor) return;
		log("Die animation");
		await currentActor.die();
		log("Die complete (faded out)");
	});

	$("btn-run-left").addEventListener("click", async () => {
		if (!currentActor) return;
		log("Run left animation");
		await currentActor.runLeft();
		log("Run left complete (off-screen)");
	});

	$("btn-cast-magic").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Cast magic animation");
		await currentActor.castMagic(false, target);
		log("Cast magic complete");
	});

	$("btn-area-attack").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		log("Area attack animation");
		const dmg = await currentActor.areaAttack();
		log(`Area attack complete (${dmg} damage)`);
	});

	$("btn-magic-missile").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Magic missile animation");
		const dmg = await currentActor.magicMissileAttack(target);
		log(`Magic missile complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-lightning-bolt").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Lightning bolt animation");
		const dmg = await currentActor.lightningBoltAttack(target);
		log(`Lightning bolt complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-fire-bolt").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Fire bolt animation");
		const dmg = await currentActor.fireBoltAttack(target);
		log(`Fire bolt complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-frost-shard").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Frost shard animation");
		const dmg = await currentActor.frostShardAttack(target);
		log(`Frost shard complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-arcane-beam").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Arcane beam animation");
		const dmg = await currentActor.arcaneBeamAttack(target);
		log(`Arcane beam complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-meteor-strike").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const target = await ensureDummyTarget();
		log("Meteor strike animation");
		const dmg = await currentActor.meteorStrikeAttack(target);
		log(`Meteor strike complete (${dmg} damage)`);
		updateStats(currentActor);
	});

	$("btn-level-up").addEventListener("click", async () => {
		if (!currentActor || !(currentActor instanceof Wizard)) return;
		const currentLevel = getWizardLevel(wizardXp);
		// Jump XP past the next level boundary
		wizardXp = currentLevel * 100 + 1;
		log(`Level up! XP: ${wizardXp}, Level: ${getWizardLevel(wizardXp)}`);
		await currentActor.levelUp(wizardXp);
		log("Level up complete");
		updateStats(currentActor);
	});

	$("btn-heal").addEventListener("click", () => {
		if (!currentActor) return;
		currentActor.healMax();
		updateStats(currentActor);
		log("Healed to max HP");
	});

	$("btn-reset").addEventListener("click", () => {
		if (!currentActor) return;
		// Re-create to reset all internal state
		const type = ($("actor-type") as HTMLSelectElement).value;
		const xp = parseInt(($("wizard-xp") as HTMLInputElement).value) || 0;
		createActor(type, xp);
		log("Reset actor position & state");
	});

	$("btn-show-bubble").addEventListener("click", async () => {
		if (!currentActor) return;
		const text = ($("bubble-text") as HTMLInputElement).value || "Hello!";
		const duration =
			parseFloat(($("bubble-duration") as HTMLInputElement).value) || 2000;
		log(`Show speech bubble (${duration}s): "${text}"`);
		await currentActor.showSpeechBubble(text, duration);
		log("Speech bubble hidden");
	});

	$("btn-show-bubble-forever").addEventListener("click", async () => {
		if (!currentActor) return;
		const text = ($("bubble-text") as HTMLInputElement).value || "Hello!";
		log(`Show speech bubble (forever): "${text}"`);
		await currentActor.showSpeechBubble(text, -1);
		log("Speech bubble shown (persistent)");
	});

	$("btn-hide-bubble").addEventListener("click", () => {
		if (!currentActor) return;
		currentActor.hideSpeechBubble();
		log("Speech bubble hidden");
	});

	// Create wizard by default
	await createActor("wizard", 0);
}

init();
