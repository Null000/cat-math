import { Category, Problem } from "./common.ts";

const generateProps: Record<
	string,
	{
		max: number;
		min?: number;
	}
> = {
	[Category.NextPrevious_Ten]: { max: 10, min: 0 },
	[Category.NextPrevious_Twenty]: { max: 20, min: 0 },
};

export function count(category: Category): number {
	const props = generateProps[category]!;
	const min = props.min ?? 0;
	return 2 * (props.max - min);
}

export function getProblem(category: Category, n: number): Problem {
	const props = generateProps[category]!;
	const min = props.min ?? 0;
	const range = props.max - min;

	if (n < range) {
		const i = min + 1 + n;
		return {
			id: `${category}_${i}_prev`,
			text: `?, ${i}`,
			answer: i - 1,
		};
	} else {
		const i = min + (n - range);
		return {
			id: `${category}_${i}_next`,
			text: `${i}, ?`,
			answer: i + 1,
		};
	}
}
