import { Category, Problem, makeGenerator } from "./common.ts";

const generateProps: Record<
	string,
	{
		answerMax: number;
		divisorMax: number;
		missingField?:
			| ("dividend" | "divisor" | "answer")
			| ("dividend" | "divisor" | "answer")[];
	}
> = {
	[Category.Division_Ten]: { answerMax: 10, divisorMax: 10 },
	[Category.Division_Ten_Missing]: {
		answerMax: 10,
		divisorMax: 10,
		missingField: ["dividend", "divisor"],
	},
	[Category.Division_Twenty]: { answerMax: 20, divisorMax: 20 },
	[Category.Division_Twenty_Missing]: {
		answerMax: 20,
		divisorMax: 20,
		missingField: ["dividend", "divisor"],
	},
	[Category.Division_Hundred]: { answerMax: 100, divisorMax: 9 },
	[Category.Division_Hundred_Missing]: {
		answerMax: 100,
		divisorMax: 9,
		missingField: ["dividend", "divisor"],
	},
};

function makeProblem(category: Category, dividend: number, divisor: number, answer: number, field: "dividend" | "divisor" | "answer"): Problem {
	switch (field) {
		case "dividend":
			return {
				id: `${category}_${dividend}_${divisor}_dividend`,
				text: `? / ${divisor} = ${answer}`,
				answer: dividend,
			};
		case "divisor":
			return {
				id: `${category}_${dividend}_${divisor}_divisor`,
				text: `${dividend} / ? = ${answer}`,
				answer: divisor,
			};
		case "answer":
			return {
				id: `${category}_${dividend}_${divisor}_answer`,
				text: `${dividend} / ${divisor} = ?`,
				answer: answer,
			};
	}
}

function enumerate(category: Category, targetIndex: number): { problem?: Problem; count: number } {
	const props = generateProps[category]!;
	const { answerMax, divisorMax, missingField = "answer" } = props;
	const missingFields = Array.isArray(missingField) ? missingField : [missingField];

	let idx = 0;
	for (let answer = 0; answer <= answerMax; answer++) {
		for (let divisor = 1; divisor <= divisorMax; divisor++) {
			const dividend = answer * divisor;

			for (const field of missingFields) {
				if (field === "divisor" && dividend === 0) continue;

				if (idx === targetIndex) {
					return { problem: makeProblem(category, dividend, divisor, answer, field), count: idx };
				}
				idx++;
			}
		}
	}
	return { count: idx };
}

export const { count, getProblem } = makeGenerator(enumerate);
