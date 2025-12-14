import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    xMin?: number;
    yMin?: number;
    carryAllowed?: boolean;
    carryForced?: boolean;
    missingFact?: "first" | "second" | "result";
  }
> = {
  [Category.Addition_Ten]: { xMax: 10, yMax: 10 },
  [Category.Addition_Ten_MissingFirst]: {
    xMax: 10,
    yMax: 10,
    missingFact: "first",
  },
  [Category.Addition_Ten_MissingSecond]: {
    xMax: 10,
    yMax: 10,
    missingFact: "second",
  },
  [Category.Addition_TwentyWithoutCarry]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: false,
  },
  [Category.Addition_TwentyWithCarry]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_TwentyMixed]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: false,
  },
  [Category.Addition_TwentyMixed_MissingFirst]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: false,
    missingFact: "first",
  },
  [Category.Addition_TwentyMixed_MissingSecond]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: false,
    missingFact: "second",
  },
  [Category.Addition_HundredWithoutCarry]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    carryAllowed: false,
  },
  [Category.Addition_HundredWithCarry]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_HundredMixed]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    carryAllowed: true,
    carryForced: false,
  },
  [Category.Addition_HundredMixed_MissingFirst]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    carryAllowed: true,
    carryForced: false,
    missingFact: "first",
  },
  [Category.Addition_HundredMixed_MissingSecond]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    carryAllowed: true,
    carryForced: false,
    missingFact: "second",
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let { xMax, yMax, xMin, yMin, carryAllowed, carryForced, missingFact } =
    props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;
  missingFact = missingFact ?? "result";

  const allProblems: Problem[] = [];
  for (let i = xMin; i <= xMax; i++) {
    for (let j = yMin; j <= yMax; j++) {
      const hasCarry = carryAllowed && (i % 10) + (j % 10) >= 10;
      if (hasCarry && !carryForced) {
        continue;
      }
      if (!hasCarry && carryForced) {
        continue;
      }

      let text: string;
      let answer: number;
      let id: string;

      switch (missingFact) {
        case "first":
          text = `? + ${j} = ${i + j}`;
          answer = i;
          id = `${category}_${i}_${j}_first`;
          break;
        case "second":
          text = `${i} + ? = ${i + j}`;
          answer = j;
          id = `${category}_${i}_${j}_second`;
          break;
        case "result":
        default:
          text = `${i} + ${j} = ?`;
          answer = i + j;
          id = `${category}_${i}_${j}_result`;
          break;
      }

      allProblems.push({
        id,
        text,
        answer,
      });
    }
  }
  return allProblems;
}
