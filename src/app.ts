import * as addition from "./addition.js";
import * as subtraction from "./subtraction.js";
import { Category, Problem } from "./common.js";

export function getProblem(categories: Category[]): {
  problem: Problem;
  category: Category;
} {
  const category = categories[Math.floor(Math.random() * categories.length)]!;
  return { problem: generateProblem(category), category };
}

function generateProblem(category: Category): Problem {
  switch (category) {
    case Category.Addition_Ten:
    case Category.Addition_TwentyWithoutCarry:
    case Category.Addition_TwentyWithCarry:
    case Category.Addition_TwentyMixed:
    case Category.Addition_HundredWithoutCarry:
    case Category.Addition_HundredWithCarry:
    case Category.Addition_HundredMixed:
      return addition.generateAdditionProblem(category);
    case Category.Subtraction_Ten:
    case Category.Subtraction_Twenty:
    case Category.Subtraction_HundredWithoutBorrow:
    case Category.Subtraction_HundredWithBorrow:
      return subtraction.generateSubtractionProblem(category);
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

export function removeSolvedProblem(
  category: Category,
  problemId: string,
): void {
  if (category.startsWith("Addition")) {
    addition.removeSolvedAdditionProblem(category, problemId);
  } else if (category.startsWith("Subtraction")) {
    subtraction.removeSolvedSubtractionProblem(category, problemId);
  }
  // Add other categories as they are implemented
}

export function getCategories(): Record<string, string[]> {
  return {
    Addition: [
      Category.Addition_Ten,
      Category.Addition_TwentyWithoutCarry,
      Category.Addition_TwentyWithCarry,
      Category.Addition_HundredWithoutCarry,
      Category.Addition_HundredWithCarry,
    ],
    Subtraction: [
      Category.Subtraction_Ten,
      Category.Subtraction_Twenty,
      Category.Subtraction_HundredWithoutBorrow,
      Category.Subtraction_HundredWithBorrow,
    ],
    Multiplication: [
      Category.Multiplication_Ten,
      Category.Multiplication_Twenty,
      Category.Multiplication_Hundred,
    ],
    Division: [
      Category.Division_Ten,
      Category.Division_Twenty,
      Category.Division_Hundred,
    ],
  };
}
