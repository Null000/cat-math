// Cat Wizard - Battle Simulator
// Text-based simulation using the same battle logic as BattleManager
// Run with: bun run src/rpg/simulator.ts

import { EnemyType } from "./enemies/enemyMaker.js";

// ============================================================================
// Mock Actor - Mirrors the real Actor class stats without Pixi.js dependencies
// ============================================================================

class SimulatorActor {
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  defensePower: number;
  speed: number;
  xpDrop: number;

  constructor(config: {
    name: string;
    health: number;
    attackPower: number;
    defensePower: number;
    speed: number;
    xpDrop: number;
  }) {
    this.name = config.name;
    this.health = config.health;
    this.maxHealth = config.health;
    this.attackPower = config.attackPower;
    this.defensePower = config.defensePower;
    this.speed = config.speed;
    this.xpDrop = config.xpDrop;
  }

  attack(): number {
    return this.attackPower;
  }

  takeDamage(amount: number): boolean {
    const damage = Math.max(0, amount - this.defensePower);
    this.health = Math.max(0, this.health - damage);
    return this.health === 0;
  }

  reset(): void {
    this.health = this.maxHealth;
  }
}

// ============================================================================
// Enemy Factory - Creates SimulatorActors with stats matching real enemy classes
// ============================================================================

// Stats taken directly from the actual enemy class files
const enemyStats: Record<
  EnemyType,
  {
    name: string;
    health: number;
    attackPower: number;
    defensePower: number;
    speed: number;
    xpDrop: number;
  }
> = {
  [EnemyType.Rat]: {
    name: "Rat",
    health: 12,
    attackPower: 4,
    defensePower: 0,
    speed: 4,
    xpDrop: 8,
  },
  [EnemyType.DireRat]: {
    name: "DireRat",
    health: 24,
    attackPower: 5,
    defensePower: 2,
    speed: 7,
    xpDrop: 20,
  },
  [EnemyType.Goblin]: {
    name: "Goblin",
    health: 26,
    attackPower: 7,
    defensePower: 2,
    speed: 5,
    xpDrop: 22,
  },
  [EnemyType.Skeleton]: {
    name: "Skeleton",
    health: 32,
    attackPower: 6,
    defensePower: 3,
    speed: 4,
    xpDrop: 25,
  },
  [EnemyType.Zombie]: {
    name: "Zombie",
    health: 42,
    attackPower: 7,
    defensePower: 4,
    speed: 2,
    xpDrop: 35,
  },
  [EnemyType.Bat]: {
    name: "Bat",
    health: 16,
    attackPower: 4,
    defensePower: 1,
    speed: 9,
    xpDrop: 12,
  },
  [EnemyType.Wolf]: {
    name: "Wolf",
    health: 30,
    attackPower: 8,
    defensePower: 3,
    speed: 8,
    xpDrop: 30,
  },
  [EnemyType.Treant]: {
    name: "Treant",
    health: 140,
    attackPower: 12,
    defensePower: 8,
    speed: 3,
    xpDrop: 300,
  },
};

function makeSimulatorEnemy(type: EnemyType): SimulatorActor {
  const stats = enemyStats[type];
  return new SimulatorActor(stats);
}

// ============================================================================
// SimulatorBattleManager - Mirrors BattleManager logic for text-based battles
// ============================================================================

class SimulatorBattleManager {
  heroParty: SimulatorActor[] = [];
  enemyParty: SimulatorActor[] = [];
  turns: { actor: SimulatorActor; isHero: boolean; timeTillTurn: number }[] = [];
  wave: number = 1;

  init(): void {
    // Create wizard with stats from Wizard.ts
    this.heroParty = [
      new SimulatorActor({
        name: "Cat Wizard",
        health: 75,
        attackPower: 5,
        defensePower: 1,
        speed: 6,
        xpDrop: 0,
      }),
    ];

    this.initEnemy();
    this.initTurns();
  }

  initEnemy(): void {
    this.enemyParty = [];

    const enemies = this.createEnemyGroup(this.wave);
    for (const enemyType of enemies) {
      this.enemyParty.push(makeSimulatorEnemy(enemyType));
    }
  }

  createEnemyGroup(waveNumber: number): EnemyType[] {
    const numEnemies = Math.min(1 + Math.floor(waveNumber / 6), 5);
    const group: EnemyType[] = [];

    // Early waves: weak enemies (Rat, Bat)
    if (waveNumber <= 5) {
      for (let i = 0; i < numEnemies; i++) {
        group.push(EnemyType.Rat);
      }
    } else if (waveNumber <= 10) {
      for (let i = 0; i < numEnemies; i++) {
        group.push(Math.random() < 0.6 ? EnemyType.Bat : EnemyType.Rat);
      }
    } else {
      // Mix of stronger enemies + occasional boss
      for (let i = 0; i < numEnemies; i++) {
        const roll = Math.random();
        if (roll < 0.15 && waveNumber > 20) {
          group.push(EnemyType.Treant);
        } else if (roll < 0.35) {
          const strong = [EnemyType.Wolf, EnemyType.Zombie];
          group.push(strong[Math.floor(Math.random() * strong.length)]!);
        } else if (roll < 0.65) {
          const medium = [EnemyType.Goblin, EnemyType.Skeleton, EnemyType.DireRat];
          group.push(medium[Math.floor(Math.random() * medium.length)]!);
        } else {
          const weak = [EnemyType.Bat, EnemyType.Rat];
          group.push(weak[Math.floor(Math.random() * weak.length)]!);
        }
      }
    }

    return group;
  }

  initTurns(): void {
    this.turns = [];
    for (const actor of this.heroParty) {
      this.turns.push({ actor, isHero: true, timeTillTurn: 1 / actor.speed });
    }
    for (const actor of this.enemyParty) {
      this.turns.push({ actor, isHero: false, timeTillTurn: 1 / actor.speed });
    }
    this.sortTurns();
  }

  sortTurns(): void {
    this.turns.sort((a, b) => {
      if (a.timeTillTurn === b.timeTillTurn) {
        // Hero wins ties
        return (a.isHero ? 0 : 1) - (b.isHero ? 0 : 1);
      }
      return a.timeTillTurn - b.timeTillTurn;
    });
  }

  shiftTurns(): void {
    const turn = this.turns.shift()!;
    const timePassed = turn.timeTillTurn;
    for (const otherTurn of this.turns) {
      otherTurn.timeTillTurn -= timePassed;
    }
    turn.timeTillTurn = 1 / turn.actor.speed;
    this.turns.push(turn);
    this.sortTurns();
  }

  isHeroTurn(): boolean {
    return this.turns[0]?.isHero ?? false;
  }

  getNextActor(): SimulatorActor | undefined {
    return this.turns[0]?.actor;
  }

  correctAnswer(): { defeated: boolean; enemyDied: boolean; xpGained: number; waveCleared: boolean } {
    const attacker = this.heroParty[0]!;
    const defender = this.enemyParty[0]!;
    const enemyDied = defender.takeDamage(attacker.attack());
    let xpGained = 0;
    let waveCleared = false;

    if (enemyDied) {
      xpGained = defender.xpDrop;
      this.enemyParty.shift();
      this.turns = this.turns.filter((turn) => turn.actor !== defender);

      if (this.enemyParty.length === 0) {
        waveCleared = true;
        this.wave++;
        this.initEnemy();
        this.initTurns();
      }
    } else {
      this.shiftTurns();
    }

    return { defeated: false, enemyDied, xpGained, waveCleared };
  }

  enemyAttack(): { heroDied: boolean; damage: number; attacker: SimulatorActor } {
    const attacker = this.turns[0]!.actor;
    const defender = this.heroParty[0]!;
    const damage = Math.max(0, attacker.attack() - defender.defensePower);
    const heroDied = defender.takeDamage(attacker.attack());

    this.shiftTurns();

    return { heroDied, damage, attacker };
  }

  reset(): void {
    this.wave = 1;
    this.heroParty[0]?.reset();
    this.initEnemy();
    this.initTurns();
  }
}

// ============================================================================
// Game State & Logging
// ============================================================================

function log(text: string): void {
  console.log(text);
}

// ============================================================================
// Main Simulation
// ============================================================================

function runSimulation(maxWaves: number = 30): void {
  const battleManager = new SimulatorBattleManager();
  battleManager.init();

  let totalXp = 0;
  let totalEnemiesDefeated = 0;

  log("🐱✨  Welcome, Cat Wizard!  ✨🐱");
  log("Endless waves await... grow stronger with each battle!\n");

  while (battleManager.wave <= maxWaves) {
    const hero = battleManager.heroParty[0]!;

    log(`\n══════════════════════════════════════`);
    log(`Wave ${battleManager.wave}`);
    log(`${hero.name}  HP: ${hero.health}/${hero.maxHealth}  ATK: ${hero.attackPower}  DEF: ${hero.defensePower}  SPD: ${hero.speed}`);
    log(`Enemies:`);
    for (const enemy of battleManager.enemyParty) {
      log(`  → ${enemy.name} (HP: ${enemy.health}/${enemy.maxHealth}  ATK: ${enemy.attackPower}  DEF: ${enemy.defensePower}  SPD: ${enemy.speed})`);
    }

    // Battle loop for this wave
    let waveCleared = false;
    while (!waveCleared && hero.health > 0) {
      if (battleManager.isHeroTurn()) {
        // Hero attacks (simulate correct math answer)
        const target = battleManager.enemyParty[0]!;
        const result = battleManager.correctAnswer();

        log(`${hero.name} casts Magic Missile → ${target.name} takes ${Math.max(0, hero.attackPower - target.defensePower)} damage!`);

        if (result.enemyDied) {
          log(`  ${target.name} was defeated! (+${result.xpGained} XP)`);
          totalXp += result.xpGained;
          totalEnemiesDefeated++;
        }

        if (result.waveCleared) {
          waveCleared = true;
          log(`\n✨ Wave ${battleManager.wave - 1} cleared! Moving to wave ${battleManager.wave}...`);
        }
      } else {
        // Enemy attacks
        const result = battleManager.enemyAttack();

        log(`${result.attacker.name} attacks → ${hero.name} takes ${result.damage} damage! (HP: ${hero.health})`);

        if (result.heroDied) {
          log(`\n💀 ${hero.name} has fallen!`);
          log(`══════════════════════════════════════`);
          log(`Final Stats:`);
          log(`  Waves cleared: ${battleManager.wave - 1}`);
          log(`  Enemies defeated: ${totalEnemiesDefeated}`);
          log(`  Total XP earned: ${totalXp}`);
          log(`══════════════════════════════════════\n`);

          // Reset for new run
          battleManager.reset();
          totalXp = 0;
          totalEnemiesDefeated = 0;
          log("🐱✨  The Cat Wizard rises again!  ✨🐱\n");
          break;
        }
      }
    }
  }

  if (battleManager.wave > maxWaves) {
    log(`\n🎉 Congratulations! You cleared all ${maxWaves} waves!`);
    log(`  Enemies defeated: ${totalEnemiesDefeated}`);
    log(`  Total XP earned: ${totalXp}`);
  }
}

// Run the simulation
runSimulation();
