import { Category, Problem, makeGenerator } from "./common.ts";

const generateProps: Record<
	string,
	{
		xMax: number;
		yMax: number;
		missingField?:
			| ("first" | "second" | "answer")
			| ("first" | "second" | "answer")[];
	}
> = {
	[Category.Multiplication_Ten]: { xMax: 10, yMax: 10 },
	[Category.Multiplication_Ten_Missing]: {
		xMax: 10,
		yMax: 10,
		missingField: ["first", "second"],
	},
	[Category.Multiplication_Twenty]: { xMax: 20, yMax: 20 },
	[Category.Multiplication_Twenty_Missing]: {
		xMax: 20,
		yMax: 20,
		missingField: ["first", "second"],
	},
	[Category.Multiplication_Hundred]: { xMax: 100, yMax: 9 },
	[Category.Multiplication_Hundred_Missing]: {
		xMax: 100,
		yMax: 9,
		missingField: ["first", "second"],
	},
};

function makeProblem(category: Category, i: number, j: number, field: "first" | "second" | "answer"): Problem {
	switch (field) {
		case "first":
			return {
				id: `${category}_${i}_${j}_first`,
				text: `? × ${j} = ${i * j}`,
				answer: i,
			};
		case "second":
			return {
				id: `${category}_${i}_${j}_second`,
				text: `${i} × ? = ${i * j}`,
				answer: j,
			};
		case "answer":
			return {
				id: `${category}_${i}_${j}_answer`,
				text: `${i} × ${j} = ?`,
				answer: i * j,
			};
	}
}

function enumerate(category: Category, targetIndex: number): { problem?: Problem; count: number } {
	const props = generateProps[category]!;
	const { xMax, yMax, missingField = "answer" } = props;
	const missingFields = Array.isArray(missingField) ? missingField : [missingField];

	let idx = 0;
	for (let i = 0; i <= xMax; i++) {
		for (let j = 0; j <= yMax; j++) {
			for (const field of missingFields) {
				if (field === "first" && j === 0) continue;
				if (field === "second" && i === 0) continue;

				if (idx === targetIndex) {
					return { problem: makeProblem(category, i, j, field), count: idx };
				}
				idx++;
			}
		}
	}
	return { count: idx };
}

export const { count, getProblem } = makeGenerator(enumerate);
