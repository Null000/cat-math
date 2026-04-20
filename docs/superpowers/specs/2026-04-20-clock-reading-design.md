# Clock Reading Category — Design

## Goal

Add a new problem type to the main practice app where the student reads the time
from an analog clock face and types the answer. Three difficulty categories,
introduced as a cumulative progression.

## Categories

| Enum key         | Display (en)                   | Display (sl)                 | Minutes included     | Count |
| ---------------- | ------------------------------ | ---------------------------- | -------------------- | ----- |
| `Clock_HourHalf` | `Clock: hour and half hour`    | `Ura: polne in pol ure`      | `00`, `30`           | 24    |
| `Clock_Quarter`  | `Clock: quarter hour`          | `Ura: četrt ure`             | `00`, `15`, `30`, `45` | 48    |
| `Clock_FiveMin`  | `Clock: 5 minutes`             | `Ura: 5 minut`               | `00`, `05`, …, `55`  | 144   |

- 12-hour face (`1:00`–`12:55`), no AM/PM.
- Problems are the cartesian product of hours `1..12` × minutes list.

### Grouping

- New `categoryGroups` entry `Clock: [Clock_HourHalf, Clock_Quarter, Clock_FiveMin]`.
- `yearGroupsSl`:
  - `2. razred` gains `Clock_HourHalf` and `Clock_Quarter`.
  - `3. razred` gains `Clock_FiveMin`.
- New group label translation: `Clock` → `"Clock"` / `"Ura"`.

## Answer format

- Strict string match. The correct answer for 3:05 is exactly `"3:05"`.
- Hour: no leading zero (`1`–`12`).
- Minute: always two digits (`00`–`55`).
- Comparison uses the existing string path (`typeof answer === "string"` →
  `trim().toLowerCase()` on user input). Colon is preserved; strict match.
- No input helpers, no auto-formatting, no tolerance for `3.05` / `3 05` / `3:5`.

## Problem interface change

Extend `Problem` in `src/common.ts` with an optional `svg` field:

```ts
interface Problem {
    id: string;
    text: string;                       // used for i18n label and review row
    svg?: string;                       // NEW: inline SVG markup for visual problems
    answer: number | string;
    options?: { label: string; value: number }[];
}
```

- When `svg` is set, `practice.ts` renders it via `innerHTML` into the problem
  element instead of `textContent`.
- `text` for clock problems is a short non-revealing label (`"🕒"`). It must
  never contain the answer, since the problem element is visible during retry
  after a wrong answer.
- `text` remains present so the existing i18n pipeline and review rendering
  have something non-empty to key on.

## Clock SVG module (`src/clock.ts`)

Pure function, no DOM:

```ts
export function renderClockSVG(hour: number, minute: number): string;
```

Specification:

- `viewBox="0 0 200 200"`, square.
- Outer circle, center `(100, 100)`, radius ~90, black stroke, white fill.
- 60 minute tick marks around the rim; every 5th (hour marks) is thicker/longer.
- Hour numerals `1`–`12` positioned just inside the rim.
- Hour hand: short, thick. Angle (degrees, 0 = up, clockwise):
  `(hour % 12) * 30 + minute * 0.5`. At `3:30` this puts it halfway between 3 and 4.
- Minute hand: long, thin. Angle: `minute * 6`.
- Small filled center dot covering both hand origins.
- Colors and stroke widths chosen to read clearly on the existing white problem
  container; verified visually in the browser.

## Problem generator (`src/clockReading.ts`)

New module, wired into `problem.ts` under a new `Clock` group:

```ts
const minutesPerCategory = {
    [Category.Clock_HourHalf]: [0, 30],
    [Category.Clock_Quarter]: [0, 15, 30, 45],
    [Category.Clock_FiveMin]: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
};

export function count(category: Category): number;
export function getProblem(category: Category, n: number): Problem;
```

- `count` = `12 * minutes.length`.
- `getProblem(cat, n)`:
  - `hourIdx = Math.floor(n / minutes.length)`; `hour = hourIdx + 1` (range 1..12).
  - `minute = minutes[n % minutes.length]`.
  - `id`: `` `Clock_${cat}_${hour}_${minute}` ``, e.g. `Clock_FiveMin_3_45`.
  - `text`: `"🕒"`.
  - `svg`: `renderClockSVG(hour, minute)`.
  - `answer`: `` `${hour}:${String(minute).padStart(2, "0")}` ``.

Register under `generatorPerGroup["Clock"]` in `problem.ts`.

## Practice UI changes (`src/practice.ts`)

1. **Rendering the problem** (inside `newProblem()`):
   - If `currentProblem.svg` is set:
     `problemElement.innerHTML = currentProblem.svg`.
   - Otherwise keep current behavior:
     `problemElement.textContent = localizeProblemText(currentProblem.text)`.

2. **Input path**: no change. Strings already route to the text input with
   `inputMode = "text"` and are compared with `trim().toLowerCase()`.

3. **Round-review summary refactor**:
   - The existing `stats.roundIncorrectProblems` is keyed by `problem.text`.
     For clock problems, every instance would collapse into a single `🕒` bucket,
     losing per-problem review context.
   - Re-key the map by `problem.id`. The stored value gains the original `text`
     and optional `svg`:
     ```ts
     Map<string, {
       text: string;
       svg?: string;
       correctAnswer: string;
       givenAnswers: string[];
     }>
     ```
   - Review row renders the `svg` (when present) next to the correct/your-answers
     lines; otherwise falls back to `localizeProblemText(text)` exactly as today.
   - A small CSS adjustment sizes the review clock SVG down (e.g. ~80px) so rows
     remain compact.

## Translations

Add to `src/translations.ts` for both `en` and `sl`:

- Display names for `Clock_HourHalf`, `Clock_Quarter`, `Clock_FiveMin`.
- Group label `Clock` (if group labels are localized — match the existing
  pattern used for other groups).

No other UI strings change. The existing "Your answer" placeholder covers the
string input case.

## Out of scope

- No audio / "speak the time" features.
- No input helpers (colon autofill, hour/minute steppers, snap-to-nearest).
- No AM/PM or 24-hour variants.
- No RPG integration — clock reading is main-practice-only.
- No accessibility fallback for the SVG beyond the default (an `aria-label`
  containing the answer would leak the solution).
- No new reward imagery or statistics surfaces.

## Testing

Manual, in-browser, consistent with the rest of the project:

- Select each of the three clock categories individually; verify problem count
  and hand positions for a handful of spot checks (e.g. `12:00`, `6:30`, `3:15`,
  `9:45`, `11:55`).
- Verify the hour hand is between two numerals at non-`:00` times.
- Verify strict answer matching rejects `3:5`, `03:05`, `3.05`.
- Verify the round-review summary shows the clock SVG next to each unique
  incorrect problem, and that two different clock mistakes render as two rows.
- Confirm existing non-clock categories are unaffected by the
  `roundIncorrectProblems` refactor.
