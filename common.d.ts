export interface Problem {
    id: string;
    text: string;
    answer: number;
}
export declare enum Category {
    Addition_Ten = "Addition: 10",
    Addition_Ten_MissingFirst = "Addition: 10 (missing first)",
    Addition_Ten_MissingSecond = "Addition: 10 (missing second)",
    Addition_TwentyWithoutCarry = "Addition: 20 (without carry)",
    Addition_TwentyWithCarry = "Addition: 20 (with carry)",
    Addition_TwentyMixed = "Addition: 20 (mixed)",
    Addition_TwentyMixed_MissingFirst = "Addition: 20 (mixed, missing first)",
    Addition_TwentyMixed_MissingSecond = "Addition: 20 (mixed, missing second)",
    Addition_HundredWithoutCarry = "Addition: 100 (without carry)",
    Addition_HundredWithCarry = "Addition: 100 (with carry)",
    Addition_HundredMixed = "Addition: 100 (mixed)",
    Addition_HundredMixed_MissingFirst = "Addition: 100 (mixed, missing first)",
    Addition_HundredMixed_MissingSecond = "Addition: 100 (mixed, missing second)",
    Subtraction_Ten = "Subtraction: 10",
    Subtraction_Ten_MissingFirst = "Subtraction: 10 (missing first)",
    Subtraction_Ten_MissingSecond = "Subtraction: 10 (missing second)",
    Subtraction_Twenty = "Subtraction: 20",
    Subtraction_Twenty_MissingFirst = "Subtraction: 20 (missing first)",
    Subtraction_Twenty_MissingSecond = "Subtraction: 20 (missing second)",
    Subtraction_HundredWithoutBorrow = "Subtraction: 100 (without borrow)",
    Subtraction_HundredWithBorrow = "Subtraction: 100 (with borrow)",
    Subtraction_HundredMixed = "Subtraction: 100 (mixed)",
    Subtraction_HundredMixed_MissingFirst = "Subtraction: 100 (mixed, missing first)",
    Subtraction_HundredMixed_MissingSecond = "Subtraction: 100 (mixed, missing second)",
    Multiplication_Ten = "Multiplication: 10",
    Multiplication_Twenty = "Multiplication: 20",
    Multiplication_Lia = "Multiplication Lia",
    Division_Ten = "Division: 10",
    Division_Twenty = "Division: 20",
    Division_Lia = "Division Lia"
}
export declare const categoryGroups: Record<string, Category[]>;
export declare const categoryToGroup: Record<Category, string>;
//# sourceMappingURL=common.d.ts.map