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

function getMaxNumber(category: Category): number {
	switch (category) {
		case Category.NumberToText_Ten:
		case Category.TextToNumber_Ten:
			return 10;
		case Category.NumberToText_Twenty:
		case Category.TextToNumber_Twenty:
			return 20;
		case Category.NumberToText_Hundred:
		case Category.TextToNumber_Hundred:
			return 100;
		case Category.NumberToText_Thousand:
		case Category.TextToNumber_Thousand:
			return 1000;
		default:
			return 0;
	}
}

function isNumberToText(category: Category): boolean {
	return (
		category === Category.NumberToText_Ten ||
		category === Category.NumberToText_Twenty ||
		category === Category.NumberToText_Hundred ||
		category === Category.NumberToText_Thousand
	);
}

export function count(category: Category): number {
	return getMaxNumber(category) + 1;
}

export function getProblem(category: Category, n: number): Problem {
	if (isNumberToText(category)) {
		return {
			id: `${category}_${n}`,
			text: `${n} = ?`,
			answer: getNumberWord(n),
		};
	} else {
		return {
			id: `${category}_${n}`,
			text: `${getNumberWord(n)} = ?`,
			answer: n,
		};
	}
}
