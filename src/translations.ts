import { Category } from "./common.js";

export const translations = {
    en: {
        title: "Math Practice",
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

        // Stats
        stat_correct: "Correct:",
        stat_incorrect: "Incorrect:",
        stat_accuracy: "Accuracy:",
        stat_streak: "Streak:",
        stat_best: "Best:",
        stat_time: "Time:",
        stat_avg: "Avg:",

        // Categories
        [Category.Addition_Ten]: "Addition: 10",
        [Category.Addition_Ten_MissingFirst]: "Addition: 10 (missing first)",
        [Category.Addition_Ten_MissingSecond]: "Addition: 10 (missing second)",
        [Category.Addition_TwentyWithoutCarry]: "Addition: 20 (without carry)",
        [Category.Addition_TwentyWithCarry]: "Addition: 20 (with carry)",
        [Category.Addition_TwentyMixed]: "Addition: 20 (mixed)",
        [Category.Addition_TwentyMixed_MissingFirst]: "Addition: 20 (mixed, missing first)",
        [Category.Addition_TwentyMixed_MissingSecond]: "Addition: 20 (mixed, missing second)",
        [Category.Addition_HundredWithoutCarry]: "Addition: 100 (without carry)",
        [Category.Addition_HundredWithCarry]: "Addition: 100 (with carry)",
        [Category.Addition_HundredMixed]: "Addition: 100 (mixed)",
        [Category.Addition_HundredMixed_MissingFirst]: "Addition: 100 (mixed, missing first)",
        [Category.Addition_HundredMixed_MissingSecond]: "Addition: 100 (mixed, missing second)",

        [Category.Subtraction_Ten]: "Subtraction: 10",
        [Category.Subtraction_Ten_MissingFirst]: "Subtraction: 10 (missing first)",
        [Category.Subtraction_Ten_MissingSecond]: "Subtraction: 10 (missing second)",
        [Category.Subtraction_Twenty]: "Subtraction: 20",
        [Category.Subtraction_Twenty_MissingFirst]: "Subtraction: 20 (missing first)",
        [Category.Subtraction_Twenty_MissingSecond]: "Subtraction: 20 (missing second)",
        [Category.Subtraction_HundredWithoutBorrow]: "Subtraction: 100 (without borrow)",
        [Category.Subtraction_HundredWithBorrow]: "Subtraction: 100 (with borrow)",
        [Category.Subtraction_HundredMixed]: "Subtraction: 100 (mixed)",
        [Category.Subtraction_HundredMixed_MissingFirst]: "Subtraction: 100 (mixed, missing first)",
        [Category.Subtraction_HundredMixed_MissingSecond]: "Subtraction: 100 (mixed, missing second)",

        [Category.Multiplication_Ten]: "Multiplication: 10",
        [Category.Multiplication_Twenty]: "Multiplication: 20",
        [Category.Multiplication_Lia]: "Multiplication Lia",

        [Category.Division_Ten]: "Division: 10",
        [Category.Division_Twenty]: "Division: 20",
        [Category.Division_Lia]: "Division Lia",

        // Group Names
        group_Addition: "Addition",
        group_Subtraction: "Subtraction",
        group_Multiplication: "Multiplication",
        group_Division: "Division"
    },
    sl: {
        title: "Vaja Matematike",
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

        // Stats
        stat_correct: "Pravilno:",
        stat_incorrect: "Nepravilno:",
        stat_accuracy: "Natančnost:",
        stat_streak: "Zaporedoma:",
        stat_best: "Najboljše:",
        stat_time: "Čas:",
        stat_avg: "Povpr:",

        // Categories
        [Category.Addition_Ten]: "Seštevanje: 10",
        [Category.Addition_Ten_MissingFirst]: "Seštevanje: 10 (manjka prvi)",
        [Category.Addition_Ten_MissingSecond]: "Seštevanje: 10 (manjka drugi)",
        [Category.Addition_TwentyWithoutCarry]: "Seštevanje: 20 (brez prehoda)",
        [Category.Addition_TwentyWithCarry]: "Seštevanje: 20 (s prehodom)",
        [Category.Addition_TwentyMixed]: "Seštevanje: 20 (mešano)",
        [Category.Addition_TwentyMixed_MissingFirst]: "Seštevanje: 20 (mešano, manjka prvi)",
        [Category.Addition_TwentyMixed_MissingSecond]: "Seštevanje: 20 (mešano, manjka drugi)",
        [Category.Addition_HundredWithoutCarry]: "Seštevanje: 100 (brez prehoda)",
        [Category.Addition_HundredWithCarry]: "Seštevanje: 100 (s prehodom)",
        [Category.Addition_HundredMixed]: "Seštevanje: 100 (mešano)",
        [Category.Addition_HundredMixed_MissingFirst]: "Seštevanje: 100 (mešano, manjka prvi)",
        [Category.Addition_HundredMixed_MissingSecond]: "Seštevanje: 100 (mešano, manjka drugi)",

        [Category.Subtraction_Ten]: "Odštevanje: 10",
        [Category.Subtraction_Ten_MissingFirst]: "Odštevanje: 10 (manjka prvi)",
        [Category.Subtraction_Ten_MissingSecond]: "Odštevanje: 10 (manjka drugi)",
        [Category.Subtraction_Twenty]: "Odštevanje: 20",
        [Category.Subtraction_Twenty_MissingFirst]: "Odštevanje: 20 (manjka prvi)",
        [Category.Subtraction_Twenty_MissingSecond]: "Odštevanje: 20 (manjka drugi)",
        [Category.Subtraction_HundredWithoutBorrow]: "Odštevanje: 100 (brez prehoda)",
        [Category.Subtraction_HundredWithBorrow]: "Odštevanje: 100 (s prehodom)",
        [Category.Subtraction_HundredMixed]: "Odštevanje: 100 (mešano)",
        [Category.Subtraction_HundredMixed_MissingFirst]: "Odštevanje: 100 (mešano, manjka prvi)",
        [Category.Subtraction_HundredMixed_MissingSecond]: "Odštevanje: 100 (mešano, manjka drugi)",

        [Category.Multiplication_Ten]: "Množenje: 10",
        [Category.Multiplication_Twenty]: "Množenje: 20",
        [Category.Multiplication_Lia]: "Množenje Lia",

        [Category.Division_Ten]: "Deljenje: 10",
        [Category.Division_Twenty]: "Deljenje: 20",
        [Category.Division_Lia]: "Deljenje Lia",

        // Group Names
        group_Addition: "Seštevanje",
        group_Subtraction: "Odštevanje",
        group_Multiplication: "Množenje",
        group_Division: "Deljenje"
    }
};
