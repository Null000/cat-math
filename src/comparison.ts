import { Category, Problem } from "./common.ts";

const generateProps: Record<
	string,
	{
		max: number;
		min?: number;
		step?: number;
	}
> = {
	[Category.Comparison_Ten]: { max: 10 },
	[Category.Comparison_Twenty]: { max: 20 },
	[Category.Comparison_Hundred]: { max: 100, min: 10 },
	[Category.Comparison_Thousand]: { max: 1000, min: 100, step: 10 },
};

const comparisonOptions: Problem["options"] = [
	{ label: "<", value: -1 },
	{ label: "=", value: 0 },
	{ label: ">", value: 1 },
];

function rangeSize(category: Category): number {
	const props = generateProps[category]!;
	const { max, min = 0, step = 1 } = props;
	return Math.floor((max - min) / step) + 1;
}

export function count(category: Category): number {
	const size = rangeSize(category);
	return size * size;
}

export function getProblem(category: Category, n: number): Problem {
	const props = generateProps[category]!;
	const { min = 0, step = 1 } = props;
	const size = rangeSize(category);

	const xIdx = Math.floor(n / size);
	const yIdx = n % size;
	const x = min + xIdx * step;
	const y = min + yIdx * step;

	const answer = x < y ? -1 : x === y ? 0 : 1;
	return {
		id: `${category}_${x}_${y}`,
		text: `${x} ? ${y}`,
		answer,
		options: comparisonOptions,
	};
}
