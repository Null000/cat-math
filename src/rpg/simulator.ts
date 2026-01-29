// Cat Wizard - Endless Math RPG (text-based simulation)
// Run this in browser console, Node.js, or any JS environment

const enemies = {
    Slime: { hp: 22, attack: 4, speed: 3, xp: 15 },
    Bat: { hp: 16, attack: 4, speed: 9, xp: 12 },
    Spider: { hp: 20, attack: 5, speed: 6, xp: 18 },
    Skeleton: { hp: 32, attack: 6, speed: 4, xp: 25 },
    Goblin: { hp: 26, attack: 7, speed: 5, xp: 22 },
    DireRat: { hp: 24, attack: 5, speed: 7, xp: 20 },
    Wolf: { hp: 30, attack: 8, speed: 8, xp: 30 },
    Zombie: { hp: 42, attack: 7, speed: 2, xp: 35 },
    MimicChest: { hp: 38, attack: 10, speed: 3, xp: 45 },
    ForestBoss_Treant: { hp: 140, attack: 12, speed: 3, xp: 300 }
};

const enemyTypes = [
    "Slime", "Bat", "Spider", "Skeleton", "Goblin", "DireRat",
    "Wolf", "Zombie", "MimicChest"
];

// Player starts weak, grows stronger with levels
let player = {
    level: 1,
    hpMax: 75,
    hp: 75,
    attack: 9,
    speed: 6,
    xp: 0,
    xpToNextLevel: 100
};

let wave = 1;
let totalEnemiesDefeated = 0;

function log(text: string) {
    console.log(text);
    // You could also append to a <pre> or <div> in HTML
}

function levelUp() {
    player.level++;
    player.hpMax = Math.floor(player.hpMax * 1.12) + 10;
    player.attack = Math.floor(player.attack * 1.1) + 2;
    player.speed = Math.floor(player.speed * 1.08) + 1;
    player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.4) + 50;

    log(`\n✨ LEVEL UP! Now Level ${player.level}`);
    log(`HP: ${player.hpMax}  Attack: ${player.attack}  Speed: ${player.speed}`);
    log(`Next level needs ${player.xpToNextLevel} XP\n`);
}

function healPlayer() {
    player.hp = player.hpMax;
}

function createEnemyGroup(waveNumber: number) {
    const difficulty = Math.floor((waveNumber - 1) / 5) + 1;
    const numEnemies = Math.min(1 + Math.floor(waveNumber / 6), 5); // 1 → 2 → 3 → 4 → 5 max

    let group = [];

    // Early waves: mostly weak enemies
    if (waveNumber <= 5) {
        group = Array(numEnemies).fill("Slime");
    } else if (waveNumber <= 10) {
        group = Array(numEnemies).fill(1).map(() =>
            Math.random() < 0.6 ? "Bat" : "Slime"
        );
    } else {
        // Mix of stronger enemies + occasional boss chance
        for (let i = 0; i < numEnemies; i++) {
            const roll = Math.random();
            if (roll < 0.15 && waveNumber > 20) {
                group.push("ForestBoss_Treant");
            } else if (roll < 0.35) {
                group.push(["Wolf", "Zombie", "MimicChest"][Math.floor(Math.random() * 3)]);
            } else if (roll < 0.65) {
                group.push(["Goblin", "Skeleton", "DireRat"][Math.floor(Math.random() * 3)]);
            } else {
                group.push(["Bat", "Spider", "Slime"][Math.floor(Math.random() * 3)]);
            }
        }
    }

    return group.map(type => ({
        type,
        ...enemies[type],
        currentHp: enemies[type].hp
    }));
}

function simulateBattle() {
    log(`\n══════════════════════════════════════`);
    log(`Attempt #${player.level} - Wave ${wave}`);
    log(`Cat Wizard  HP: ${player.hp}/${player.hpMax}  ATK: ${player.attack}`);

    const enemiesInWave = createEnemyGroup(wave);

    enemiesInWave.forEach(e => {
        log(`→ ${e.type} (HP: ${e.currentHp}/${e.hp}  ATK: ${e.attack})`);
    });

    let aliveEnemies = [...enemiesInWave];

    while (player.hp > 0 && aliveEnemies.length > 0) {
        // Sort by speed (higher = acts first), player wins ties
        const turnOrder = [...aliveEnemies, { type: "Cat Wizard", speed: player.speed }]
            .sort((a, b) => b.speed - a.speed);

        for (const actor of turnOrder) {
            if (player.hp <= 0) break;

            if (actor.type === "Cat Wizard") {
                if (aliveEnemies.length === 0) break;

                // Player always hits (correct math answer)
                const target = aliveEnemies[0]; // attacks first enemy
                target.currentHp -= player.attack;

                log(`You cast Magic Missile → ${target.type} takes ${player.attack} damage!`);

                if (target.currentHp <= 0) {
                    log(`${target.type} was defeated!`);
                    player.xp += target.xp;
                    totalEnemiesDefeated++;
                    aliveEnemies = aliveEnemies.filter(e => e !== target);

                    if (player.xp >= player.xpToNextLevel) {
                        player.xp -= player.xpToNextLevel;
                        levelUp();
                    }
                }
            }
            else {
                // Enemy attacks player
                player.hp -= actor.attack;
                log(`${actor.type} attacks you for ${actor.attack} damage!`);

                if (player.hp <= 0) {
                    log("You have been defeated...");
                    break;
                }
            }
        }
    }

    if (player.hp <= 0) {
        log(`\nYou fell after defeating ${totalEnemiesDefeated} enemies this run.`);
        log(`Gained ${player.xp} XP this attempt.`);
        player.xp += 30; // consolation XP even on loss
        if (player.xp >= player.xpToNextLevel) {
            player.xp -= player.xpToNextLevel;
            levelUp();
        }
        healPlayer();
        wave = 1;
        totalEnemiesDefeated = 0;
    } else {
        wave++;
        log(`Wave ${wave - 1} cleared! Moving deeper...`);
    }
}

// ──────────────────────────────────────
// Run the game loop
// ──────────────────────────────────────

log("🐱✨  Welcome, Cat Wizard!  ✨🐱");
log("You will face endless waves... grow stronger with each attempt!\n");

function gameLoop() {
    while (true) {
        simulateBattle();
        // In real game you'd wait for input / next math problem here
        // For auto-simulation we just keep going
        if (wave > 30) break; // safety to prevent infinite loop in console
    }
}

// Start the adventure!
gameLoop();

// Want to make it interactive? Wrap simulateBattle() in a function
// and call it after each "correct answer" prompt.