# Clock Reading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new practice categories for reading an analog clock face at the hour/half, quarter, and 5-minute levels, rendered as inline SVG.

**Architecture:** Problem generator produces problems with an optional `svg` field holding an inline clock SVG; `text` stays as a non-revealing label. `practice.ts` and `index.ts` render that SVG via `innerHTML` when present. Round-review map gets re-keyed by `problem.id` so distinct clock problems don't collapse into a single bucket. No test framework exists in this project — verification is manual (browser) plus small `bun -e` stdout checks for the pure functions.

**Tech Stack:** TypeScript 5.9 (strict), Bun runtime/bundler, plain DOM / inline SVG, existing Caddy dev server.

**Spec:** `docs/superpowers/specs/2026-04-20-clock-reading-design.md`

---

## File Structure

Files created:

- `src/clock.ts` — pure `renderClockSVG(hour, minute)` function. Single responsibility: produce an SVG string for a given time.
- `src/clockReading.ts` — problem generator for the three clock categories. Single responsibility: map a problem index to a `Problem` (id, text, svg, answer).

Files modified:

- `src/common.ts` — add `svg?: string` to `Problem`; add three `Category` enum entries; add `Clock` entry to `categoryGroups`; extend `yearGroupsSl` for 2. and 3. razred.
- `src/translations.ts` — display names for the three new categories (en + sl); new `group_Clock` label.
- `src/problem.ts` — register the new generator under `generatorPerGroup.Clock`.
- `src/practice.ts` — render SVG when `currentProblem.svg` is set; re-key `roundIncorrectProblems` by `problem.id`; render SVG in the review row.
- `src/practice.html` — small CSS for `.clock-svg` sizing in problem and review contexts.
- `src/index.ts` — render SVG in the category-examples list when an example problem has an `svg` field.
- `src/index.html` — small CSS for `.clock-svg` inside `.example-problem`.

---

## Task 1: Schema & category wiring in `common.ts`

**Files:**

- Modify: `src/common.ts`

- [ ] **Step 1: Add `svg` field to `Problem`**

Edit `src/common.ts` lines 1–6 so the interface reads:

```typescript
export interface Problem {
	id: string;
	text: string;
	svg?: string;
	answer: number | string;
	options?: { label: string; value: number }[];
}
```

- [ ] **Step 2: Add three `Category` enum entries**

Insert the following three members into the `Category` enum in `src/common.ts`, directly above `Test = "test",`:

```typescript
	Clock_HourHalf = "Clock: hour and half hour",
	Clock_Quarter = "Clock: quarter hour",
	Clock_FiveMin = "Clock: 5 minutes",
```

- [ ] **Step 3: Add `Clock` group to `categoryGroups`**

In `src/common.ts`, inside the `categoryGroups` object, add a new entry after `NextPrevious` and before `Test`:

```typescript
	Clock: [
		Category.Clock_HourHalf,
		Category.Clock_Quarter,
		Category.Clock_FiveMin,
	],
```

- [ ] **Step 4: Extend `yearGroupsSl` for 2. razred and 3. razred**

In `src/common.ts`, inside `yearGroupsSl`:

In the `"2. razred"` array, append:

```typescript
		Category.Clock_HourHalf,
		Category.Clock_Quarter,
```

In the `"3. razred"` array, append:

```typescript
		Category.Clock_FiveMin,
```

- [ ] **Step 5: Type-check**

Run: `bun run build` (this transpiles everything; errors will surface here).
Expected: build succeeds. (Translations are not yet added — the app will log missing-translation warnings at runtime, but TypeScript does not fail.)

- [ ] **Step 6: Commit**

```bash
git add src/common.ts
git commit -m "common: add Clock categories and Problem.svg field"
```

---

## Task 2: Translations for the three new categories

**Files:**

- Modify: `src/translations.ts`

- [ ] **Step 1: Add English display names and group label**

Inside the `en:` block in `src/translations.ts`, in the same area as the other category translations, add:

```typescript
		[Category.Clock_HourHalf]: "Clock: hour and half hour",
		[Category.Clock_Quarter]: "Clock: quarter hour",
		[Category.Clock_FiveMin]: "Clock: 5 minutes",
```

And in the group-label block of `en:` (next to `group_NextPrevious`), add:

```typescript
		group_Clock: "Clock",
```

- [ ] **Step 2: Add Slovenian display names and group label**

Inside the `sl:` block in `src/translations.ts`, in the same area as the other category translations, add:

```typescript
		[Category.Clock_HourHalf]: "Ura: polne in pol ure",
		[Category.Clock_Quarter]: "Ura: četrt ure",
		[Category.Clock_FiveMin]: "Ura: 5 minut",
```

And in the group-label block of `sl:` (next to `group_NextPrevious`), add:

```typescript
		group_Clock: "Ura",
```

- [ ] **Step 3: Type-check**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/translations.ts
git commit -m "translations: add Clock categories (en, sl)"
```

---

## Task 3: Clock SVG renderer (`src/clock.ts`)

**Files:**

- Create: `src/clock.ts`

- [ ] **Step 1: Create `src/clock.ts` with `renderClockSVG`**

Write this exact content:

```typescript
const CX = 100;
const CY = 100;
const R_OUTER = 95;

function onCircle(r: number, deg: number): [number, number] {
	const rad = ((deg - 90) * Math.PI) / 180;
	return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function fmt(n: number): string {
	return n.toFixed(2);
}

export function renderClockSVG(hour: number, minute: number): string {
	const parts: string[] = [];

	parts.push(
		`<circle cx="${CX}" cy="${CY}" r="${R_OUTER}" fill="white" stroke="black" stroke-width="3"/>`,
	);

	for (let i = 0; i < 60; i++) {
		const angle = i * 6;
		const isHour = i % 5 === 0;
		const innerR = isHour ? 82 : 88;
		const [x1, y1] = onCircle(innerR, angle);
		const [x2, y2] = onCircle(R_OUTER - 2, angle);
		const sw = isHour ? 3 : 1.5;
		parts.push(
			`<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="black" stroke-width="${sw}" stroke-linecap="round"/>`,
		);
	}

	for (let n = 1; n <= 12; n++) {
		const [x, y] = onCircle(70, n * 30);
		parts.push(
			`<text x="${fmt(x)}" y="${fmt(y)}" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="black">${n}</text>`,
		);
	}

	const hourAngle = (hour % 12) * 30 + minute * 0.5;
	const [hx, hy] = onCircle(45, hourAngle);
	parts.push(
		`<line x1="${CX}" y1="${CY}" x2="${fmt(hx)}" y2="${fmt(hy)}" stroke="black" stroke-width="6" stroke-linecap="round"/>`,
	);

	const minuteAngle = minute * 6;
	const [mx, my] = onCircle(78, minuteAngle);
	parts.push(
		`<line x1="${CX}" y1="${CY}" x2="${fmt(mx)}" y2="${fmt(my)}" stroke="black" stroke-width="3" stroke-linecap="round"/>`,
	);

	parts.push(`<circle cx="${CX}" cy="${CY}" r="4" fill="black"/>`);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="clock-svg">${parts.join("")}</svg>`;
}
```

- [ ] **Step 2: Spot-check at 12:00, 3:00, 6:30, 9:45, 12:55**

Run:

```bash
bun -e 'import("./src/clock.ts").then(m => {
	for (const [h,min] of [[12,0],[3,0],[6,30],[9,45],[12,55]]) {
		const s = m.renderClockSVG(h,min);
		console.log(`${h}:${String(min).padStart(2,"0")} svg length=${s.length}`);
	}
})'
```

Expected: 5 lines printed, each with a non-zero length roughly in the 1500–2500 range. No errors.

- [ ] **Step 3: Hand-angle sanity check**

Run:

```bash
bun -e 'import("./src/clock.ts").then(m => {
	// At 12:00, both hands should point straight up (angle 0).
	// The hour-hand line should end at (100, 55) — 45px above center.
	const svg = m.renderClockSVG(12, 0);
	console.log(svg.includes("x2=\"100.00\" y2=\"55.00\"") ? "12:00 hour hand OK" : "FAIL hour hand at 12:00");
	// Minute hand at 12:00 ends at (100, 22) — 78px above center.
	console.log(svg.includes("x2=\"100.00\" y2=\"22.00\"") ? "12:00 minute hand OK" : "FAIL minute hand at 12:00");
})'
```

Expected:

```
12:00 hour hand OK
12:00 minute hand OK
```

- [ ] **Step 4: Type-check**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/clock.ts
git commit -m "clock: add renderClockSVG pure function"
```

---

## Task 4: Clock problem generator + wiring in `problem.ts`

**Files:**

- Create: `src/clockReading.ts`
- Modify: `src/problem.ts`

- [ ] **Step 1: Create `src/clockReading.ts`**

Write this exact content:

```typescript
import { Category, Problem } from "./common.ts";
import { renderClockSVG } from "./clock.ts";

const minutesPerCategory: Record<string, number[]> = {
	[Category.Clock_HourHalf]: [0, 30],
	[Category.Clock_Quarter]: [0, 15, 30, 45],
	[Category.Clock_FiveMin]: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
};

export function count(category: Category): number {
	const minutes = minutesPerCategory[category]!;
	return 12 * minutes.length;
}

export function getProblem(category: Category, n: number): Problem {
	const minutes = minutesPerCategory[category]!;
	const hourIdx = Math.floor(n / minutes.length);
	const minute = minutes[n % minutes.length]!;
	const hour = hourIdx + 1;
	const answer = `${hour}:${String(minute).padStart(2, "0")}`;
	return {
		id: `Clock_${category}_${hour}_${minute}`,
		text: "🕒",
		svg: renderClockSVG(hour, minute),
		answer,
	};
}
```

- [ ] **Step 2: Register the generator in `src/problem.ts`**

Modify `src/problem.ts`. Add the import next to the other imports:

```typescript
import * as clockReading from "./clockReading.ts";
```

And add to the `generatorPerGroup` object next to `NextPrevious`:

```typescript
	Clock: clockReading,
```

- [ ] **Step 3: Verify problem counts and IDs**

Run:

```bash
bun -e 'import("./src/clockReading.ts").then(m => {
	const cats = ["Clock: hour and half hour","Clock: quarter hour","Clock: 5 minutes"];
	const expect = [24,48,144];
	for (let i=0;i<cats.length;i++) {
		const c = m.count(cats[i]);
		console.log(`${cats[i]}: count=${c} (expected ${expect[i]})`);
	}
	// Spot-check a specific problem
	const p = m.getProblem("Clock: 5 minutes", 0);
	console.log("first FiveMin problem:", p.id, "answer=", p.answer);
	const p2 = m.getProblem("Clock: 5 minutes", 143);
	console.log("last FiveMin problem:", p2.id, "answer=", p2.answer);
})'
```

Expected:

```
Clock: hour and half hour: count=24 (expected 24)
Clock: quarter hour: count=48 (expected 48)
Clock: 5 minutes: count=144 (expected 144)
first FiveMin problem: Clock_Clock: 5 minutes_1_0 answer= 1:00
last FiveMin problem: Clock_Clock: 5 minutes_12_55 answer= 12:55
```

- [ ] **Step 4: Type-check**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/clockReading.ts src/problem.ts
git commit -m "clockReading: add generator and wire into problem.ts"
```

---

## Task 5: Render SVG in the practice UI

**Files:**

- Modify: `src/practice.ts` (function `newProblem`, around line 265)
- Modify: `src/practice.html` (add CSS inside the `<style>` block)

- [ ] **Step 1: Render SVG inside `newProblem`**

In `src/practice.ts`, locate the line:

```typescript
		if (problemElement) problemElement.textContent = localizeProblemText(currentProblem.text);
```

Replace it with:

```typescript
		if (problemElement) {
			if (currentProblem.svg) {
				problemElement.innerHTML = currentProblem.svg;
			} else {
				problemElement.textContent = localizeProblemText(currentProblem.text);
			}
		}
```

- [ ] **Step 2: Add CSS for `.clock-svg` inside `#problem`**

In `src/practice.html`, inside the existing `<style>` block (anywhere before `</style>`), add:

```css
#problem .clock-svg {
	display: block;
	width: 220px;
	height: 220px;
	margin: 0 auto;
	background: white;
	border-radius: 12px;
	padding: 8px;
}
```

- [ ] **Step 3: Build and run locally, then verify in browser**

Run: `bun run build && bun run caddy`
Open `http://localhost:3000/index.html`, select **Clock: hour and half hour**, press Start.
Expected:
- The problem area shows a clock face with numbers 1–12, two hands, and minute ticks.
- Typing the shown time (e.g. `3:00` or `3:30`) and submitting shows "Correct! 🎉".
- Typing a wrong answer shows the incorrect feedback; retry works.
- Typing strict wrong format like `3:5` for `3:05` is rejected.

Stop the server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add src/practice.ts src/practice.html
git commit -m "practice: render SVG problems for clock categories"
```

---

## Task 6: Re-key round-review map and render SVG in review rows

**Files:**

- Modify: `src/practice.ts`

- [ ] **Step 1: Change the `roundIncorrectProblems` map shape**

In `src/practice.ts` around line 163, change the declaration:

```typescript
		roundIncorrectProblems: new Map<
			string,
			{ correctAnswer: string; givenAnswers: string[] }
		>(),
```

to:

```typescript
		roundIncorrectProblems: new Map<
			string,
			{ text: string; svg?: string; correctAnswer: string; givenAnswers: string[] }
		>(),
```

- [ ] **Step 2: Change the map key from `text` to `id` when recording a miss**

In `src/practice.ts` around lines 441–455, locate the block:

```typescript
			const problemText = currentProblem.text;
			if (!stats.roundIncorrectProblems.has(problemText)) {
				stats.roundIncorrectProblems.set(problemText, {
					correctAnswer: getOptionLabel(
						currentProblem,
						currentProblem.answer,
					),
					givenAnswers: [],
				});
			}
			const record = stats.roundIncorrectProblems.get(problemText)!;
```

Replace it with:

```typescript
			const problemKey = currentProblem.id;
			if (!stats.roundIncorrectProblems.has(problemKey)) {
				const entry: {
					text: string;
					svg?: string;
					correctAnswer: string;
					givenAnswers: string[];
				} = {
					text: currentProblem.text,
					correctAnswer: getOptionLabel(
						currentProblem,
						currentProblem.answer,
					),
					givenAnswers: [],
				};
				if (currentProblem.svg) entry.svg = currentProblem.svg;
				stats.roundIncorrectProblems.set(problemKey, entry);
			}
			const record = stats.roundIncorrectProblems.get(problemKey)!;
```

- [ ] **Step 3: Update the two review-summary renderers to use `svg` when present**

There are two nearly identical review renderers in `src/practice.ts`: one inside `checkAnswer` (around lines 403–424) and one inside `endRound` (around lines 532–550). In both places, find the block:

```typescript
						stats.roundIncorrectProblems.forEach(
							(details, problemText) => {
								html += `
                                <div class="review-item">
                                    <span class="review-problem">${localizeProblemText(problemText)}</span>
                                    <div class="review-details">
                                        ${t("correct_answer")} <span class="review-correct">${details.correctAnswer}</span>,
                                        ${t("your_answers")} <span class="review-incorrect">${details.givenAnswers.join(", ")}</span>
                                    </div>
                                </div>
                            `;
							},
						);
```

(The `endRound` version uses `stats.roundIncorrectProblems.forEach((details, problemText) => { ... })` with the same body — look for the matching `review-item` HTML.)

Replace **both** blocks with:

```typescript
						stats.roundIncorrectProblems.forEach((details) => {
							const problemMarkup = details.svg
								? details.svg
								: localizeProblemText(details.text);
							html += `
                                <div class="review-item">
                                    <span class="review-problem">${problemMarkup}</span>
                                    <div class="review-details">
                                        ${t("correct_answer")} <span class="review-correct">${details.correctAnswer}</span>,
                                        ${t("your_answers")} <span class="review-incorrect">${details.givenAnswers.join(", ")}</span>
                                    </div>
                                </div>
                            `;
						});
```

- [ ] **Step 4: Add review-row CSS for smaller clock SVG**

In `src/practice.html`, inside the `<style>` block, add:

```css
.review-problem .clock-svg {
	width: 80px;
	height: 80px;
	vertical-align: middle;
}
```

- [ ] **Step 5: Type-check**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 6: Browser verification of review**

Run: `bun run caddy`, open `http://localhost:3000/index.html`, select **Clock: 5 minutes**, Start.
Intentionally answer two different clock problems incorrectly (e.g. skip one, mistype another), then finish with correct answers until the reward image completes (or press End Round).
Expected:
- Review summary shows two distinct review rows, each containing its own small clock SVG (about 80px) next to the "correct answer / your answers" lines.
- Non-clock categories (try **Addition: 10** in a separate round) still render review rows with text like `3 + 4 = ?` exactly as before.

Stop the server when done.

- [ ] **Step 7: Commit**

```bash
git add src/practice.ts src/practice.html
git commit -m "practice: re-key round-review by id and render svg in review rows"
```

---

## Task 7: Render SVG in category examples on the index page

**Files:**

- Modify: `src/index.ts` (function inside `groupDetails.addEventListener("toggle", …)`, around line 222)
- Modify: `src/index.html` (add CSS for `.clock-svg` in examples)

- [ ] **Step 1: Render SVG in examples when present**

In `src/index.ts`, locate the block around lines 216–223:

```typescript
							for (let i = 0; i < 3; i++) {
								const exampleProblem = getRandomProblem(
									cat as Category,
								);
								const exampleDiv = document.createElement("div");
								exampleDiv.className = "example-problem";
								exampleDiv.textContent = exampleProblem.text;
								examplesList.appendChild(exampleDiv);
							}
```

Replace the inner loop body so the SVG path is used when present:

```typescript
							for (let i = 0; i < 3; i++) {
								const exampleProblem = getRandomProblem(
									cat as Category,
								);
								const exampleDiv = document.createElement("div");
								exampleDiv.className = "example-problem";
								if (exampleProblem.svg) {
									exampleDiv.innerHTML = exampleProblem.svg;
								} else {
									exampleDiv.textContent = exampleProblem.text;
								}
								examplesList.appendChild(exampleDiv);
							}
```

- [ ] **Step 2: Add CSS for examples clock sizing**

In `src/index.html`, inside the existing `<style>` block, add:

```css
.example-problem .clock-svg {
	width: 60px;
	height: 60px;
	display: inline-block;
	vertical-align: middle;
}
```

- [ ] **Step 3: Type-check**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 4: Browser verification of examples**

Run: `bun run caddy`, open `http://localhost:3000/index.html`.
Expected:
- Under the **Clock** group (English) or **Ura** group (Slovenian), expand it. Each of the three categories shows three small clock-face examples (~60px) instead of `🕒` characters.
- Non-clock category examples (e.g. **Addition: 10**) are unchanged — still render as text like `3 + 4 = ?`.

Stop the server when done.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts src/index.html
git commit -m "index: render svg example problems for clock categories"
```

---

## Task 8: Final verification pass

**Files:** (none — verification only)

- [ ] **Step 1: Build once more and sanity-check the category picker**

Run: `bun run build && bun run caddy`
Open `http://localhost:3000/index.html`.
Expected:
- In the "by type" grouping (both languages), a new **Clock / Ura** group contains the three categories.
- Switch to Slovenian year grouping (`razredi`): `Clock_HourHalf` and `Clock_Quarter` appear under 2. razred; `Clock_FiveMin` appears under 3. razred.

- [ ] **Step 2: Play through each of the three categories**

For each of **Clock: hour and half hour**, **Clock: quarter hour**, **Clock: 5 minutes**:

- Select only that category, press Start.
- Answer 3–5 problems correctly; confirm:
  - Clock face renders cleanly (numerals, minute ticks, two hands).
  - Hour hand is visibly offset between numerals at non-`:00` times (e.g. at `3:30` it sits between 3 and 4; at `6:45` it sits between 6 and 7).
  - Strict matching: `1:05` is accepted, `1:5` is rejected, `01:05` is rejected.
- Intentionally submit 2 wrong answers on different problems; confirm the round-review summary shows both with their own clock SVGs.

- [ ] **Step 3: Regression check on a non-clock category**

Start a round of **Addition: 10**, answer a few right and a few wrong.
Expected:
- Problem area shows normal text like `3 + 4 = ?`.
- Review summary shows text-based review rows, unchanged from before.

- [ ] **Step 4: Final commit (if any cleanups needed)**

If the pass revealed any cosmetic tweaks (font size, stroke width, padding), apply them to `src/clock.ts` or the relevant `<style>` block and commit:

```bash
git add -u
git commit -m "clock: visual polish"
```

If nothing to fix, skip this commit.

---

## Summary of what this plan delivers

- Three new categories appear in the main category picker under a new "Clock" group (en) / "Ura" (sl), and under the appropriate Slovenian school years.
- Each category renders analog-clock problems as inline SVG; students type the time as strict `h:mm` (e.g. `3:05`).
- The round-review summary correctly distinguishes different clock problems and shows each one's clock face.
- Non-clock categories are unaffected.
- No test framework is introduced; verification is manual in-browser plus small `bun -e` sanity scripts, matching this project's conventions.
