import { Category, Problem } from "./common.ts";

const generateProps: Record<
    string,
    {
        max: number;
        min?: number;
    }
> = {
    [Category.NextPrevious_Ten]: { max: 10, min: 0 },
    [Category.NextPrevious_Twenty]: { max: 20, min: 0 },
};

export function generate(category: Category): Problem[] {
    const props = generateProps[category]!;
    let { max, min } = props;
    min = min ?? 0;

    const allProblems: Problem[] = [];

    for (let i = min; i <= max; i++) {
        // Previous fact
        if (i > min) {
            allProblems.push({
                id: `${category}_${i}_prev`,
                text: `?, ${i}`,
                answer: i - 1,
            });
        }

        // Next fact
        if (i < max) {
            allProblems.push({
                id: `${category}_${i}_next`,
                text: `${i}, ?`,
                answer: i + 1,
            });
        }
    }

    return allProblems;
}
