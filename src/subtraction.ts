import { Category, Problem } from "./common.ts";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    xMin?: number;
    yMin?: number;
    step?: number;
    borrowAllowed?: boolean;
    borrowForced?: boolean;
    missingFact?: ("first" | "second" | "result") | ("first" | "second" | "result")[];
  }
> = {
  [Category.Subtraction_Ten]: { xMax: 10, yMax: 10 },
  [Category.Subtraction_Ten_Missing]: {
    xMax: 10,
    yMax: 10,
    missingFact: ["first", "second"],
  },
  [Category.Subtraction_Twenty]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
  },
  [Category.Subtraction_Twenty_Missing]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: ["first", "second"],
  },
  [Category.Subtraction_HundredWithoutBorrow]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: false,
  },
  [Category.Subtraction_HundredWithBorrow]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: true,
  },
  [Category.Subtraction_Hundred]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: false,
  },
  [Category.Subtraction_Hundred_Missing]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: ["first", "second"],
  },
  [Category.Subtraction_Tens]: {
    xMax: 100,
    yMax: 90,
    xMin: 10,
    yMin: 10,
    step: 10,
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let { xMax, yMax, xMin, yMin, step, borrowAllowed, borrowForced, missingFact } = props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  step = step ?? 1;
  borrowAllowed = borrowAllowed ?? true;
  borrowForced = borrowForced ?? false;
  missingFact = missingFact ?? "result";

  const allProblems: Problem[] = [];
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];

  for (let i = xMin; i <= xMax; i += step) {
    for (let j = yMin; j <= yMax; j += step) {
      if (i < j) continue; // Can't subtract to get negative
      const hasBorrow = borrowAllowed && i % 10 < j % 10;
      if (hasBorrow && !borrowForced) {
        continue;
      }
      if (!hasBorrow && borrowForced) {
        continue;
      }

      for (const fact of missingFacts) {
        let text: string;
        let answer: number;
        let id: string;

        switch (fact) {
          case "first":
            text = `? - ${j} = ${i - j}`;
            answer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            text = `${i} - ? = ${i - j}`;
            answer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "result":
          default:
            text = `${i} - ${j} = ?`;
            answer = i - j;
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
