import { Category, Problem, makeGenerator } from "./common.ts";

const generateProps: Record<
	string,
	{
		max: number;
		mulMax: number;
	}
> = {
	[Category.Mixed_Operations_Hundred]: { max: 100, mulMax: 10 },
};

// Enumerates all valid 3-operand "mix of ×/÷ and +/-" problems where every operand,
// the intermediate value (the ×/÷ sub-expression under PEMDAS), and the final
// result stay within [0, max]. 8 patterns are generated in a fixed order so that
// indices are stable across calls.
function enumerate(category: Category, targetIndex: number): { problem?: Problem; count: number } {
	const props = generateProps[category]!;
	const { max, mulMax } = props;

	let idx = 0;

	// Pattern 1: a × b + c = ?   (m = a*b; m + c ≤ max)
	for (let a = 0; a <= mulMax; a++) {
		for (let b = 0; b <= mulMax; b++) {
			const m = a * b;
			if (m > max) continue;
			for (let c = 0; c <= max - m; c++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_mul_${b}_add_${c}_result`,
							text: `${a} × ${b} + ${c} = ?`,
							answer: m + c,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 2: a × b - c = ?   (m = a*b; m - c ≥ 0)
	for (let a = 0; a <= mulMax; a++) {
		for (let b = 0; b <= mulMax; b++) {
			const m = a * b;
			if (m > max) continue;
			for (let c = 0; c <= m; c++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_mul_${b}_sub_${c}_result`,
							text: `${a} × ${b} - ${c} = ?`,
							answer: m - c,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 3: a / b + c = ?   (b ≥ 1; a = b*q integer; q + c ≤ max)
	for (let b = 1; b <= mulMax; b++) {
		for (let q = 0; q <= mulMax; q++) {
			const a = b * q;
			if (a > max) continue;
			for (let c = 0; c <= max - q; c++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_div_${b}_add_${c}_result`,
							text: `${a} / ${b} + ${c} = ?`,
							answer: q + c,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 4: a / b - c = ?   (b ≥ 1; a = b*q integer; q - c ≥ 0)
	for (let b = 1; b <= mulMax; b++) {
		for (let q = 0; q <= mulMax; q++) {
			const a = b * q;
			if (a > max) continue;
			for (let c = 0; c <= q; c++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_div_${b}_sub_${c}_result`,
							text: `${a} / ${b} - ${c} = ?`,
							answer: q - c,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 5: a + b × c = ?   (m = b*c; a + m ≤ max)
	for (let b = 0; b <= mulMax; b++) {
		for (let c = 0; c <= mulMax; c++) {
			const m = b * c;
			if (m > max) continue;
			for (let a = 0; a <= max - m; a++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_add_${b}_mul_${c}_result`,
							text: `${a} + ${b} × ${c} = ?`,
							answer: a + m,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 6: a - b × c = ?   (m = b*c; a - m ≥ 0)
	for (let b = 0; b <= mulMax; b++) {
		for (let c = 0; c <= mulMax; c++) {
			const m = b * c;
			if (m > max) continue;
			for (let a = m; a <= max; a++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_sub_${b}_mul_${c}_result`,
							text: `${a} - ${b} × ${c} = ?`,
							answer: a - m,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 7: a + b / c = ?   (c ≥ 1; b = c*q integer; a + q ≤ max)
	for (let c = 1; c <= mulMax; c++) {
		for (let q = 0; q <= mulMax; q++) {
			const b = c * q;
			if (b > max) continue;
			for (let a = 0; a <= max - q; a++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_add_${b}_div_${c}_result`,
							text: `${a} + ${b} / ${c} = ?`,
							answer: a + q,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	// Pattern 8: a - b / c = ?   (c ≥ 1; b = c*q integer; a - q ≥ 0)
	for (let c = 1; c <= mulMax; c++) {
		for (let q = 0; q <= mulMax; q++) {
			const b = c * q;
			if (b > max) continue;
			for (let a = q; a <= max; a++) {
				if (idx === targetIndex) {
					return {
						problem: {
							id: `${category}_${a}_sub_${b}_div_${c}_result`,
							text: `${a} - ${b} / ${c} = ?`,
							answer: a - q,
						},
						count: idx,
					};
				}
				idx++;
			}
		}
	}

	return { count: idx };
}

export const { count, getProblem } = makeGenerator(enumerate);
