import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
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
  [Category.Addition_TwentyWithoutCarry_MissingFirst]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: false,
    missingFact: "first",
  },
  [Category.Addition_TwentyWithoutCarry_MissingSecond]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: false,
    missingFact: "second",
  },
  [Category.Addition_TwentyWithCarry]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_TwentyWithCarry_MissingFirst]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: true,
    missingFact: "first",
  },
  [Category.Addition_TwentyWithCarry_MissingSecond]: {
    xMax: 20,
    yMax: 20,
    carryAllowed: true,
    carryForced: true,
    missingFact: "second",
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
    carryAllowed: false,
  },
  [Category.Addition_HundredWithoutCarry_MissingFirst]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: false,
    missingFact: "first",
  },
  [Category.Addition_HundredWithoutCarry_MissingSecond]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: false,
    missingFact: "second",
  },
  [Category.Addition_HundredWithCarry]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_HundredWithCarry_MissingFirst]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: true,
    missingFact: "first",
  },
  [Category.Addition_HundredWithCarry_MissingSecond]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: true,
    missingFact: "second",
  },
  [Category.Addition_HundredMixed]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: false,
  },
  [Category.Addition_HundredMixed_MissingFirst]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: false,
    missingFact: "first",
  },
  [Category.Addition_HundredMixed_MissingSecond]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: false,
    missingFact: "second",
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let { xMax, yMax, carryAllowed, carryForced, missingFact } = props;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;
  missingFact = missingFact ?? "result";

  const allProblems: Problem[] = [];
  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j <= yMax; j++) {
      const hasCarry = carryAllowed && i + j >= 10;
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
