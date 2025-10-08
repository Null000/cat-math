import { Category, Problem } from "./common.js";

const problemCache: Record<string, Problem[]> = {};

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    borrowAllowed?: boolean;
    borrowForced?: boolean;
  }
> = {
  [Category.Subtraction_Ten]: { xMax: 10, yMax: 10 },
  [Category.Subtraction_Twenty]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
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
};

function generate(
  category: Category,
  props: {
    xMax: number;
    yMax: number;
    borrowAllowed?: boolean;
    borrowForced?: boolean;
  },
): Problem[] {
  let { xMax, yMax, borrowAllowed, borrowForced } = props;
  borrowAllowed = borrowAllowed ?? true;
  borrowForced = borrowForced ?? false;

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
      allProblems.push({
        id: `${category}_${i}_${j}`,
        text: `${i} - ${j} = ?`,
        answer: i - j,
      });
    }
  }
  return allProblems;
}

export function generateSubtractionProblem(category: Category): Problem {
  if (!problemCache[category]) {
    problemCache[category] = generate(category, generateProps[category]!);
  }
  const problems = problemCache[category]!;
  return problems[Math.floor(Math.random() * problems.length)]!;
}

export function removeSolvedSubtractionProblem(
  category: Category,
  problemId: string,
): void {
  if (problemCache[category]) {
    problemCache[category] = problemCache[category]!.filter(
      (p) => p.id !== problemId,
    );
  }
}
