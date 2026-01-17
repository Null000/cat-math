import { categoryGroups } from "./common.js";
import { getRandomProblem, removeSolvedProblem } from "./problem.js";
export function getProblem(categories) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    return { problem: generateProblem(category), category };
}
function generateProblem(category) {
    return getRandomProblem(category);
}
export function solvedProblem(category, problemId) {
    removeSolvedProblem(category, problemId);
}
export function getCategories() {
    return categoryGroups;
}
//# sourceMappingURL=app.js.map