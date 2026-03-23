export const numberOfRewardImages = 12;

const SOLVED_COUNT_PREFIX = "solved_count:";

export function getSolvedCount(category: string): number {
	return parseInt(localStorage.getItem(SOLVED_COUNT_PREFIX + category) || "0");
}

export function incrementSolvedCount(category: string): void {
	const count = getSolvedCount(category) + 1;
	localStorage.setItem(SOLVED_COUNT_PREFIX + category, count.toString());
}
