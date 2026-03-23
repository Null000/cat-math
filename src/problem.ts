import { Category, Problem } from "./common.ts";
import * as addition from "./addition.ts";
import * as subtraction from "./subtraction.ts";
import * as division from "./division.ts";
import * as multiplication from "./multiplication.ts";
import * as test from "./test.ts";
import * as comparison from "./comparison.ts";
import * as numberText from "./numberText.ts";
import * as nextPrevious from "./nextPrevious.ts";
import * as mixed from "./mixed.ts";
import { categoryToGroup } from "./common.ts";

interface Generator {
	count: (category: Category) => number;
	getProblem: (category: Category, n: number) => Problem;
}

const generatorPerGroup: Record<string, Generator> = {
	Addition: addition,
	Subtraction: subtraction,
	Multiplication: multiplication,
	Division: division,
	Mixed: mixed,
	Comparison: comparison,
	NumberText: numberText,
	NextPrevious: nextPrevious,
	Test: test,
};

function getGenerator(category: Category): Generator {
	return generatorPerGroup[categoryToGroup[category]]!;
}

export function getRandomProblem(category: Category) {
	const gen = getGenerator(category);
	const total = gen.count(category);
	const n = Math.floor(Math.random() * total);
	return gen.getProblem(category, n);
}
