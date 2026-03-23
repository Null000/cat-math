import { Category, Problem, makeGenerator } from "./common.ts";

const generateProps: Record<
	string,
	{
		xMax: number;
		yMax: number;
		xMin?: number;
		yMin?: number;
		step?: number;
		maxResult?: number;
		carryAllowed?: boolean;
		carryForced?: boolean;
		threeNumbers?: boolean;
		missingFact?:
			| ("first" | "second" | "result")
			| ("first" | "second" | "result")[];
	}
> = {
	[Category.Addition_Ten]: { xMax: 10, yMax: 10 },
	[Category.Addition_ThreeNumbers_Ten]: {
		xMax: 10,
		yMax: 10,
		maxResult: 10,
		threeNumbers: true,
	},
	[Category.Addition_Ten_Missing]: {
		xMax: 10,
		yMax: 10,
		missingFact: ["first", "second"],
	},
	[Category.Addition_TwentyWithoutCarry]: {
		xMax: 20,
		yMax: 20,
		maxResult: 20,
		carryAllowed: false,
	},
	[Category.Addition_TwentyWithCarry]: {
		xMax: 20,
		yMax: 20,
		maxResult: 20,
		carryAllowed: true,
		carryForced: true,
	},
	[Category.Addition_ThreeNumbers_Twenty]: {
		xMax: 20,
		yMax: 20,
		maxResult: 20,
		threeNumbers: true,
	},
	[Category.Addition_Twenty]: {
		xMax: 20,
		yMax: 20,
		maxResult: 20,
		carryAllowed: true,
		carryForced: false,
	},
	[Category.Addition_Twenty_Missing]: {
		xMax: 20,
		yMax: 20,
		maxResult: 20,
		carryAllowed: true,
		carryForced: false,
		missingFact: ["first", "second"],
	},
	[Category.Addition_ThreeNumbers_Hundred]: {
		xMax: 100,
		yMax: 100,
		xMin: 10,
		yMin: 10,
		maxResult: 100,
		threeNumbers: true,
	},
	[Category.Addition_HundredWithoutCarry]: {
		xMax: 100,
		yMax: 100,
		xMin: 10,
		yMin: 10,
		maxResult: 100,
		carryAllowed: false,
	},
	[Category.Addition_HundredWithCarry]: {
		xMax: 100,
		yMax: 100,
		xMin: 10,
		yMin: 10,
		maxResult: 100,
		carryAllowed: true,
		carryForced: true,
	},
	[Category.Addition_Hundred]: {
		xMax: 100,
		yMax: 100,
		xMin: 10,
		yMin: 10,
		maxResult: 100,
		carryAllowed: true,
		carryForced: false,
	},
	[Category.Addition_Hundred_Missing]: {
		xMax: 100,
		yMax: 100,
		xMin: 10,
		yMin: 10,
		maxResult: 100,
		carryAllowed: true,
		carryForced: false,
		missingFact: ["first", "second"],
	},
	[Category.Addition_Tens]: {
		xMax: 90,
		yMax: 90,
		xMin: 10,
		yMin: 10,
		step: 10,
		maxResult: 100,
	},
	[Category.Addition_ThreeNumbers_Thousand]: {
		xMax: 990,
		yMax: 990,
		xMin: 100,
		yMin: 100,
		step: 10,
		maxResult: 1000,
		threeNumbers: true,
	},
	[Category.Addition_ThousandWithoutCarry]: {
		xMax: 990,
		yMax: 990,
		xMin: 100,
		yMin: 100,
		step: 10,
		maxResult: 1000,
		carryAllowed: false,
	},
	[Category.Addition_ThousandWithCarry]: {
		xMax: 990,
		yMax: 990,
		xMin: 100,
		yMin: 100,
		step: 10,
		maxResult: 1000,
		carryAllowed: true,
		carryForced: true,
	},
	[Category.Addition_Thousand]: {
		xMax: 990,
		yMax: 990,
		xMin: 100,
		yMin: 100,
		step: 10,
		maxResult: 1000,
		carryAllowed: true,
		carryForced: false,
	},
	[Category.Addition_Hundreds]: {
		xMax: 900,
		yMax: 900,
		xMin: 100,
		yMin: 100,
		step: 100,
		maxResult: 1000,
	},
};

function makeProblem(category: Category, i: number, j: number, fact: "first" | "second" | "result"): Problem {
	const result = i + j;
	switch (fact) {
		case "first":
			return {
				id: `${category}_${i}_${j}_first`,
				text: `? + ${j} = ${result}`,
				answer: i,
			};
		case "second":
			return {
				id: `${category}_${i}_${j}_second`,
				text: `${i} + ? = ${result}`,
				answer: j,
			};
		case "result":
			return {
				id: `${category}_${i}_${j}_result`,
				text: `${i} + ${j} = ?`,
				answer: result,
			};
	}
}

function makeThreeNumberProblem(category: Category, i: number, j: number, k: number): Problem {
	return {
		id: `${category}_${i}_${j}_${k}_result`,
		text: `${i} + ${j} + ${k} = ?`,
		answer: i + j + k,
	};
}

function enumerate(category: Category, targetIndex: number): { problem?: Problem; count: number } {
	const props = generateProps[category]!;
	let {
		xMax,
		yMax,
		xMin,
		yMin,
		step,
		maxResult,
		carryAllowed,
		carryForced,
		missingFact,
	} = props;
	xMin = xMin ?? 0;
	yMin = yMin ?? 0;
	step = step ?? 1;
	carryAllowed = carryAllowed ?? true;
	carryForced = carryForced ?? false;
	missingFact = missingFact ?? "result";

	const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];

	let idx = 0;
	for (let i = xMin; i <= xMax; i += step) {
		for (let j = yMin; j <= yMax; j += step) {
			if (props.threeNumbers) {
				const currentSum = i + j;
				if (maxResult && currentSum > maxResult) continue;
				for (let k = yMin; !!maxResult ? k <= maxResult : k <= yMax; k += step) {
					const result = currentSum + k;
					if (maxResult && result > maxResult) continue;
					if (idx === targetIndex) {
						return { problem: makeThreeNumberProblem(category, i, j, k), count: idx };
					}
					idx++;
				}
				continue;
			}

			const digitI = Math.floor(i / step) % 10;
			const digitJ = Math.floor(j / step) % 10;
			const hasCarry = carryAllowed && digitI + digitJ >= 10;
			if (hasCarry && !carryForced) continue;
			if (!hasCarry && carryForced) continue;

			const result = i + j;
			if (maxResult && result > maxResult) continue;

			for (const fact of missingFacts) {
				if (idx === targetIndex) {
					return { problem: makeProblem(category, i, j, fact), count: idx };
				}
				idx++;
			}
		}
	}
	return { count: idx };
}

export const { count, getProblem } = makeGenerator(enumerate);
