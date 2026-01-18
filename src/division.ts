import { Category, Problem } from "./common.js";

const generateProps: Record<
  string,
  {
    answerMax: number;
    divisorMax: number;
    missingField?: "dividend" | "divisor" | "answer";
  }
> = {
  [Category.Division_Ten]: { answerMax: 10, divisorMax: 10 },
  [Category.Division_Twenty]: { answerMax: 20, divisorMax: 20 },
  [Category.Division_Lia]: { answerMax: 10, divisorMax: 10 },
  [Category.Division_Lia_MissingFirst]: { answerMax: 10, divisorMax: 10, missingField: "dividend" },
  [Category.Division_Lia_MissingSecond]: { answerMax: 10, divisorMax: 10, missingField: "divisor" },
};

export function generate(category: Category): Problem[] {
  const props = generateProps[category]!;
  const { answerMax, divisorMax, missingField = "answer" } = props;

  const allProblems: Problem[] = [];

  for (let answer = 0; answer <= answerMax; answer++) {
    for (let divisor = 1; divisor <= divisorMax; divisor++) {
      if (divisor === 8 || divisor === 9) {
        continue;
      }

      const dividend = answer * divisor;

      let text: string;
      let problemAnswer: number;
      let id: string;

      switch (missingField) {
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

  return allProblems;
}
