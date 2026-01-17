import { Category, Problem } from "./common.js";
export declare function getProblem(categories: Category[]): {
    problem: Problem;
    category: Category;
};
export declare function solvedProblem(category: Category, problemId: string): void;
export declare function getCategories(): Record<string, string[]>;
//# sourceMappingURL=app.d.ts.map