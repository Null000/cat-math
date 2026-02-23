import { Category } from "./common.ts";

export const translations = {
	en: {
		title: "Cat Math",
		select_categories: "Select Practice Categories",
		start_practice: "Start Practice",
		back_to_categories: "← Back to Categories",
		check_button: "Check",
		correct: "Correct! 🎉",
		incorrect: "Incorrect. 😢",
		nan_error: "Please enter a number!",
		select_warning: "Please select at least one category to practice!",
		input_placeholder: "Your answer",
		examples: "Examples",
		solved: "solved",
		selected_label: "Selected:",
		next_round: "Next Round",
		end_round: "End Round",
		perfect_round: "Perfect round! Great job! 🌟",
		review_header: "Problems to review:",
		your_answers: "your answers:",
		correct_answer: "Correct answer:",

		// Stats
		stat_correct: "Correct:",
		stat_incorrect: "Incorrect:",
		stat_accuracy: "Accuracy:",
		stat_streak: "Streak:",
		stat_best: "Best:",
		stat_time: "Time:",
		stat_avg: "Avg:",
		stat_median: "Median:",

		// Categories
		[Category.Addition_Ten]: "Addition: 10",
		[Category.Addition_Ten_Missing]: "Addition: 10 (missing facts)",
		[Category.Addition_TwentyWithoutCarry]: "Addition: 20 (without carry)",
		[Category.Addition_TwentyWithCarry]: "Addition: 20 (with carry)",
		[Category.Addition_Twenty]: "Addition: 20",
		[Category.Addition_Twenty_Missing]: "Addition: 20 (missing facts)",
		[Category.Addition_HundredWithoutCarry]:
			"Addition: 100 (without carry)",
		[Category.Addition_HundredWithCarry]: "Addition: 100 (with carry)",
		[Category.Addition_Hundred]: "Addition: 100",
		[Category.Addition_Hundred_Missing]: "Addition: 100 (missing facts)",
		[Category.Addition_Tens]: "Addition: Tens",
		[Category.Addition_ThousandWithoutCarry]:
			"Addition: 1000 (without carry)",
		[Category.Addition_ThousandWithCarry]: "Addition: 1000 (with carry)",
		[Category.Addition_Thousand]: "Addition: 1000",
		[Category.Addition_Hundreds]: "Addition: Hundreds",

		[Category.Subtraction_Ten]: "Subtraction: 10",
		[Category.Subtraction_Ten_Missing]: "Subtraction: 10 (missing facts)",
		[Category.Subtraction_Twenty]: "Subtraction: 20",
		[Category.Subtraction_Twenty_Missing]:
			"Subtraction: 20 (missing facts)",
		[Category.Subtraction_HundredWithoutBorrow]:
			"Subtraction: 100 (without borrow)",
		[Category.Subtraction_HundredWithBorrow]:
			"Subtraction: 100 (with borrow)",
		[Category.Subtraction_Hundred]: "Subtraction: 100",
		[Category.Subtraction_Hundred_Missing]:
			"Subtraction: 100 (missing facts)",
		[Category.Subtraction_Tens]: "Subtraction: Tens",
		[Category.Subtraction_ThousandWithoutBorrow]:
			"Subtraction: 1000 (without borrow)",
		[Category.Subtraction_ThousandWithBorrow]:
			"Subtraction: 1000 (with borrow)",
		[Category.Subtraction_Thousand]: "Subtraction: 1000",
		[Category.Subtraction_Hundreds]: "Subtraction: Hundreds",

		[Category.Multiplication_Ten]: "Multiplication: 10",
		[Category.Multiplication_Ten_Missing]:
			"Multiplication: 10 (missing facts)",
		[Category.Multiplication_Twenty]: "Multiplication: 20",
		[Category.Multiplication_Twenty_Missing]:
			"Multiplication: 20 (missing facts)",

		[Category.Division_Ten]: "Division: 10",
		[Category.Division_Ten_Missing]: "Division: 10 (missing facts)",
		[Category.Division_Twenty]: "Division: 20",
		[Category.Division_Twenty_Missing]: "Division: 20 (missing facts)",
		[Category.Division_Hundred]: "Division: 100",
		[Category.Division_Hundred_Missing]: "Division: 100 (missing facts)",

		[Category.Multiplication_Hundred]: "Multiplication: 100",
		[Category.Multiplication_Hundred_Missing]:
			"Multiplication: 100 (missing facts)",

		[Category.Comparison_Ten]: "Comparison: 10",
		[Category.Comparison_Twenty]: "Comparison: 20",
		[Category.Comparison_Hundred]: "Comparison: 100",
		[Category.Comparison_Thousand]: "Comparison: 1000",

		[Category.NumberToText_Twenty]: "Number to Text: 20",
		[Category.TextToNumber_Twenty]: "Text to Number: 20",

		// Number words (0–20)
		number_0: "zero",
		number_1: "one",
		number_2: "two",
		number_3: "three",
		number_4: "four",
		number_5: "five",
		number_6: "six",
		number_7: "seven",
		number_8: "eight",
		number_9: "nine",
		number_10: "ten",
		number_11: "eleven",
		number_12: "twelve",
		number_13: "thirteen",
		number_14: "fourteen",
		number_15: "fifteen",
		number_16: "sixteen",
		number_17: "seventeen",
		number_18: "eighteen",
		number_19: "nineteen",
		number_20: "twenty",
		[Category.NextPrevious_Ten]: "Next/Previous: 10",
		[Category.NextPrevious_Twenty]: "Next/Previous: 20",

		// Group Names
		group_Addition: "Addition",
		group_Subtraction: "Subtraction",
		group_Multiplication: "Multiplication",
		group_Division: "Division",
		group_Comparison: "Comparison",
		group_NumberText: "Number & Text",
		group_NextPrevious: "Next/Previous",

		// Grouping toggle
		grouping_by_type: "By Type",
		grouping_by_year: "By Year",

		// RPG Index Page
		rpg_title: "Choose Your Spells",
		rpg_subtitle: "Select the math spells you wish to master",
		rpg_select_categories: "Spell Book",
		rpg_start_battle: "Enter Battle",
	},
	sl: {
		title: "Mačja Matematika",
		select_categories: "Izberi Kategorije",
		start_practice: "Začni Vajo",
		back_to_categories: "← Nazaj na Kategorije",
		check_button: "Preveri",
		correct: "Pravilno! 🎉",
		incorrect: "Nepravilno. 😢",
		nan_error: "Prosim vnesi številko!",
		select_warning: "Prosim izberi vsaj eno kategorijo!",
		input_placeholder: "Tvoj odgovor",
		examples: "Primeri",
		solved: "rešeno",
		selected_label: "Izbrano:",
		next_round: "Naslednji krog",
		end_round: "Končaj krog",
		perfect_round: "Popoln krog! Odlično delo! 🌟",
		review_header: "Naloge za ponovitev:",
		your_answers: "tvoji odgovori:",
		correct_answer: "Pravilni odgovor:",

		// Stats
		stat_correct: "Pravilno:",
		stat_incorrect: "Nepravilno:",
		stat_accuracy: "Natančnost:",
		stat_streak: "Zaporedoma:",
		stat_best: "Najboljše:",
		stat_time: "Čas:",
		stat_avg: "Povpr:",
		stat_median: "Med:",

		// Categories
		[Category.Addition_Ten]: "Seštevanje: 10",
		[Category.Addition_Ten_Missing]: "Seštevanje: 10 (neznani člen)",
		[Category.Addition_TwentyWithoutCarry]: "Seštevanje: 20 (brez prehoda)",
		[Category.Addition_TwentyWithCarry]: "Seštevanje: 20 (s prehodom)",
		[Category.Addition_Twenty]: "Seštevanje: 20",
		[Category.Addition_Twenty_Missing]: "Seštevanje: 20 (neznani člen)",
		[Category.Addition_HundredWithoutCarry]:
			"Seštevanje: 100 (brez prehoda)",
		[Category.Addition_HundredWithCarry]: "Seštevanje: 100 (s prehodom)",
		[Category.Addition_Hundred]: "Seštevanje: 100",
		[Category.Addition_Hundred_Missing]: "Seštevanje: 100 (neznani člen)",
		[Category.Addition_Tens]: "Seštevanje: desetice",
		[Category.Addition_ThousandWithoutCarry]:
			"Seštevanje: 1000 (brez prehoda)",
		[Category.Addition_ThousandWithCarry]: "Seštevanje: 1000 (s prehodom)",
		[Category.Addition_Thousand]: "Seštevanje: 1000",
		[Category.Addition_Hundreds]: "Seštevanje: stotice",

		[Category.Subtraction_Ten]: "Odštevanje: 10",
		[Category.Subtraction_Ten_Missing]: "Odštevanje: 10 (neznani člen)",
		[Category.Subtraction_Twenty]: "Odštevanje: 20",
		[Category.Subtraction_Twenty_Missing]: "Odštevanje: 20 (neznani člen)",
		[Category.Subtraction_HundredWithoutBorrow]:
			"Odštevanje: 100 (brez prehoda)",
		[Category.Subtraction_HundredWithBorrow]:
			"Odštevanje: 100 (s prehodom)",
		[Category.Subtraction_Hundred]: "Odštevanje: 100",
		[Category.Subtraction_Hundred_Missing]:
			"Odštevanje: 100 (neznani člen)",
		[Category.Subtraction_Tens]: "Odštevanje: desetice",
		[Category.Subtraction_ThousandWithoutBorrow]:
			"Odštevanje: 1000 (brez prehoda)",
		[Category.Subtraction_ThousandWithBorrow]:
			"Odštevanje: 1000 (s prehodom)",
		[Category.Subtraction_Thousand]: "Odštevanje: 1000",
		[Category.Subtraction_Hundreds]: "Odštevanje: stotice",

		[Category.Multiplication_Ten]: "Množenje: 10",
		[Category.Multiplication_Ten_Missing]: "Množenje: 10 (neznani člen)",
		[Category.Multiplication_Twenty]: "Množenje: 20",
		[Category.Multiplication_Twenty_Missing]: "Množenje: 20 (neznani člen)",

		[Category.Division_Ten]: "Deljenje: 10",
		[Category.Division_Ten_Missing]: "Deljenje: 10 (neznani člen)",
		[Category.Division_Twenty]: "Deljenje: 20",
		[Category.Division_Twenty_Missing]: "Deljenje: 20 (neznani člen)",
		[Category.Division_Hundred]: "Deljenje: 100",
		[Category.Division_Hundred_Missing]: "Deljenje: 100 (neznani člen)",

		[Category.Multiplication_Hundred]: "Množenje: 100",
		[Category.Multiplication_Hundred_Missing]:
			"Množenje: 100 (neznani člen)",

		[Category.Comparison_Ten]: "Primerjanje: 10",
		[Category.Comparison_Twenty]: "Primerjanje: 20",
		[Category.Comparison_Hundred]: "Primerjanje: 100",
		[Category.Comparison_Thousand]: "Primerjanje: 1000",

		[Category.NumberToText_Twenty]: "Število v besedo: 20",
		[Category.TextToNumber_Twenty]: "Beseda v število: 20",

		// Number words (0–20)
		number_0: "nič",
		number_1: "ena",
		number_2: "dve",
		number_3: "tri",
		number_4: "štiri",
		number_5: "pet",
		number_6: "šest",
		number_7: "sedem",
		number_8: "osem",
		number_9: "devet",
		number_10: "deset",
		number_11: "enajst",
		number_12: "dvanajst",
		number_13: "trinajst",
		number_14: "štirinajst",
		number_15: "petnajst",
		number_16: "šestnajst",
		number_17: "sedemnajst",
		number_18: "osemnajst",
		number_19: "devetnajst",
		number_20: "dvajset",
		[Category.NextPrevious_Ten]: "Predhodnik/Naslednik: 10",
		[Category.NextPrevious_Twenty]: "Predhodnik/Naslednik: 20",

		// Group Names
		group_Addition: "Seštevanje",
		group_Subtraction: "Odštevanje",
		group_Multiplication: "Množenje",
		group_Division: "Deljenje",
		group_Comparison: "Primerjanje",
		group_NumberText: "Številke in besede",
		group_NextPrevious: "Predhodnik/Naslednik",

		// Year Group Names
		"group_1. razred": "1. razred",
		"group_2. razred": "2. razred",
		"group_3. razred": "3. razred",
		"group_4. razred": "4. razred",
		"group_5. razred": "5. razred",

		// Grouping toggle
		grouping_by_type: "Po vrsti",
		grouping_by_year: "Po razredu",

		// RPG Index Page
		rpg_title: "Izberi Uroke",
		rpg_subtitle: "Izberi matematične uroke za vadbo",
		rpg_select_categories: "Knjiga Urokov",
		rpg_start_battle: "Vstopi v Bitko",
	},
};
