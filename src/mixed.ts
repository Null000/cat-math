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
// R  = (max - min)     / step  is the max normalized index for a single operand.
// Rs = (max - 2*min)   / step  is the max normalized sum a' + b' when a + b <= max.
// Mq = min / step              is the offset that turns a normalized sum back into a value.

// Pattern A: a + b - c = ?
// Constraints: a + b <= max (i.e., a' + b' <= Rs), c ∈ [min, a+b] (i.e., c' ∈ [0, a' + b' + Mq])
// Count for fixed a': sum_{b'=0}^{Rs - a'} (a' + b' + Mq + 1)
function patternACountForA(aPrime: number, Rs: number, Mq: number): number {
	const L = Rs - aPrime;
	if (L < 0) return 0;
	return (L + 1) * (aPrime + Mq + 1) + (L * (L + 1)) / 2;
}

// Pattern B: a - b + c = ?
// Constraints: b <= a (i.e., b' <= a'), diff + c <= max (i.e., c' <= R - a' + b')
// Count for fixed a': sum_{b'=0}^{a'} (R - a' + b' + 1)
function patternBCountForA(aPrime: number, R: number): number {
	const D = R - aPrime;
	return (aPrime + 1) * (D + 1) + (aPrime * (aPrime + 1)) / 2;
}

function lookupPatternA(category: Category, n: number, min: number, step: number, Rs: number, Mq: number): Problem {
	let remaining = n;
	for (let aPrime = 0; aPrime <= Rs; aPrime++) {
		const aCount = patternACountForA(aPrime, Rs, Mq);
		if (remaining < aCount) {
			// Find b' within this a'
			for (let bPrime = 0; bPrime <= Rs - aPrime; bPrime++) {
				const cCount = aPrime + bPrime + Mq + 1;
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
	const Rs = (max - 2 * min) / step;
	const Mq = min / step;

	let countA = 0;
	for (let aPrime = 0; aPrime <= Rs; aPrime++) {
		countA += patternACountForA(aPrime, Rs, Mq);
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
		return { problem: lookupPatternA(category, targetIndex, min, step, Rs, Mq), count: total };
	}

	return { problem: lookupPatternB(category, targetIndex - countA, min, step, R), count: total };
}

export const { count, getProblem } = makeGenerator(enumerate);
