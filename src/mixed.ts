import { Category, Problem, makeGenerator } from "./common.ts";

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
	[Category.Mixed_ThreeNumbers_Thousand]: { max: 1000, min: 100 },
};

// All indices below are normalized: a' = (a - min) / step, etc.
// R = (max - min) / step is the max normalized index.

// Pattern A: a + b - c = ?
// Constraints: a + b <= max (i.e., b' <= R - a'), c ∈ [min, a+b] (i.e., c' ∈ [0, a'+b'])
// Count for fixed a': sum_{b'=0}^{R-a'} (a' + b' + 1)
function patternACountForA(aPrime: number, R: number): number {
	const L = R - aPrime;
	return (L + 1) * (aPrime + 1) + (L * (L + 1)) / 2;
}

// Pattern B: a - b + c = ?
// Constraints: b <= a (i.e., b' <= a'), diff + c <= max (i.e., c' <= R - a' + b')
// Count for fixed a': sum_{b'=0}^{a'} (R - a' + b' + 1)
function patternBCountForA(aPrime: number, R: number): number {
	const D = R - aPrime;
	return (aPrime + 1) * (D + 1) + (aPrime * (aPrime + 1)) / 2;
}

function lookupPatternA(category: Category, n: number, min: number, step: number, R: number): Problem {
	let remaining = n;
	for (let aPrime = 0; aPrime <= R; aPrime++) {
		const aCount = patternACountForA(aPrime, R);
		if (remaining < aCount) {
			// Find b' within this a'
			for (let bPrime = 0; bPrime <= R - aPrime; bPrime++) {
				const cCount = aPrime + bPrime + 1;
				if (remaining < cCount) {
					const cPrime = remaining;
					const a = min + aPrime * step;
					const b = min + bPrime * step;
					const c = min + cPrime * step;
					return {
						id: `${category}_${a}_add_${b}_sub_${c}_result`,
						text: `${a} + ${b} - ${c} = ?`,
						answer: a + b - c,
					};
				}
				remaining -= cCount;
			}
		}
		remaining -= aCount;
	}
	throw new Error("Index out of bounds");
}

function lookupPatternB(category: Category, n: number, min: number, step: number, R: number): Problem {
	let remaining = n;
	for (let aPrime = 0; aPrime <= R; aPrime++) {
		const aCount = patternBCountForA(aPrime, R);
		if (remaining < aCount) {
			// Find b' within this a'
			for (let bPrime = 0; bPrime <= aPrime; bPrime++) {
				const cCount = R - aPrime + bPrime + 1;
				if (remaining < cCount) {
					const cPrime = remaining;
					const a = min + aPrime * step;
					const b = min + bPrime * step;
					const c = min + cPrime * step;
					return {
						id: `${category}_${a}_sub_${b}_add_${c}_result`,
						text: `${a} - ${b} + ${c} = ?`,
						answer: a - b + c,
					};
				}
				remaining -= cCount;
			}
		}
		remaining -= aCount;
	}
	throw new Error("Index out of bounds");
}

function enumerate(category: Category, targetIndex: number): { problem?: Problem; count: number } {
	const props = generateProps[category]!;
	const { max } = props;
	const min = props.min ?? 0;
	const step = props.step ?? 1;
	const R = (max - min) / step;

	let countA = 0;
	for (let aPrime = 0; aPrime <= R; aPrime++) {
		countA += patternACountForA(aPrime, R);
	}

	let countB = 0;
	for (let aPrime = 0; aPrime <= R; aPrime++) {
		countB += patternBCountForA(aPrime, R);
	}

	const total = countA + countB;

	if (targetIndex < 0) {
		return { count: total };
	}

	if (targetIndex < countA) {
		return { problem: lookupPatternA(category, targetIndex, min, step, R), count: total };
	}

	return { problem: lookupPatternB(category, targetIndex - countA, min, step, R), count: total };
}

export const { count, getProblem } = makeGenerator(enumerate);
