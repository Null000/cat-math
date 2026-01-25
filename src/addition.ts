import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    xMin?: number;
    yMin?: number;
    maxResult?: number;
    carryAllowed?: boolean;
    carryForced?: boolean;
    missingFact?: ("first" | "second" | "result") | ("first" | "second" | "result")[];
  }
> = {
  [Category.Addition_Ten]: { xMax: 10, yMax: 10 },
  [Category.Addition_Ten_Missing]: {
    xMax: 10,
    yMax: 10,
    missingFact: ["first", "second"],
  },
  [Category.Addition_TwentyWithoutCarry]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: false,
  },
  [Category.Addition_TwentyWithCarry]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_TwentyMixed]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: false,
  },
  [Category.Addition_TwentyMixed_Missing]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: false,
    missingFact: ["first", "second"],
  },
  [Category.Addition_HundredWithoutCarry]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: false,
  },
  [Category.Addition_HundredWithCarry]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_HundredMixed]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: false,
  },
  [Category.Addition_HundredMixed_Missing]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: false,
    missingFact: ["first", "second"],
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let {
    xMax,
    yMax,
    xMin,
    yMin,
    maxResult,
    carryAllowed,
    carryForced,
    missingFact,
  } = props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;
  missingFact = missingFact ?? "result";

  const allProblems: Problem[] = [];
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];

  for (let i = xMin; i <= xMax; i++) {
    for (let j = yMin; j <= yMax; j++) {
      const hasCarry = carryAllowed && (i % 10) + (j % 10) >= 10;
      if (hasCarry && !carryForced) {
        continue;
      }
      if (!hasCarry && carryForced) {
        continue;
      }

      const result = i + j;
      if (maxResult && result > maxResult) {
        continue;
      }

      for (const fact of missingFacts) {
        let text: string;
        let answer: number;
        let id: string;

        switch (fact) {
          case "first":
            text = `? + ${j} = ${result}`;
            answer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            text = `${i} + ? = ${result}`;
            answer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "result":
          default:
            text = `${i} + ${j} = ?`;
            answer = result;
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
  }
  return allProblems;
}
