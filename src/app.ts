import { Category, Problem, categoryGroups, yearGroupsSl } from "./common.ts";
import { getRandomProblem } from "./problem.ts";

export function getProblem(categories: Category[]): {
	problem: Problem;
	category: Category;
} {
	const category = categories[Math.floor(Math.random() * categories.length)]!;
	return { problem: getRandomProblem(category), category };
}

export function getCategories(): Record<string, string[]> {
	return categoryGroups;
}

export function getYearGroupsSl(): Record<string, string[]> {
	return yearGroupsSl;
}
