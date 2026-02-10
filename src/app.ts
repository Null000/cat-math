import { Category, Problem, categoryGroups, yearGroupsSl } from "./common.ts";
import { getRandomProblem, removeSolvedProblem } from "./problem.ts";

export function getProblem(categories: Category[]): {
  problem: Problem;
  category: Category;
} {
  const category = categories[Math.floor(Math.random() * categories.length)]!;
  return { problem: generateProblem(category), category };
}

function generateProblem(category: Category): Problem {
  return getRandomProblem(category);
}

export function solvedProblem(category: Category, problemId: string): boolean {
  return removeSolvedProblem(category, problemId);
}

export function getCategories(): Record<string, string[]> {
  return categoryGroups;
}

export function getYearGroupsSl(): Record<string, string[]> {
  return yearGroupsSl;
}
