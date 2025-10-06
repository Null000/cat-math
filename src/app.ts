import * as addition from "./addition.js";
import { Category, Problem } from "./common.js";

export function getProblem(categories: Category[]): Problem {
  const category = categories[Math.floor(Math.random() * categories.length)];
  return generateProblem(category!);
}

function generateProblem(category: Category): Problem {
  switch (category) {
    case Category.Addition_Ten:
      return addition.generateAdditionTenProblem();
    default:
      throw new Error(`Unknown category: ${category}`);
  }
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
