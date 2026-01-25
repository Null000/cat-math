import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    xMax: number;
    yMax: number;
    missingField?: ("first" | "second" | "answer") | ("first" | "second" | "answer")[];
  }
> = {
  [Category.Multiplication_Ten]: { xMax: 10, yMax: 10 },
  [Category.Multiplication_Ten_Missing]: { xMax: 10, yMax: 10, missingField: ["first", "second"] },
  [Category.Multiplication_Twenty]: { xMax: 20, yMax: 20 },
  [Category.Multiplication_Twenty_Missing]: { xMax: 20, yMax: 20, missingField: ["first", "second"] },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  const { xMax, yMax, missingField = "answer" } = props;

  const allProblems: Problem[] = [];
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];

  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j <= yMax; j++) {

      for (const field of missingFields) {
        let text: string;
        let problemAnswer: number;
        let id: string;

        switch (field) {
          case "first":
            if (j === 0) continue;
            text = `? × ${j} = ${i * j}`;
            problemAnswer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            if (i === 0) continue;
            text = `${i} × ? = ${i * j}`;
            problemAnswer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "answer":
          default:
            text = `${i} × ${j} = ?`;
            problemAnswer = i * j;
            id = `${category}_${i}_${j}_answer`;
            break;
        }

        allProblems.push({
          id,
          text,
          answer: problemAnswer,
        });
      }
    }
  }
  return allProblems;
}
