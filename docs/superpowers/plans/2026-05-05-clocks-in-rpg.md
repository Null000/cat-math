# Clocks in RPG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Clock categories to be selected and played in the RPG battle app, displaying the analog-clock SVG via an HTML overlay above the Pixi canvas.

**Architecture:** `ProblemUI` gets a third HTML overlay (alongside the existing input row) that holds the clock SVG via `innerHTML`. When a problem has an `svg` field, the overlay is shown and the existing Pixi `Text` is hidden; otherwise the existing Pixi text behavior is preserved. The picker (`rpgIndex.ts`) drops its Clock-category exclusions and renders SVG examples the same way the main `index.ts` does.

**Tech Stack:** TypeScript, Pixi.js 8, Bun. No tests in this repo — verification is manual (browser).

---

## File Structure

**Modified:**
- `src/rpg/ProblemUI.ts` — add SVG overlay element, extend `setProblem` and `updateTransform`.
- `src/rpg/rpgIndex.ts` — remove Clock exclusions, render SVG examples, add picker CSS for clock examples.
- `src/rpg/rpg.ts` — pass `currentProblem.problem.svg` to `setProblem`.

**No new files.** No test files (project has no test framework — see CLAUDE.md "Testing").

---

## Task 1: Plumb `svg` parameter through `ProblemUI.setProblem`

This task changes the signature only and the call sites — no overlay yet. Lets us land the API change separately from the rendering work.

**Files:**
- Modify: `src/rpg/ProblemUI.ts:292-323`
- Modify: `src/rpg/rpg.ts:104-117`

- [ ] **Step 1: Extend `setProblem` signature**

In `src/rpg/ProblemUI.ts`, change the signature of `setProblem` from:

```ts
setProblem(text: string, options?: { label: string; value: number }[], answerType: "string" | "number" = "number") {
```

to:

```ts
setProblem(text: string, options?: { label: string; value: number }[], answerType: "string" | "number" = "number", svg?: string) {
```

The body stays unchanged for now. The `svg` parameter is unused; we wire it up in Task 2.

- [ ] **Step 2: Pass `svg` from `rpg.ts`**

In `src/rpg/rpg.ts`, both `setProblem` call sites currently look like:

```ts
mathUI.setProblem(
    currentProblem.problem.text,
    currentProblem.problem.options,
    typeof currentProblem.problem.answer as "string" | "number"
);
```

Change both to:

```ts
mathUI.setProblem(
    currentProblem.problem.text,
    currentProblem.problem.options,
    typeof currentProblem.problem.answer as "string" | "number",
    currentProblem.problem.svg,
);
```

There are exactly two call sites: one in `init()` after `mathUI` is constructed (around line 104), and one inside `nextProblem()` (around line 112).

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/rpg/ProblemUI.ts src/rpg/rpg.ts
git commit -m "rpg: plumb svg param through ProblemUI.setProblem"
```

---

## Task 2: Add SVG overlay element and render logic to `ProblemUI`

**Files:**
- Modify: `src/rpg/ProblemUI.ts` (multiple locations)

- [ ] **Step 1: Add a `problemSvgDiv` field**

In `src/rpg/ProblemUI.ts`, add a new private field next to the existing `optionsContainer`:

```ts
private optionsContainer: HTMLDivElement;
private problemSvgDiv: HTMLDivElement;
```

- [ ] **Step 2: Add CSS for the SVG overlay**

In the existing `this.styleTag.innerHTML` template (the big CSS block in the constructor), append these rules just after the `.rpg-option-btn.option-wrong` block:

```css
#problem-svg {
    position: absolute;
    width: 200px;
    height: 200px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 16px;
    padding: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    pointer-events: none;
    display: none;
}

#problem-svg .clock-svg {
    display: block;
    width: 100%;
    height: 100%;
}
```

- [ ] **Step 3: Create the overlay element in the constructor**

In the constructor, after `this.optionsContainer = document.createElement("div");` and its id assignment, add:

```ts
this.problemSvgDiv = document.createElement("div");
this.problemSvgDiv.id = "problem-svg";
```

Then, in the block that appends children to `this.container`, add `this.problemSvgDiv` so that block reads:

```ts
this.container.appendChild(this.inputRow);
this.container.appendChild(this.optionsContainer);
this.container.appendChild(this.problemSvgDiv);
document.body.appendChild(this.container);
```

- [ ] **Step 4: Wire `svg` into `setProblem`**

Replace the entire body of `setProblem(text, options, answerType, svg)` with:

```ts
setProblem(text: string, options?: { label: string; value: number }[], answerType: "string" | "number" = "number", svg?: string) {
    if (svg) {
        this.problemSvgDiv.innerHTML = svg;
        this.problemSvgDiv.style.display = "block";
        this.problemText.visible = false;
    } else {
        this.problemSvgDiv.innerHTML = "";
        this.problemSvgDiv.style.display = "none";
        this.problemText.visible = true;
        this.problemText.text = localizeProblemText(text);
    }
    this.problemText.style.fill = "#ffffff"; // Reset color if changed

    if (answerType === "string") {
        this.input.inputMode = "text";
        this.input.removeAttribute("pattern");
    } else {
        this.input.inputMode = "numeric";
        this.input.setAttribute("pattern", "[0-9]*");
    }

    if (options && options.length > 0) {
        this.inputRow.style.display = "none";
        this.optionsContainer.style.display = "flex";
        this.optionsContainer.innerHTML = "";
        for (const option of options) {
            const btn = document.createElement("button");
            btn.className = "rpg-option-btn";
            btn.textContent = option.label;
            btn.addEventListener("click", () => {
                this.submitCallback(option.value.toString());
            });
            this.optionsContainer.appendChild(btn);
        }
    } else {
        this.optionsContainer.style.display = "none";
        this.optionsContainer.innerHTML = "";
        this.inputRow.style.display = "";
        this.input.focus();
    }
}
```

The change from the original is the new `if (svg) { ... } else { ... }` block at the top, which conditionally sets the SVG overlay vs the Pixi text. The `this.problemText.text = ...` assignment now lives only in the `else` branch (when there's no SVG).

- [ ] **Step 5: Position the SVG overlay in `updateTransform`**

The existing `updateTransform(scale, offsetX, offsetY)` positions `this.container` (the input wrapper) at game-space (400, 250). The SVG overlay is a child of that same container but should appear at game-space (400, 150) — where the Pixi `problemText` lives.

Position the SVG overlay relative to the container by computing its offset in container-local coordinates. Since the container is centered at game (400, 250) via the `translate(-50%, -50%)` on the container, and we want the SVG centered at game (400, 150), the SVG needs to sit 100 game-units (i.e., before container scaling) above the container's center.

Replace the body of `updateTransform` with:

```ts
updateTransform(scale: number, offsetX: number, offsetY: number) {
    const gameX = 400;
    const gameY = 250;

    const screenX = gameX * scale + offsetX;
    const screenY = gameY * scale + offsetY;

    this.container.style.left = `${screenX}px`;
    this.container.style.top = `${screenY}px`;
    this.container.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // The SVG sits above the input row in game-space (at gameY = 150 vs the container's gameY = 250).
    // The container is already scaled, so use unscaled (game-space) units here.
    this.problemSvgDiv.style.top = `-100px`;
}
```

Note: setting `top: -100px` once would normally suffice, but we set it inside `updateTransform` so it lives in one place; the value doesn't actually depend on `scale` because the parent container handles scaling.

Alternative — set this once in CSS to keep `updateTransform` lean. To do that instead: leave the original `updateTransform` body alone and add `top: -100px;` to the `#problem-svg` CSS rule from Step 2. Pick one approach; the rest of this plan assumes the CSS approach for simplicity, so:

**Revise Step 2:** add `top: -100px;` to the `#problem-svg` CSS rule (so the rule becomes `position: absolute; width: 200px; height: 200px; top: -100px; left: 50%; ...`). Then `updateTransform` does NOT need to change in this step — keep its original body.

- [ ] **Step 6: Verify build**

Run: `bun run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 7: Manual smoke-test (no clock yet)**

Run: `bun run caddy` (in another terminal if needed) and load `http://localhost:3000/rpg/`.
Pick a non-clock category (e.g. Addition: 10), enter battle. Confirm the existing Pixi text problem still renders, the input still works, and answers are checked. No regression.

- [ ] **Step 8: Commit**

```bash
git add src/rpg/ProblemUI.ts
git commit -m "rpg: render Problem.svg as HTML overlay in ProblemUI"
```

---

## Task 3: Enable Clock categories in the RPG picker

**Files:**
- Modify: `src/rpg/rpgIndex.ts:9` (delete `CLOCK_CATEGORIES`)
- Modify: `src/rpg/rpgIndex.ts:112` (group filter)
- Modify: `src/rpg/rpgIndex.ts:125` (per-item filter)
- Modify: `src/rpg/rpgIndex.ts:189-197` (example rendering)
- Modify: `src/rpg/index.html` (add `.example-problem .clock-svg` CSS)

- [ ] **Step 1: Remove the Clock exclusion at the group level**

In `src/rpg/rpgIndex.ts`, change line 112 from:

```ts
if (groupName === "Test" || groupName === "Clock") return;
```

to:

```ts
if (groupName === "Test") return;
```

- [ ] **Step 2: Remove the per-item Clock filter**

In `src/rpg/rpgIndex.ts`, delete the `if (CLOCK_CATEGORIES.has(category as Category)) return;` line inside the `categoryList.forEach((category) => { ... })` block (around line 125).

- [ ] **Step 3: Delete the now-unused `CLOCK_CATEGORIES` constant and its imports**

At the top of `src/rpg/rpgIndex.ts`, delete:

```ts
const CLOCK_CATEGORIES: ReadonlySet<Category> = new Set(categoryGroups.Clock);
```

Then update the `import { Category, categoryGroups } from "../common.ts";` line: if `categoryGroups` is no longer referenced anywhere else in this file, change the import to `import { Category } from "../common.ts";`. Verify by searching the file for `categoryGroups`. If only the deleted line referenced it, drop it from the import.

- [ ] **Step 4: Render SVG in example problems**

In `src/rpg/rpgIndex.ts`, find the example-generation loop:

```ts
// Generate 3 example problems
for (let i = 0; i < 3; i++) {
    const exampleProblem = getRandomProblem(
        category as Category,
    );
    const exampleDiv = document.createElement("div");
    exampleDiv.className = "example-problem";
    exampleDiv.textContent = exampleProblem.text;
    examplesList.appendChild(exampleDiv);
}
```

Replace the inner `exampleDiv.textContent = exampleProblem.text;` line with:

```ts
if (exampleProblem.svg) {
    exampleDiv.innerHTML = exampleProblem.svg;
} else {
    exampleDiv.textContent = exampleProblem.text;
}
```

- [ ] **Step 5: Add picker CSS for clock examples**

In `src/rpg/index.html`, find the `.example-problem` rule in the `<style>` block (around line 368). After that rule, add a new rule:

```css
.example-problem .clock-svg {
    display: block;
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 6px;
    padding: 2px;
    box-sizing: border-box;
}
```

This sizes the inline SVG so it fits in the existing `.example-problem` chip, with a white background so the black clock face stays legible against the dark picker theme.

- [ ] **Step 6: Verify build**

Run: `bun run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 7: Manual verification — picker**

Run/refresh `http://localhost:3000/rpg/`. The Clock group is now visible. Open it; each Clock category shows three small clock SVG previews in the examples list. Select one Clock category, click "Enter Battle" — should navigate to `rpg.html` without errors.

- [ ] **Step 8: Commit**

```bash
git add src/rpg/rpgIndex.ts src/rpg/index.html
git commit -m "rpg: enable Clock categories in picker, render svg examples"
```

---

## Task 4: End-to-end manual verification in the battle scene

**Files:** none (manual testing only).

- [ ] **Step 1: Boot the app**

Run: `bun run build && bun run caddy`
Open `http://localhost:3000/rpg/`.

- [ ] **Step 2: Clock-only battle**

Select only `Clock: hour and half hour`. Click Enter Battle. Verify:
1. The analog clock SVG displays as an HTML overlay near the top of the battle scene (where the Pixi text problem lives for normal categories), with a white rounded background.
2. The input field has `inputMode="text"` (mobile keyboards show text keyboard, not numeric).
3. Typing a correct answer like `3:30` for the displayed clock triggers an attack and advances to the next problem.
4. Typing a wrong answer shakes the input and does not advance.

- [ ] **Step 3: Mixed battle**

Select `Clock: 5 minutes` and `Addition: 10` together. Enter Battle. Verify across consecutive problems:
1. When a clock problem appears, the SVG overlay shows and the Pixi text is hidden.
2. When an addition problem appears, the Pixi text shows and the SVG overlay is hidden.
3. Input mode toggles between text and numeric appropriately.

- [ ] **Step 4: Resize**

While in battle, resize the browser window. Verify the SVG overlay stays correctly positioned (centered above the input field) and scales with the canvas.

- [ ] **Step 5: Area transition**

Solve enough clock problems to clear the wave / area. Verify the area transition (`fadeOut` -> `init` -> `fadeIn`) doesn't leave the SVG overlay stranded or misaligned.

- [ ] **Step 6: Final commit (if any cleanup needed)**

If the manual run revealed any small fixups (CSS tweaks, positioning), commit them with a clear message. Otherwise this task is verification-only and produces no commit.

---

## Self-Review Checklist

Spec sections vs tasks:

| Spec section | Implemented in |
|---|---|
| 1. `ProblemUI.ts` SVG overlay | Task 1 (signature) + Task 2 (overlay element, CSS, setProblem branch) |
| 2. `rpgIndex.ts` enable Clock + SVG examples | Task 3 |
| 3. `rpg.ts` pass `svg` through | Task 1 step 2 |
| Testing (manual checklist) | Task 4 |

No placeholders, no TBDs. Type signatures are consistent: `setProblem(text, options?, answerType?, svg?)` — same in all references. The `problemSvgDiv` field name is consistent across Task 2 steps. Existing `categoryGroups` import handling has explicit guidance (Step 3 of Task 3) for the conditional removal.
