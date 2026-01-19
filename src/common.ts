export interface Problem {
  id: string;
  text: string;
  answer: number;
}

export enum Category {
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
  Multiplication_Ten_MissingFirst = "Multiplication: 10 (missing first)",
  Multiplication_Ten_MissingSecond = "Multiplication: 10 (missing second)",
  Multiplication_Twenty = "Multiplication: 20",
  Multiplication_Twenty_MissingFirst = "Multiplication: 20 (missing first)",
  Multiplication_Twenty_MissingSecond = "Multiplication: 20 (missing second)",
  Multiplication_Lia = "Multiplication Lia",
  Multiplication_Lia_MissingFirst = "Multiplication Lia (missing first)",
  Multiplication_Lia_MissingSecond = "Multiplication Lia (missing second)",
  Division_Ten = "Division: 10",
  Division_Ten_MissingFirst = "Division: 10 (missing first)",
  Division_Ten_MissingSecond = "Division: 10 (missing second)",
  Division_Twenty = "Division: 20",
  Division_Twenty_MissingFirst = "Division: 20 (missing first)",
  Division_Twenty_MissingSecond = "Division: 20 (missing second)",
  Division_Lia = "Division Lia",
  Division_Lia_MissingFirst = "Division Lia (missing first)",
  Division_Lia_MissingSecond = "Division Lia (missing second)"
}

export const categoryGroups: Record<string, Category[]> = {
  Addition: [
    Category.Addition_Ten,
    Category.Addition_Ten_MissingFirst,
    Category.Addition_Ten_MissingSecond,
    Category.Addition_TwentyWithoutCarry,
    Category.Addition_TwentyWithCarry,
    Category.Addition_TwentyMixed,
    Category.Addition_TwentyMixed_MissingFirst,
    Category.Addition_TwentyMixed_MissingSecond,
    Category.Addition_HundredWithoutCarry,
    Category.Addition_HundredWithCarry,
    Category.Addition_HundredMixed,
    Category.Addition_HundredMixed_MissingFirst,
    Category.Addition_HundredMixed_MissingSecond,
  ],
  Subtraction: [
    Category.Subtraction_Ten,
    Category.Subtraction_Ten_MissingFirst,
    Category.Subtraction_Ten_MissingSecond,
    Category.Subtraction_Twenty,
    Category.Subtraction_Twenty_MissingFirst,
    Category.Subtraction_Twenty_MissingSecond,
    Category.Subtraction_HundredWithoutBorrow,
    Category.Subtraction_HundredWithBorrow,
    Category.Subtraction_HundredMixed,
    Category.Subtraction_HundredMixed_MissingFirst,
    Category.Subtraction_HundredMixed_MissingSecond,
  ],
  Multiplication: [Category.Multiplication_Ten, Category.Multiplication_Twenty, Category.Multiplication_Lia, Category.Multiplication_Lia_MissingFirst, Category.Multiplication_Lia_MissingSecond],
  Division: [Category.Division_Ten, Category.Division_Twenty, Category.Division_Lia, Category.Division_Lia_MissingFirst, Category.Division_Lia_MissingSecond],
};

export const categoryToGroup: Record<Category, string> = (() => {
  const dict: any = {};
  for (const group in categoryGroups) {
    for (const category of categoryGroups[group]!) {
      dict[category] = group;
    }
  }
  return dict;
})();
