import { Category, Problem } from "./common.js";
import * as addition from "./addition.js";
import * as subtraction from "./subtraction.js";
import { categoryToGroup } from "./common.js";

export type ProblemCache = Record<string, Problem[]>;

const generateFnPerGroup: Record<string, (category: Category) => Problem[]> = {
  Addition: (category) => addition.generate(category),
  Subtraction: (category) => subtraction.generate(category),
  //   Multiplication: () => multiplication.generateMultiplicationProblem(),
  //   Division: () => division.generateDivisionProblem(),
};

const cache: ProblemCache = {};

/**
 * Initialize or get cached problems for a category
 */
function getCachedProblems(category: Category): Problem[] {
  if (!cache[category]) {
    cache[category] = generateFnPerGroup[categoryToGroup[category]]!(category);
  }
  return cache[category]!;
}

/**
 * Get a random problem from the cached problems for a category
 */
export function getRandomProblem(category: Category): Problem {
  const problems = getCachedProblems(category);
  return problems[Math.floor(Math.random() * problems.length)]!;
}

/**
 * Remove a solved problem from the cache
 */
export function removeSolvedProblem(
  category: Category,
  problemId: string,
): void {
  if (cache[category]) {
    cache[category] = cache[category]!.filter((p) => p.id !== problemId);
  }
}
