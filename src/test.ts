import { Category, Problem } from "./common.ts";

const problems: Problem[] = [
	{ id: "test-1", text: "1", answer: 1 },
	{ id: "test-2", text: "2", answer: 2 },
	{ id: "test-3", text: "3", answer: 3 },
	{ id: "test-67", text: "67", answer: 67 },
];

export function count(_category: Category): number {
	return problems.length;
}

export function getProblem(_category: Category, n: number): Problem {
	return problems[n % problems.length]!;
}
