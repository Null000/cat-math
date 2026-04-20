import { Category, Problem } from "./common.ts";
import { renderClockSVG } from "./clock.ts";

const minutesPerCategory: Record<string, number[]> = {
	[Category.Clock_HourHalf]: [0, 30],
	[Category.Clock_Quarter]: [0, 15, 30, 45],
	[Category.Clock_FiveMin]: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
};

export function count(category: Category): number {
	const minutes = minutesPerCategory[category]!;
	return 12 * minutes.length;
}

export function getProblem(category: Category, n: number): Problem {
	const minutes = minutesPerCategory[category]!;
	const hourIdx = Math.floor(n / minutes.length);
	const minute = minutes[n % minutes.length]!;
	const hour = hourIdx + 1;
	const answer = `${hour}:${String(minute).padStart(2, "0")}`;
	return {
		id: `Clock_${category}_${hour}_${minute}`,
		text: "🕒",
		svg: renderClockSVG(hour, minute),
		answer,
	};
}
