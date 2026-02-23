import { Category, Problem } from "./common.ts";
import { getCurrentLanguage } from "./i18n.ts";
import { translations } from "./translations.ts";

function getNumberWord(n: number): string {
	const lang = getCurrentLanguage();
	const key = `number_${n}` as keyof (typeof translations)[typeof lang];
	return translations[lang][key] as string;
}

function shuffled<T>(arr: T[]): T[] {
	const copy = arr.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = copy[i]!;
		copy[i] = copy[j]!;
		copy[j] = tmp;
	}
	return copy;
}

function generateNumberToText(): Problem[] {
	const allNumbers = Array.from({ length: 21 }, (_, i) => i);
	const problems: Problem[] = [];

	for (let n = 0; n <= 20; n++) {
		const distractors = shuffled(allNumbers.filter((x) => x !== n)).slice(
			0,
			3,
		);
		const optionNumbers = shuffled([n, ...distractors]);

		const options = optionNumbers.map((num) => ({
			label: getNumberWord(num),
			value: num,
		}));

		problems.push({
			id: `${Category.NumberToText_Twenty}_${n}`,
			text: `${n} = ?`,
			answer: n,
			options,
		});
	}

	return problems;
}

function generateTextToNumber(): Problem[] {
	const problems: Problem[] = [];

	for (let n = 0; n <= 20; n++) {
		problems.push({
			id: `${Category.TextToNumber_Twenty}_${n}`,
			text: `${getNumberWord(n)} = ?`,
			answer: n,
		});
	}

	return problems;
}

export function generate(category: Category): Problem[] {
	switch (category) {
		case Category.NumberToText_Twenty:
			return generateNumberToText();
		case Category.TextToNumber_Twenty:
			return generateTextToNumber();
		default:
			return [];
	}
}
