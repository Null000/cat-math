export var Category;
(function (Category) {
    Category["Addition_Ten"] = "Addition: 10";
    Category["Addition_Ten_MissingFirst"] = "Addition: 10 (missing first)";
    Category["Addition_Ten_MissingSecond"] = "Addition: 10 (missing second)";
    Category["Addition_TwentyWithoutCarry"] = "Addition: 20 (without carry)";
    Category["Addition_TwentyWithCarry"] = "Addition: 20 (with carry)";
    Category["Addition_TwentyMixed"] = "Addition: 20 (mixed)";
    Category["Addition_TwentyMixed_MissingFirst"] = "Addition: 20 (mixed, missing first)";
    Category["Addition_TwentyMixed_MissingSecond"] = "Addition: 20 (mixed, missing second)";
    Category["Addition_HundredWithoutCarry"] = "Addition: 100 (without carry)";
    Category["Addition_HundredWithCarry"] = "Addition: 100 (with carry)";
    Category["Addition_HundredMixed"] = "Addition: 100 (mixed)";
    Category["Addition_HundredMixed_MissingFirst"] = "Addition: 100 (mixed, missing first)";
    Category["Addition_HundredMixed_MissingSecond"] = "Addition: 100 (mixed, missing second)";
    Category["Subtraction_Ten"] = "Subtraction: 10";
    Category["Subtraction_Ten_MissingFirst"] = "Subtraction: 10 (missing first)";
    Category["Subtraction_Ten_MissingSecond"] = "Subtraction: 10 (missing second)";
    Category["Subtraction_Twenty"] = "Subtraction: 20";
    Category["Subtraction_Twenty_MissingFirst"] = "Subtraction: 20 (missing first)";
    Category["Subtraction_Twenty_MissingSecond"] = "Subtraction: 20 (missing second)";
    Category["Subtraction_HundredWithoutBorrow"] = "Subtraction: 100 (without borrow)";
    Category["Subtraction_HundredWithBorrow"] = "Subtraction: 100 (with borrow)";
    Category["Subtraction_HundredMixed"] = "Subtraction: 100 (mixed)";
    Category["Subtraction_HundredMixed_MissingFirst"] = "Subtraction: 100 (mixed, missing first)";
    Category["Subtraction_HundredMixed_MissingSecond"] = "Subtraction: 100 (mixed, missing second)";
    Category["Multiplication_Ten"] = "Multiplication: 10";
    Category["Multiplication_Twenty"] = "Multiplication: 20";
    Category["Multiplication_Lia"] = "Multiplication Lia";
    Category["Division_Ten"] = "Division: 10";
    Category["Division_Twenty"] = "Division: 20";
    Category["Division_Lia"] = "Division Lia";
})(Category || (Category = {}));
export const categoryGroups = {
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
    Multiplication: [Category.Multiplication_Ten, Category.Multiplication_Twenty, Category.Multiplication_Lia],
    Division: [Category.Division_Ten, Category.Division_Twenty, Category.Division_Lia],
};
export const categoryToGroup = (() => {
    const dict = {};
    for (const group in categoryGroups) {
        for (const category of categoryGroups[group]) {
            dict[category] = group;
        }
    }
    return dict;
})();
//# sourceMappingURL=common.js.map