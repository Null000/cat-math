import { Category, Problem } from "./common.ts";
import * as addition from "./addition.ts";
import * as subtraction from "./subtraction.ts";
import * as division from "./division.ts";
import * as multiplication from "./multiplication.ts";
import * as test from "./test.ts";
import { categoryToGroup } from "./common.ts";

export type ProblemCache = Record<string, Problem[]>;

const generateFnPerGroup: Record<string, (category: Category) => Problem[]> = {
  Addition: (category) => addition.generate(category),
  Subtraction: (category) => subtraction.generate(category),
  Multiplication: (category) => multiplication.generate(category),
  Division: (category) => division.generate(category),
  Test: (category) => test.generate(category),
};

const cache: ProblemCache = {};

/**
 * Initialize or get cached problems for a category
 */
function getCachedProblems(category: Category): Problem[] {
  if (!cache[category]) {
    populateCache(category);
  }
  return cache[category]!;
}

function populateCache(category: Category): void {
  cache[category] = generateFnPerGroup[categoryToGroup[category]]!(category);
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
 * Returns true this was the last problem
 */
export function removeSolvedProblem(
  category: Category,
  problemId: string,
): boolean {
  const problems = getCachedProblems(category);
  if (problems) {
    cache[category] = problems.filter((p) => p.id !== problemId);
  }
  if (cache[category]?.length === 0) {
    populateCache(category);
    return true;
  }
  return false;
}
