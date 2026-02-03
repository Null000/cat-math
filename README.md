# Cat Math

An educational web application for elementary mathematics practice featuring two modes: traditional practice and RPG-style gamified learning.

## Features

### Main Practice App
- Category-based math problem selection (28 categories)
- Addition, subtraction, multiplication, and division
- Progress tracking with localStorage
- Reward image system for motivation
- Bilingual support (English/Slovenian)

### RPG Battle App
- Turn-based RPG combat powered by Pixi.js
- Solve math problems to attack enemies
- Multiple enemy types with unique sprites
- Health bars and battle animations

## Tech Stack

- **TypeScript** 5.9 (strict mode)
- **Bun** - Runtime, bundler, and package manager
- **Pixi.js** 8.15 - WebGL graphics for RPG mode
- **Caddy** - Local development server

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- [Caddy](https://caddyserver.com/) for local development server

### Installation

```bash
bun install
```

### Development

```bash
# Build and watch for changes
bun run dev

# Start local server (in a separate terminal)
bun run caddy
```

Then open http://localhost:3000 in your browser.

### Build for Production

```bash
bun run build
```

Output goes to the `dist/` directory.

## Project Structure

```
cat-math/
├── src/                  # Main Practice App
│   ├── index.html        # Category selection page
│   ├── practice.html     # Problem solving page
│   ├── *.ts              # Problem generators and logic
│   ├── rewardImages/     # Reward images
│   └── rpg/              # RPG Battle App
│       ├── rpg.html      # Battle page
│       ├── *.ts          # Battle logic and actors
│       ├── enemies/      # Enemy classes
│       └── assets/       # Sprites and backgrounds
├── scripts/              # Build utilities
└── dist/                 # Build output
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build entire application |
| `bun run build:rpg` | Build RPG app only |
| `bun run dev` | Development mode with watch |
| `bun run dev:rpg` | RPG development with watch |
| `bun run caddy` | Start local server on port 3000 |
| `bun run debug` | Launch Chrome with remote debugging |

## License

AGPL-3.0-only

## Author

Damjan Košir
