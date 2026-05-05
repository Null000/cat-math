# Clocks in RPG — Design

## Goal

Allow Clock categories (`Clock_HourHalf`, `Clock_Quarter`, `Clock_FiveMin`) to be selected and played in the RPG battle app. The main practice app already supports them; the RPG app currently excludes them.

## Background

Clock problems generate a `Problem` with:
- `text: "🕒"` (placeholder)
- `svg: <svg>...</svg>` (rendered analog clock)
- `answer: "3:30"` (string)

Other problem categories produce `text` only, no `svg`, with a numeric `answer`.

The RPG `ProblemUI` displays `text` via a Pixi `Text` element on the canvas. It already accepts `answerType: "string"` so string-answer comparison and input mode work unchanged.

The RPG picker (`rpgIndex.ts`) currently excludes Clock categories with two guards (one at the group level, one per-item via `CLOCK_CATEGORIES`).

## Approach

Add an HTML overlay for SVG rendering — same pattern the input field already uses — instead of converting SVG to a Pixi texture or re-implementing the clock in Pixi Graphics. This keeps `clock.ts` (`renderClockSVG`) as the single source of truth.

## Changes

### 1. `src/rpg/ProblemUI.ts` — SVG overlay

Add a new DOM element inside the existing `solution-container`:

- `problemSvgDiv: HTMLDivElement` — absolutely positioned, holds SVG via `innerHTML`.

Extend `setProblem(text, options?, answerType?, svg?)`:

- If `svg` provided: `problemSvgDiv.innerHTML = svg`; set `problemSvgDiv.style.display = "block"`; set `this.problemText.visible = false`.
- If not: clear `problemSvgDiv.innerHTML`; set `problemSvgDiv.style.display = "none"`; set `this.problemText.visible = true`.

Add CSS rules in the existing `<style>` injected by `ProblemUI`:

- `#problem-svg` — sized ~200×200px, positioned so its center sits at the Pixi text's anchor point.
- `.clock-svg` inside `#problem-svg` — `width: 100%; height: 100%; display: block;`.

Extend `updateTransform()` to position `problemSvgDiv` analogously to the input row but at the upper coordinates (gameX = standardWidth/2, gameY = 150 — matching `this.problemText.x/y`).

### 2. `src/rpg/rpgIndex.ts` — enable Clock categories

- Remove `if (groupName === "Test" || groupName === "Clock") return;` → keep only the `"Test"` exclusion.
- Remove the `if (CLOCK_CATEGORIES.has(category as Category)) return;` per-item filter.
- Delete the now-unused `CLOCK_CATEGORIES` constant.
- In the example-problem loop, mirror the main `index.ts` pattern:
    ```ts
    if (exampleProblem.svg) {
        exampleDiv.innerHTML = exampleProblem.svg;
    } else {
        exampleDiv.textContent = exampleProblem.text;
    }
    ```
- Add picker CSS (in `index.html` `<style>` block) for `.example-problem .clock-svg { width: 56px; height: 56px; display: block; }` so the example clocks render at a sensible size.

### 3. `src/rpg/rpg.ts` — pass svg through

Update the two `mathUI.setProblem(...)` call sites to pass `currentProblem.problem.svg` as a fourth argument.

## Non-issues / verified assumptions

- **String answer comparison.** `rpg.ts` already branches on `typeof currentProblem.problem.answer === "string"` for case-insensitive trimmed compare. Works for `"3:30"`.
- **String input mode.** `ProblemUI.setProblem` already switches `inputMode = "text"` and removes the numeric `pattern` when `answerType === "string"`. Works with no change.
- **Problem generation wiring.** `clockReading.ts` is already integrated into `problem.ts` / `app.ts`; the RPG path uses the same `getProblem(...)` from `app.ts`.
- **No options on clock problems.** Clock problems have no `options`, so the input-row branch (not the multiple-choice branch) is used in `setProblem`.

## Testing

Manual verification in the browser:

1. **Picker page (`/rpg/`):** Clock group is visible. Each Clock category shows three example clock SVGs in the examples list. Selecting a Clock category and clicking "Enter Battle" navigates to the battle.
2. **Battle page:** Clock SVG appears centered in the upper area where the Pixi text problem normally is. Input field accepts text (e.g. `3:30`); correct answer triggers attack; incorrect answer shakes input.
3. **Mixed selection:** Pick one Clock category and one numeric category. Confirm the UI switches between SVG and Pixi-text problem rendering correctly across consecutive problems, and that the input mode toggles between text and numeric appropriately.
4. **Resize:** Window resize re-positions the SVG overlay correctly (verified via `updateTransform`).

## Out of scope

- Animating the clock or its hands.
- Touch/drag input on the clock itself (e.g., setting the time interactively).
- Per-language clock formats (12h vs 24h).
