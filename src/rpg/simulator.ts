// Cat Wizard - Text-based Battle Simulator
// Uses same turn system as BattleManager

import { EnemyType } from './enemies/enemyMaker.js';

// Stats matching the actual game enemies
const enemyStats: Record<EnemyType, { name: string; hp: number; attack: number; defense: number; speed: number; xp: number }> = {
    [EnemyType.Rat]: { name: 'Rat', hp: 20, attack: 5, defense: 1, speed: 4, xp: 10 },
    [EnemyType.DireRat]: { name: 'Dire Rat', hp: 24, attack: 5, defense: 2, speed: 7, xp: 20 },
    [EnemyType.Goblin]: { name: 'Goblin', hp: 26, attack: 7, defense: 2, speed: 5, xp: 22 },
    [EnemyType.Skeleton]: { name: 'Skeleton', hp: 32, attack: 6, defense: 3, speed: 4, xp: 25 },
    [EnemyType.Zombie]: { name: 'Zombie', hp: 42, attack: 7, defense: 4, speed: 2, xp: 35 },
    [EnemyType.Bat]: { name: 'Bat', hp: 16, attack: 4, defense: 0, speed: 9, xp: 12 },
    [EnemyType.Wolf]: { name: 'Wolf', hp: 30, attack: 8, defense: 2, speed: 8, xp: 30 },
    [EnemyType.Treant]: { name: 'Treant', hp: 140, attack: 12, defense: 5, speed: 3, xp: 300 },
};

interface SimActor {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    xp: number;
    isHero: boolean;
}

interface Turn {
    actor: SimActor;
    timeTillTurn: number;
}

class SimulatorBattleManager {
    heroParty: SimActor[] = [];
    enemyParty: SimActor[] = [];
    turns: Turn[] = [];
    wave = 1;
    totalEnemiesDefeated = 0;

    init() {
        this.heroParty = [{
            name: 'Cat Wizard',
            hp: 75,
            maxHp: 75,
            attack: 12,
            defense: 2,
            speed: 6,
            xp: 0,
            isHero: true,
        }];

        this.initEnemies();
        this.initTurns();
    }

    initEnemies() {
        this.enemyParty = [];

        // Wave determines enemy composition (similar to BattleManager)
        const enemyCount = Math.min(1 + Math.floor(this.wave / 6), 5);

        for (let i = 0; i < enemyCount; i++) {
            const type = this.selectEnemyType();
            const stats = enemyStats[type];
            this.enemyParty.push({
                name: stats.name,
                hp: stats.hp,
                maxHp: stats.hp,
                attack: stats.attack,
                defense: stats.defense,
                speed: stats.speed,
                xp: stats.xp,
                isHero: false,
            });
        }
    }

    selectEnemyType(): EnemyType {
        if (this.wave <= 3) {
            return EnemyType.Rat;
        } else if (this.wave <= 6) {
            return Math.random() < 0.6 ? EnemyType.Bat : EnemyType.Rat;
        } else if (this.wave <= 10) {
            const roll = Math.random();
            if (roll < 0.3) return EnemyType.DireRat;
            if (roll < 0.6) return EnemyType.Goblin;
            return EnemyType.Skeleton;
        } else if (this.wave <= 20) {
            const roll = Math.random();
            if (roll < 0.2) return EnemyType.Wolf;
            if (roll < 0.4) return EnemyType.Zombie;
            if (roll < 0.6) return EnemyType.Skeleton;
            if (roll < 0.8) return EnemyType.Goblin;
            return EnemyType.DireRat;
        } else {
            // Late game: chance for boss
            if (Math.random() < 0.1) return EnemyType.Treant;
            const roll = Math.random();
            if (roll < 0.25) return EnemyType.Wolf;
            if (roll < 0.5) return EnemyType.Zombie;
            if (roll < 0.75) return EnemyType.Skeleton;
            return EnemyType.Goblin;
        }
    }

    initTurns() {
        this.turns = [];

        for (const actor of this.heroParty) {
            this.turns.push({ actor, timeTillTurn: 1 / actor.speed });
        }
        for (const actor of this.enemyParty) {
            this.turns.push({ actor, timeTillTurn: 1 / actor.speed });
        }

        this.sortTurns();
    }

    sortTurns() {
        this.turns.sort((a, b) => {
            if (a.timeTillTurn === b.timeTillTurn) {
                // Hero wins ties
                return (a.actor.isHero ? 0 : 1) - (b.actor.isHero ? 0 : 1);
            }
            return a.timeTillTurn - b.timeTillTurn;
        });
    }

    shiftTurns() {
        const turn = this.turns.shift()!;
        const timePassed = turn.timeTillTurn;

        for (const otherTurn of this.turns) {
            otherTurn.timeTillTurn -= timePassed;
        }

        turn.timeTillTurn = 1 / turn.actor.speed;
        this.turns.push(turn);
        this.sortTurns();
    }

    takeDamage(defender: SimActor, attackPower: number): boolean {
        const damage = Math.max(0, attackPower - defender.defense);
        defender.hp = Math.max(0, defender.hp - damage);
        log(`  ${defender.name} takes ${damage} damage! (HP: ${defender.hp}/${defender.maxHp})`);
        return defender.hp === 0;
    }

    heroAttack(): boolean {
        const attacker = this.heroParty[0]!;
        const defender = this.enemyParty[0]!;

        log(`${attacker.name} casts Magic Missile!`);

        if (this.takeDamage(defender, attacker.attack)) {
            log(`  ${defender.name} was defeated!`);
            attacker.xp += defender.xp;
            this.totalEnemiesDefeated++;

            // Remove defeated enemy
            this.enemyParty.shift();
            this.turns = this.turns.filter(t => t.actor !== defender);

            if (this.enemyParty.length === 0) {
                return true; // Wave cleared
            }
        }

        this.shiftTurns();
        return false;
    }

    enemyAttack(): boolean {
        const turn = this.turns[0]!;
        const attacker = turn.actor;
        const defender = this.heroParty[0]!;

        log(`${attacker.name} attacks!`);

        if (this.takeDamage(defender, attacker.attack)) {
            log(`  ${defender.name} has fallen!`);
            return true; // Hero defeated
        }

        this.shiftTurns();
        return false;
    }

    doEnemyTurns(): boolean {
        while (this.turns[0] && !this.turns[0].actor.isHero) {
            if (this.enemyAttack()) {
                return true; // Hero defeated
            }
        }
        return false;
    }

    simulateWave(): 'victory' | 'defeat' {
        log(`\n${'='.repeat(50)}`);
        log(`Wave ${this.wave}`);
        log(`${this.heroParty[0]!.name} HP: ${this.heroParty[0]!.hp}/${this.heroParty[0]!.maxHp}`);
        log(`Enemies: ${this.enemyParty.map(e => e.name).join(', ')}`);
        log('');

        while (this.enemyParty.length > 0 && this.heroParty[0]!.hp > 0) {
            // Process enemy turns until hero's turn
            if (this.doEnemyTurns()) {
                return 'defeat';
            }

            // Hero attacks (simulating correct answer)
            if (this.heroAttack()) {
                log(`\nWave ${this.wave} cleared!`);
                return 'victory';
            }

            // Process any enemy turns that became ready
            if (this.doEnemyTurns()) {
                return 'defeat';
            }
        }

        return this.heroParty[0]!.hp > 0 ? 'victory' : 'defeat';
    }

    nextWave() {
        this.wave++;
        this.initEnemies();
        this.initTurns();
    }

    reset() {
        this.wave = 1;
        this.totalEnemiesDefeated = 0;
        this.init();
    }
}

function log(text: string) {
    console.log(text);
}

function runSimulation(maxWaves = 30) {
    log('Cat Wizard - Battle Simulator');
    log('Using BattleManager turn system\n');

    const manager = new SimulatorBattleManager();
    manager.init();

    while (manager.wave <= maxWaves) {
        const result = manager.simulateWave();

        if (result === 'defeat') {
            log(`\nGame Over at Wave ${manager.wave}`);
            log(`Total enemies defeated: ${manager.totalEnemiesDefeated}`);
            log(`XP earned: ${manager.heroParty[0]!.xp}`);
            break;
        }

        manager.nextWave();
    }

    if (manager.wave > maxWaves) {
        log(`\nSimulation complete! Reached wave ${maxWaves}`);
        log(`Total enemies defeated: ${manager.totalEnemiesDefeated}`);
        log(`Final XP: ${manager.heroParty[0]!.xp}`);
    }
}

// Run the simulation
runSimulation();
