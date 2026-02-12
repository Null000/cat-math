import { Application, Container, Graphics } from "pixi.js";
import { standardHeight, standardWidth } from "./constants.ts";
import { Actor } from "./Actor.ts";
import { Wizard, initWizard, getWizardLevel } from "./Wizard.ts";
import { EnemyType, makeEnemies } from "./enemies/enemyMaker.ts";
import { BackgroundType, makeBackground } from "./backgroundMaker.ts";

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
    "btn-level-up",
    "btn-heal",
    "btn-reset",
  ];
  for (const id of ids) {
    ($(id) as HTMLButtonElement).disabled = !enabled;
  }
  // Cast magic and level up only for wizard
  const isWizard = enabled && currentActor instanceof Wizard;
  ($("btn-cast-magic") as HTMLButtonElement).disabled = !isWizard;
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
    const t = time.lastTime;
    if (currentActor) currentActor.update(t, sineToggle);
    if (dummyTarget) dummyTarget.update(t, !sineToggle);
  });

  // Wire up create button
  $("btn-create").addEventListener("click", () => {
    const type = (
      $("actor-type") as HTMLSelectElement
    ).value;
    const xp = parseInt(
      ($("wizard-xp") as HTMLInputElement).value,
    ) || 0;
    createActor(type, xp);
  });

  // XP field only relevant for wizard
  ($("actor-type") as HTMLSelectElement).addEventListener("change", (e) => {
    const isWizard =
      (e.target as HTMLSelectElement).value === "wizard";
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
    await currentActor.shake(0.5, 10);
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
    const dmg = await currentActor.attack(target);
    await target.takeDamage(dmg);
    log(`Attack dealt ${dmg} damage to Dummy`);
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
    const type = (
      $("actor-type") as HTMLSelectElement
    ).value;
    const xp = parseInt(
      ($("wizard-xp") as HTMLInputElement).value,
    ) || 0;
    createActor(type, xp);
    log("Reset actor position & state");
  });

  // Create wizard by default
  await createActor("wizard", 0);
}

init();
