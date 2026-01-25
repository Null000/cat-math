import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    answerMax: number;
    divisorMax: number;
    missingField?: ("dividend" | "divisor" | "answer") | ("dividend" | "divisor" | "answer")[];
  }
> = {
  [Category.Division_Ten]: { answerMax: 10, divisorMax: 10 },
  [Category.Division_Ten_Missing]: { answerMax: 10, divisorMax: 10, missingField: ["dividend", "divisor"] },
  [Category.Division_Twenty]: { answerMax: 20, divisorMax: 20 },
  [Category.Division_Twenty_Missing]: { answerMax: 20, divisorMax: 20, missingField: ["dividend", "divisor"] },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  const { answerMax, divisorMax, missingField = "answer" } = props;

  const allProblems: Problem[] = [];
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];

  for (let answer = 0; answer <= answerMax; answer++) {
    for (let divisor = 1; divisor <= divisorMax; divisor++) {

      const dividend = answer * divisor;

      for (const field of missingFields) {
        let text: string;
        let problemAnswer: number;
        let id: string;

        switch (field) {
          case "dividend":
            text = `? / ${divisor} = ${answer}`;
            problemAnswer = dividend;
            id = `${category}_${dividend}_${divisor}_dividend`;
            break;
          case "divisor":
            text = `${dividend} / ? = ${answer}`;
            problemAnswer = divisor;
            id = `${category}_${dividend}_${divisor}_divisor`;
            break;
          case "answer":
          default:
            text = `${dividend} / ${divisor} = ?`;
            problemAnswer = answer;
            id = `${category}_${dividend}_${divisor}_answer`;
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
