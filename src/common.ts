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
  Addition_TwentyWithoutCarry_MissingFirst = "Addition: 20 (without carry, missing first)",
  Addition_TwentyWithoutCarry_MissingSecond = "Addition: 20 (without carry, missing second)",
  Addition_TwentyWithCarry = "Addition: 20 (with carry)",
  Addition_TwentyWithCarry_MissingFirst = "Addition: 20 (with carry, missing first)",
  Addition_TwentyWithCarry_MissingSecond = "Addition: 20 (with carry, missing second)",
  Addition_TwentyMixed = "Addition: 20 (mixed)",
  Addition_TwentyMixed_MissingFirst = "Addition: 20 (mixed, missing first)",
  Addition_TwentyMixed_MissingSecond = "Addition: 20 (mixed, missing second)",
  Addition_HundredWithoutCarry = "Addition: 100 (without carry)",
  Addition_HundredWithoutCarry_MissingFirst = "Addition: 100 (without carry, missing first)",
  Addition_HundredWithoutCarry_MissingSecond = "Addition: 100 (without carry, missing second)",
  Addition_HundredWithCarry = "Addition: 100 (with carry)",
  Addition_HundredWithCarry_MissingFirst = "Addition: 100 (with carry, missing first)",
  Addition_HundredWithCarry_MissingSecond = "Addition: 100 (with carry, missing second)",
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
  Subtraction_HundredWithoutBorrow_MissingFirst = "Subtraction: 100 (without borrow, missing first)",
  Subtraction_HundredWithoutBorrow_MissingSecond = "Subtraction: 100 (without borrow, missing second)",
  Subtraction_HundredWithBorrow = "Subtraction: 100 (with borrow)",
  Subtraction_HundredWithBorrow_MissingFirst = "Subtraction: 100 (with borrow, missing first)",
  Subtraction_HundredWithBorrow_MissingSecond = "Subtraction: 100 (with borrow, missing second)",
  Multiplication_Ten = "Multiplication: 10",
  Multiplication_Twenty = "Multiplication: 20",
  Division_Ten = "Division: 10",
  Division_Twenty = "Division: 20",
}

export const categoryGroups: Record<string, Category[]> = {
  Addition: [
    Category.Addition_Ten,
    Category.Addition_Ten_MissingFirst,
    Category.Addition_Ten_MissingSecond,
    Category.Addition_TwentyWithoutCarry,
    Category.Addition_TwentyWithoutCarry_MissingFirst,
    Category.Addition_TwentyWithoutCarry_MissingSecond,
    Category.Addition_TwentyWithCarry,
    Category.Addition_TwentyWithCarry_MissingFirst,
    Category.Addition_TwentyWithCarry_MissingSecond,
    Category.Addition_TwentyMixed,
    Category.Addition_TwentyMixed_MissingFirst,
    Category.Addition_TwentyMixed_MissingSecond,
    Category.Addition_HundredWithoutCarry,
    Category.Addition_HundredWithoutCarry_MissingFirst,
    Category.Addition_HundredWithoutCarry_MissingSecond,
    Category.Addition_HundredWithCarry,
    Category.Addition_HundredWithCarry_MissingFirst,
    Category.Addition_HundredWithCarry_MissingSecond,
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
    Category.Subtraction_HundredWithoutBorrow_MissingFirst,
    Category.Subtraction_HundredWithoutBorrow_MissingSecond,
    Category.Subtraction_HundredWithBorrow,
    Category.Subtraction_HundredWithBorrow_MissingFirst,
    Category.Subtraction_HundredWithBorrow_MissingSecond,
  ],
  Multiplication: [Category.Multiplication_Ten, Category.Multiplication_Twenty],
  Division: [Category.Division_Ten, Category.Division_Twenty],
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
