import { Category, Problem } from "./common.ts";

const generateProps: Record<
	string,
	{
		max: number;
		min?: number;
		step?: number;
	}
> = {
	[Category.Mixed_ThreeNumbers_Ten]: { max: 10 },
	[Category.Mixed_ThreeNumbers_Twenty]: { max: 20 },
	[Category.Mixed_ThreeNumbers_Hundred]: { max: 100, min: 10 },
	[Category.Mixed_ThreeNumbers_Thousand]: { max: 1000, min: 100, step: 10 },
};

export function generate(category: Category): Problem[] {
	const props = generateProps[category]!;
	const { max } = props;
	const min = props.min ?? 0;
	const step = props.step ?? 1;

	const allProblems: Problem[] = [];

	// Pattern A: a + b - c = ?
	for (let a = min; a <= max; a += step) {
		for (let b = min; b <= max; b += step) {
			const sum = a + b;
			if (sum > max) continue;
			for (let c = min; c <= sum; c += step) {
				const result = sum - c;
				const id = `${category}_${a}_add_${b}_sub_${c}_result`;
				const text = `${a} + ${b} - ${c} = ?`;
				allProblems.push({ id, text, answer: result });
			}
		}
	}

	// Pattern B: a - b + c = ?
	for (let a = min; a <= max; a += step) {
		for (let b = min; b <= a; b += step) {
			const diff = a - b;
			for (let c = min; c <= max; c += step) {
				const result = diff + c;
				if (result > max) continue;
				const id = `${category}_${a}_sub_${b}_add_${c}_result`;
				const text = `${a} - ${b} + ${c} = ?`;
				allProblems.push({ id, text, answer: result });
			}
		}
	}

	return allProblems;
}
