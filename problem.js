import * as addition from "./addition.js";
import * as subtraction from "./subtraction.js";
import * as division from "./division.js";
import * as multiplication from "./multiplication.js";
import { categoryToGroup } from "./common.js";
const generateFnPerGroup = {
    Addition: (category) => addition.generate(category),
    Subtraction: (category) => subtraction.generate(category),
    Multiplication: (category) => multiplication.generate(category),
    Division: (category) => division.generate(category),
};
const cache = {};
/**
 * Initialize or get cached problems for a category
 */
function getCachedProblems(category) {
    if (!cache[category]) {
        cache[category] = generateFnPerGroup[categoryToGroup[category]](category);
    }
    return cache[category];
}
/**
 * Get a random problem from the cached problems for a category
 */
export function getRandomProblem(category) {
    const problems = getCachedProblems(category);
    return problems[Math.floor(Math.random() * problems.length)];
}
/**
 * Remove a solved problem from the cache
 */
export function removeSolvedProblem(category, problemId) {
    const problems = getCachedProblems(category);
    if (problems) {
        cache[category] = problems.filter((p) => p.id !== problemId);
    }
}
//# sourceMappingURL=problem.js.map