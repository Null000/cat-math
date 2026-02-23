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

export function generate(category: Category): Problem[] {
	const props = generateProps[category]!;
	const { max, min = 0, step = 1 } = props;

	const allProblems: Problem[] = [];

	for (let x = min; x <= max; x += step) {
		for (let y = min; y <= max; y += step) {
			const answer = x < y ? -1 : x === y ? 0 : 1;
			allProblems.push({
				id: `${category}_${x}_${y}`,
				text: `${x} ? ${y}`,
				answer,
				options: comparisonOptions,
			});
		}
	}

	return allProblems;
}
