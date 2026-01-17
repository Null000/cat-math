import { Category } from "./common.js";
const generateProps = {
    [Category.Division_Ten]: { answerMax: 10, divisorMax: 10 },
    [Category.Division_Twenty]: { answerMax: 20, divisorMax: 20 },
    [Category.Division_Lia]: { answerMax: 10, divisorMax: 10 },
};
export function generate(category) {
    const props = generateProps[category];
    const { answerMax, divisorMax } = props;
    const allProblems = [];
    for (let answer = 0; answer <= answerMax; answer++) {
        for (let divisor = 1; divisor <= divisorMax; divisor++) {
            if (divisor === 8 || divisor === 9) {
                continue;
            }
            const dividend = answer * divisor;
            allProblems.push({
                id: `${category}_${dividend}_${divisor}`,
                text: `${dividend} / ${divisor} = ?`,
                answer,
            });
        }
    }
    return allProblems;
}
//# sourceMappingURL=division.js.map