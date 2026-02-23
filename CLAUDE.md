# CLAUDE.md - AI Assistant Guide for Cat Math

## Project Overview

**Cat Math** is an educational web application for elementary mathematics practice. It features two separate applications:

1. **Main Practice App** (`/src`) - Traditional math practice with category selection, problem solving, rewards, and statistics tracking
2. **RPG Battle App** (`/src/rpg`) - Gamified math practice using turn-based RPG combat with Pixi.js

**Author**: Damjan Košir
**License**: AGPL-3.0-only

## Technology Stack

- **Language**: TypeScript 5.9 (strict mode)
- **Runtime/Bundler/Package Manager**: Bun
- **Graphics** (RPG only): Pixi.js 8.15
- **Code Formatting**: Prettier
- **Dev Server**: Caddy

## Project Structure

```
cat-math/
├── src/                      # Main Practice App
│   ├── index.html            # Category selection page
│   ├── index.ts              # Category selection logic
│   ├── practice.html         # Problem solving page
│   ├── practice.ts           # Practice mode logic
│   ├── app.ts                # Problem generation orchestrator
│   ├── problem.ts            # Problem caching/selection
│   ├── common.ts             # Problem interface, Category enum, categoryGroups
│   ├── i18n.ts               # Internationalization
│   ├── translations.ts       # EN/SL translation strings
│   ├── constants.ts          # Shared constants
│   ├── addition.ts           # Addition problem generators
│   ├── subtraction.ts        # Subtraction problem generators
│   ├── multiplication.ts     # Multiplication problem generators
│   ├── division.ts           # Division problem generators
│   ├── comparison.ts         # Comparison problem generators
│   ├── test.ts               # Test problem generator
│   ├── favicon-32x32.png     # Favicon
│   ├── rewardImages/         # Reward images (12 JPGs)
│   └── rpg/                  # RPG Battle App
│       ├── index.html        # RPG category selection page
│       ├── rpg.html          # RPG battle page
│       ├── actors.html       # Actor debug/test playground
│       ├── rpg.ts            # RPG battle entry point
│       ├── rpgIndex.ts       # RPG category selection logic
│       ├── actors.ts         # Actor debug/test playground logic
│       ├── BattleManager.ts  # Turn-based battle logic
│       ├── Actor.ts          # Abstract base class for characters
│       ├── Wizard.ts         # Player character
│       ├── HealthBar.ts      # Health bar component
│       ├── ProblemUI.ts      # In-battle math problem UI
│       ├── areas.ts          # Area/wave definitions for progression
│       ├── backgroundMaker.ts # Background sprite factory
│       ├── constants.ts      # RPG constants (800x600 canvas, reward count)
│       ├── simulator.ts      # Battle simulation
│       ├── enemies/          # Enemy character classes
│       │   ├── enemyMaker.ts # Enemy factory (21 enemy types)
│       │   ├── wizardMaker.ts # Wizard factory helper
│       │   └── *.ts          # Individual enemies (Rat, Goblin, Skeleton, etc.)
│       └── assets/           # Sprites and backgrounds (PNGs)
├── scripts/                  # Build and deploy utilities
│   ├── update-reward-count.ts # Counts reward images, updates constant
│   ├── pages.sh              # Cloudflare Pages deploy
│   ├── pages-beta.sh         # Beta deploy
│   └── pages-rpg.sh          # RPG-only deploy
├── dist/                     # Build output (gitignored)
├── package.json
├── tsconfig.json
├── bun.lock
└── .editorconfig
```

## Development Commands

```bash
# Build everything (main app + RPG)
bun run build

# Development with watch mode
bun run dev

# Start local server (run after build)
bun run caddy     # Serves on http://localhost:3000

# Run battle simulation
bun run sim

# Debug RPG in Chrome
bun run debug
```

## Code Conventions

### TypeScript
- **Strict mode enabled** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Use `.ts` extension in imports: `import { foo } from "./bar.ts"`
- Target: ESNext with DOM lib
- Module format: NodeNext

### Formatting (.editorconfig)
- UTF-8 encoding
- LF line endings
- Tab indentation (indent size 4)
- Insert final newline

### Naming Conventions
- **Files**: camelCase for modules (`common.ts`), PascalCase for classes (`Actor.ts`, `BattleManager.ts`)
- **Classes**: PascalCase (`Wizard`, `HealthBar`)
- **Functions**: camelCase (`getCurrentLanguage`, `takeDamage`)
- **Constants**: camelCase for simple values, UPPER_SNAKE_CASE for config keys (`LOCAL_STORAGE_KEY`)
- **Enums**: PascalCase with descriptive string values (`Category.Addition_Ten = "Addition: 10"`)
- **Const object enums**: `EnemyType` and `BackgroundType` use `as const` objects instead of TS enums

### RPG Patterns
- **Actor class hierarchy**: `Actor` (abstract) -> `Wizard` (player) / Enemy classes
- **Enemy factory**: Use `enemyMaker.ts` to create enemy instances; `wizardMaker.ts` for wizard
- **Canvas**: Standard 800x600 resolution (see `constants.ts`)
- **Animation**: Async/Promise-based for shake, death animations
- **Areas**: Progression defined in `areas.ts` with background + enemy wave definitions

## Key Interfaces

```typescript
// Problem definition (common.ts)
interface Problem {
  id: string;
  text: string;    // Display text like "5 + 3 = ?"
  answer: number;
  options?: { label: string; value: number }[];  // For comparison problems
}

// 31 math categories in Category enum (5 groups)
enum Category {
  Addition_Ten = "Addition: 10",
  // ... Addition (11), Subtraction (9), Multiplication (4), Division (4), Comparison (3)
  // See common.ts for full list
}

// Category groupings (common.ts)
const categoryGroups: Record<string, Category[]>;    // By math type
const yearGroupsSl: Record<string, Category[]>;      // By Slovenian school year
const categoryToGroup: Record<Category, string>;     // Reverse lookup
```

## LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `selected_categories` | User's selected practice categories |
| `{category_name}` | Array of solved problem IDs per category |
| `completedRewardImages` | Already shown reward images |
| `math_practice_language` | Language preference (`en` or `sl`) |
| `xp` | RPG wizard experience points |

## Internationalization

- Two languages: English (`en`) and Slovenian (`sl`)
- Default language: Slovenian
- Use `t(key)` for UI strings
- Use `getCategoryDisplayName(category)` for category labels
- Translations defined in `translations.ts`

## Build Process

1. `update-reward-count.ts` runs first (counts reward images, updates constant)
2. HTML files copied to `dist/`
3. Assets (images, sprites, favicon) copied to `dist/`
4. TypeScript bundled with Bun to `dist/`

Entry points for bundling:
- `src/app.ts`
- `src/index.ts`
- `src/practice.ts`
- `src/rpg/rpg.ts`
- `src/rpg/rpgIndex.ts`
- `src/rpg/actors.ts`

## Testing

No formal test framework is currently set up. Testing is done manually via browser. The `actors.html` page serves as a debug playground for RPG actor animations and attacks.

## Important Notes

- The RPG app uses Pixi.js and is canvas-based
- Problem generators create problems with unique IDs for tracking completion
- The reward system reveals images as students complete problems
- Both apps share common code from `/src` (problem generation, i18n, common types)
- Comparison problems use multiple-choice options (`<`, `=`, `>`) instead of numeric input
