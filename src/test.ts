import { Category, Problem } from "./common.ts";

export function generate(category: Category): Problem[] {
    return [
        { id: "test-1", text: "1", answer: 1 },
        { id: "test-2", text: "2", answer: 2 },
        { id: "test-3", text: "3", answer: 3 },
    ];
}
