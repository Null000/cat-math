import { Category, Problem } from "./common.ts";

const generateProps: Record<
  string,
  {
    max: number;
    min?: number;
  }
> = {
  [Category.Comparison_Ten]: { max: 10 },
  [Category.Comparison_Twenty]: { max: 20 },
  [Category.Comparison_Hundred]: { max: 100, min: 10 },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  const { max, min = 0 } = props;

  const allProblems: Problem[] = [];

  for (let x = min; x <= max; x++) {
    for (let y = min; y <= max; y++) {
      const answer = x < y ? -1 : x === y ? 0 : 1;
      allProblems.push({
        id: `${category}_${x}_${y}`,
        text: `${x} ? ${y}`,
        answer,
      });
    }
  }

  return allProblems;
}
