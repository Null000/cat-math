import { Category, Problem } from "./common.js";
export type ProblemCache = Record<string, Problem[]>;
/**
 * Get a random problem from the cached problems for a category
 */
export declare function getRandomProblem(category: Category): Problem;
/**
 * Remove a solved problem from the cache
 */
export declare function removeSolvedProblem(category: Category, problemId: string): void;
//# sourceMappingURL=problem.d.ts.map