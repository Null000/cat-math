import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    borrowAllowed?: boolean;
    borrowForced?: boolean;
    missingFact?: "first" | "second" | "result";
  }
> = {
  [Category.Subtraction_Ten]: { xMax: 10, yMax: 10 },
  [Category.Subtraction_Ten_MissingFirst]: {
    xMax: 10,
    yMax: 10,
    missingFact: "first",
  },
  [Category.Subtraction_Ten_MissingSecond]: {
    xMax: 10,
    yMax: 10,
    missingFact: "second",
  },
  [Category.Subtraction_Twenty]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
  },
  [Category.Subtraction_Twenty_MissingFirst]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: "first",
  },
  [Category.Subtraction_Twenty_MissingSecond]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: "second",
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
  [Category.Subtraction_HundredWithBorrow_MissingFirst]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: true,
    missingFact: "first",
  },
  [Category.Subtraction_HundredWithBorrow_MissingSecond]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: true,
    missingFact: "second",
  },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  let { xMax, yMax, borrowAllowed, borrowForced, missingFact } = props;
  borrowAllowed = borrowAllowed ?? true;
  borrowForced = borrowForced ?? false;
  missingFact = missingFact ?? "result";

  const allProblems: Problem[] = [];
  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j <= yMax; j++) {
      if (i < j) continue; // Can't subtract to get negative
      const hasBorrow = borrowAllowed && i % 10 < j % 10;
      if (hasBorrow && !borrowForced) {
        continue;
      }
      if (!hasBorrow && borrowForced) {
        continue;
      }

      let text: string;
      let answer: number;
      let id: string;

      switch (missingFact) {
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
  return allProblems;
}
