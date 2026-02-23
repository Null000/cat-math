import { Category, Problem } from "./common.ts";
import { getCurrentLanguage } from "./i18n.ts";
import { translations } from "./translations.ts";

const enTens: Record<number, string> = {
	20: "twenty",
	30: "thirty",
	40: "forty",
	50: "fifty",
	60: "sixty",
	70: "seventy",
	80: "eighty",
	90: "ninety",
};

const slTens: Record<number, string> = {
	20: "dvajset",
	30: "trideset",
	40: "štirideset",
	50: "petdeset",
	60: "šestdeset",
	70: "sedemdeset",
	80: "osemdeset",
	90: "devetdeset",
};

function getNumberWord(n: number): string {
	const lang = getCurrentLanguage();
	if (n <= 20) {
		const key = `number_${n}` as keyof (typeof translations)[typeof lang];
		return translations[lang][key] as string;
	}
	if (n === 1000) {
		return lang === "sl" ? "tisoč" : "one thousand";
	}
	if (n >= 100) {
		const hundreds = Math.floor(n / 100);
		const remainder = n % 100;
		let prefix = "";
		if (lang === "sl") {
			if (hundreds === 1) {
				prefix = "sto";
			} else {
				const slOnesWord = translations.sl[`number_${hundreds}` as keyof typeof translations.sl] as string;
				prefix = slOnesWord + "sto";
			}
		} else {
			const enOnesWord = translations.en[`number_${hundreds}` as keyof typeof translations.en] as string;
			prefix = enOnesWord + " hundred";
		}
		if (remainder === 0) return prefix;
		return prefix + " " + getNumberWord(remainder);
	}

	const tens = Math.floor(n / 10) * 10;
	const ones = n % 10;

	if (lang === "sl") {
		if (ones === 0) return slTens[tens]!;
		const onesWord = translations.sl[`number_${ones}` as keyof typeof translations.sl] as string;
		return `${onesWord}in${slTens[tens]}`;
	} else {
		if (ones === 0) return enTens[tens]!;
		const onesWord = translations.en[`number_${ones}` as keyof typeof translations.en] as string;
		return `${enTens[tens]}-${onesWord}`;
	}
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

function generateNumberToText(maxNumber: number, category: Category): Problem[] {
	const problems: Problem[] = [];

	for (let n = 0; n <= maxNumber; n++) {
		// Generate direct text inputs

		problems.push({
			id: `${category}_${n}`,
			text: `${n} = ?`,
			answer: getNumberWord(n),
		});
	}

	return problems;
}

function generateTextToNumber(maxNumber: number, category: Category): Problem[] {
	const problems: Problem[] = [];

	for (let n = 0; n <= maxNumber; n++) {
		problems.push({
			id: `${category}_${n}`,
			text: `${getNumberWord(n)} = ?`,
			answer: n,
		});
	}

	return problems;
}

export function generate(category: Category): Problem[] {
	switch (category) {
		case Category.NumberToText_Ten:
			return generateNumberToText(10, category);
		case Category.NumberToText_Twenty:
			return generateNumberToText(20, category);
		case Category.NumberToText_Hundred:
			return generateNumberToText(100, category);
		case Category.NumberToText_Thousand:
			return generateNumberToText(1000, category);
		case Category.TextToNumber_Ten:
			return generateTextToNumber(10, category);
		case Category.TextToNumber_Twenty:
			return generateTextToNumber(20, category);
		case Category.TextToNumber_Hundred:
			return generateTextToNumber(100, category);
		case Category.TextToNumber_Thousand:
			return generateTextToNumber(1000, category);
		default:
			return [];
	}
}
