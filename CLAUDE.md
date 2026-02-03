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
- **Graphics** (RPG only): Pixi.js 8.15, pixi-filters 6.1
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
│   ├── common.ts             # Problem interface & Category enum
│   ├── i18n.ts               # Internationalization
│   ├── translations.ts       # EN/SL translation strings
│   ├── constants.ts          # Shared constants
│   ├── addition.ts           # Addition problem generators
│   ├── subtraction.ts        # Subtraction problem generators
│   ├── multiplication.ts     # Multiplication problem generators
│   ├── division.ts           # Division problem generators
│   ├── test.ts               # Test problem generator
│   ├── rewardImages/         # Reward images (12 JPGs)
│   └── rpg/                  # RPG Battle App
│       ├── rpg.html          # RPG battle page
│       ├── rpg.ts            # RPG entry point
│       ├── BattleManager.ts  # Turn-based battle logic
│       ├── Actor.ts          # Abstract base class for characters
│       ├── Wizard.ts         # Player character
│       ├── HealthBar.ts      # Health bar component
│       ├── constants.ts      # RPG constants (800x600 canvas)
│       ├── simulator.ts      # Battle simulation
│       ├── enemies/          # Enemy character classes
│       │   ├── enemyMaker.ts # Enemy factory
│       │   └── *.ts          # Individual enemies (Rat, Goblin, etc.)
│       └── assets/           # Sprites and backgrounds (PNGs)
├── scripts/                  # Build utilities
│   └── update-reward-count.ts
├── dist/                     # Build output (gitignored)
├── package.json
├── tsconfig.json
└── .editorconfig
```

## Development Commands

```bash
# Build everything (main app + RPG)
bun run build

# Build RPG only
bun run build:rpg

# Development with watch mode
bun run dev       # Full app
bun run dev:rpg   # RPG only

# Start local server (run after build)
bun run caddy     # Serves on http://localhost:3000

# Debug RPG in Chrome
bun run debug
```

## Code Conventions

### TypeScript
- **Strict mode enabled** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Use `.js` extension in imports (required for ESM): `import { foo } from "./bar.js"`
- Target: ESNext with DOM lib
- Module format: NodeNext

### Formatting (.editorconfig)
- UTF-8 encoding
- LF line endings
- 2-space indentation
- Insert final newline

### Naming Conventions
- **Files**: camelCase for modules (`common.ts`), PascalCase for classes (`Actor.ts`, `BattleManager.ts`)
- **Classes**: PascalCase (`Wizard`, `HealthBar`)
- **Functions**: camelCase (`getCurrentLanguage`, `takeDamage`)
- **Constants**: camelCase for simple values, UPPER_SNAKE_CASE for config keys (`LOCAL_STORAGE_KEY`)
- **Enums**: PascalCase with descriptive string values (`Category.Addition_Ten = "Addition: 10"`)

### RPG Patterns
- **Actor class hierarchy**: `Actor` (abstract) -> `Wizard` (player) / Enemy classes
- **Enemy factory**: Use `enemyMaker.ts` to create enemy instances
- **Canvas**: Standard 800x600 resolution (see `constants.ts`)
- **Animation**: Async/Promise-based for shake, death animations

## Key Interfaces

```typescript
// Problem definition (common.ts)
interface Problem {
  id: string;
  text: string;    // Display text like "5 + 3 = ?"
  answer: number;
}

// 28 math categories in Category enum
enum Category {
  Addition_Ten = "Addition: 10",
  // ... see common.ts for full list
}
```

## LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `selected_categories` | User's selected practice categories |
| `{category_name}` | Array of solved problem IDs per category |
| `completedRewardImages` | Already shown reward images |
| `math_practice_language` | Language preference (`en` or `sl`) |

## Internationalization

- Two languages: English (`en`) and Slovenian (`sl`)
- Default language: Slovenian
- Use `t(key)` for UI strings
- Use `getCategoryDisplayName(category)` for category labels
- Translations defined in `translations.ts`

## Build Process

1. `update-reward-count.ts` runs first (counts reward images, updates constant)
2. HTML files copied to `dist/`
3. Assets (images, sprites) copied to `dist/`
4. TypeScript bundled with Bun to `dist/`

Entry points for bundling:
- `src/app.ts`
- `src/index.ts`
- `src/practice.ts`
- `src/rpg/rpg.ts`

## Testing

No formal test framework is currently set up. Testing is done manually via browser.

## Important Notes

- The RPG app uses Pixi.js and is canvas-based
- Problem generators create problems with unique IDs for tracking completion
- The reward system reveals images as students complete problems
- Both apps share common code from `/src` (problem generation, i18n, common types)
