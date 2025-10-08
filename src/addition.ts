import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    carryAllowed?: boolean;
    carryForced?: boolean;
  }
> = {
  [Category.Addition_Ten]: { xMax: 10, yMax: 10 },
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
  [Category.Addition_HundredWithoutCarry]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: false,
  },
  [Category.Addition_HundredWithCarry]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: true,
  },
  [Category.Addition_HundredMixed]: {
    xMax: 100,
    yMax: 100,
    carryAllowed: true,
    carryForced: false,
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let { xMax, yMax, carryAllowed, carryForced } = props;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;

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
      allProblems.push({
        id: `${category}_${i}_${j}`,
        text: `${i} + ${j} = ?`,
        answer: i + j,
      });
    }
  }
  return allProblems;
}
