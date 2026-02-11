export interface Problem {
  id: string;
  text: string;
  answer: number;
  options?: { label: string; value: number }[];
}

export enum Category {
  Addition_Ten = "Addition: 10",
  Addition_Ten_Missing = "Addition: 10 (missing facts)",
  Addition_TwentyWithoutCarry = "Addition: 20 (without carry)",
  Addition_TwentyWithCarry = "Addition: 20 (with carry)",
  Addition_Twenty = "Addition: 20",
  Addition_Twenty_Missing = "Addition: 20 (missing facts)",
  Addition_HundredWithoutCarry = "Addition: 100 (without carry)",
  Addition_HundredWithCarry = "Addition: 100 (with carry)",
  Addition_Hundred = "Addition: 100",
  Addition_Hundred_Missing = "Addition: 100 (missing facts)",
  Addition_Tens = "Addition: Tens",
  Subtraction_Ten = "Subtraction: 10",
  Subtraction_Ten_Missing = "Subtraction: 10 (missing facts)",
  Subtraction_Twenty = "Subtraction: 20",
  Subtraction_Twenty_Missing = "Subtraction: 20 (missing facts)",
  Subtraction_HundredWithoutBorrow = "Subtraction: 100 (without borrow)",
  Subtraction_HundredWithBorrow = "Subtraction: 100 (with borrow)",
  Subtraction_Hundred = "Subtraction: 100",
  Subtraction_Hundred_Missing = "Subtraction: 100 (missing facts)",
  Subtraction_Tens = "Subtraction: Tens",
  Multiplication_Ten = "Multiplication: 10",
  Multiplication_Ten_Missing = "Multiplication: 10 (missing facts)",
  Multiplication_Twenty = "Multiplication: 20",
  Multiplication_Twenty_Missing = "Multiplication: 20 (missing facts)",
  Division_Ten = "Division: 10",
  Division_Ten_Missing = "Division: 10 (missing facts)",
  Division_Twenty = "Division: 20",
  Division_Twenty_Missing = "Division: 20 (missing facts)",
  Comparison_Ten = "Comparison: 10",
  Comparison_Twenty = "Comparison: 20",
  Comparison_Hundred = "Comparison: 100",
  Test = "test"
}

export const categoryGroups: Record<string, Category[]> = {
  Addition: [
    Category.Addition_Ten,
    Category.Addition_Ten_Missing,
    Category.Addition_TwentyWithoutCarry,
    Category.Addition_TwentyWithCarry,
    Category.Addition_Twenty,
    Category.Addition_Twenty_Missing,
    Category.Addition_HundredWithoutCarry,
    Category.Addition_HundredWithCarry,
    Category.Addition_Hundred,
    Category.Addition_Hundred_Missing,
    Category.Addition_Tens,
  ],
  Subtraction: [
    Category.Subtraction_Ten,
    Category.Subtraction_Ten_Missing,
    Category.Subtraction_Twenty,
    Category.Subtraction_Twenty_Missing,
    Category.Subtraction_HundredWithoutBorrow,
    Category.Subtraction_HundredWithBorrow,
    Category.Subtraction_Hundred,
    Category.Subtraction_Hundred_Missing,
    Category.Subtraction_Tens,
  ],
  Multiplication: [
    Category.Multiplication_Ten,
    Category.Multiplication_Ten_Missing,
    Category.Multiplication_Twenty,
    Category.Multiplication_Twenty_Missing
  ],
  Division: [
    Category.Division_Ten,
    Category.Division_Ten_Missing,
    Category.Division_Twenty,
    Category.Division_Twenty_Missing
  ],
  Comparison: [
    Category.Comparison_Ten,
    Category.Comparison_Twenty,
    Category.Comparison_Hundred,
  ],
  Test: [
    Category.Test
  ],
};

export const yearGroupsSl: Record<string, Category[]> = {
  "1. razred": [
    Category.Addition_Ten,
    Category.Addition_Ten_Missing,
    Category.Subtraction_Ten,
    Category.Subtraction_Ten_Missing,
    Category.Comparison_Ten,
  ],
  "2. razred": [
    Category.Addition_TwentyWithoutCarry,
    Category.Addition_TwentyWithCarry,
    Category.Addition_Twenty,
    Category.Addition_Twenty_Missing,
    Category.Addition_Tens,
    Category.Subtraction_Twenty,
    Category.Subtraction_Twenty_Missing,
    Category.Subtraction_Tens,
    Category.Comparison_Twenty,
  ],
  "3. razred": [
    Category.Addition_HundredWithoutCarry,
    Category.Addition_HundredWithCarry,
    Category.Addition_Hundred,
    Category.Addition_Hundred_Missing,
    Category.Subtraction_HundredWithoutBorrow,
    Category.Subtraction_HundredWithBorrow,
    Category.Subtraction_Hundred,
    Category.Subtraction_Hundred_Missing,
    Category.Multiplication_Ten,
    Category.Multiplication_Ten_Missing,
    Category.Division_Ten,
    Category.Division_Ten_Missing,
    Category.Comparison_Hundred,
  ],
  "4. razred": [
    Category.Multiplication_Twenty,
    Category.Multiplication_Twenty_Missing,
    Category.Division_Twenty,
    Category.Division_Twenty_Missing,
  ],
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
