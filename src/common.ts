export interface Problem {
  id: string;
  text: string;
  answer: number;
}

export enum Category {
  Addition_Ten = "Addition: 10",
  Addition_TwentyWithoutCarry = "Addition: 20 (without carry)",
  Addition_TwentyWithCarry = "Addition: 20 (with carry)",
  Addition_TwentyMixed = "Addition: 20 (mixed)",
  Addition_HundredWithoutCarry = "Addition: 100 (without carry)",
  Addition_HundredWithCarry = "Addition: 100 (with carry)",
  Addition_HundredMixed = "Addition: 100 (mixed)",
  Subtraction_Ten = "Subtraction: 10",
  Subtraction_Twenty = "Subtraction: 20",
  Subtraction_HundredWithoutBorrow = "Subtraction: 100 (without borrow)",
  Subtraction_HundredWithBorrow = "Subtraction: 100 (with borrow)",
  Multiplication_Ten = "Multiplication: 10",
  Multiplication_Twenty = "Multiplication: 20",
  Multiplication_Hundred = "Multiplication: 100",
  Division_Ten = "Division: 10",
  Division_Twenty = "Division: 20",
  Division_Hundred = "Division: 100",
}
