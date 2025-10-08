import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
  }
> = {
  [Category.Multiplication_Ten]: { xMax: 10, yMax: 10 },
  [Category.Multiplication_Twenty]: { xMax: 20, yMax: 20 },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  const { xMax, yMax } = props;

  const allProblems: Problem[] = [];
  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j <= yMax; j++) {
      allProblems.push({
        id: `${category}_${i}_${j}`,
        text: `${i} × ${j} = ?`,
        answer: i * j,
      });
    }
  }
  return allProblems;
}
