var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// src/common.ts
var categoryGroups = {
  Addition: [
    "Addition: 10" /* Addition_Ten */,
    "Addition: 10 (missing facts)" /* Addition_Ten_Missing */,
    "Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */,
    "Addition: 20 (with carry)" /* Addition_TwentyWithCarry */,
    "Addition: 20" /* Addition_Twenty */,
    "Addition: 20 (missing facts)" /* Addition_Twenty_Missing */,
    "Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */,
    "Addition: 100 (with carry)" /* Addition_HundredWithCarry */,
    "Addition: 100" /* Addition_Hundred */,
    "Addition: 100 (missing facts)" /* Addition_Hundred_Missing */
  ],
  Subtraction: [
    "Subtraction: 10" /* Subtraction_Ten */,
    "Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */,
    "Subtraction: 20" /* Subtraction_Twenty */,
    "Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */,
    "Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */,
    "Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */,
    "Subtraction: 100" /* Subtraction_Hundred */,
    "Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */
  ],
  Multiplication: [
    "Multiplication: 10" /* Multiplication_Ten */,
    "Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */,
    "Multiplication: 20" /* Multiplication_Twenty */,
    "Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */
  ],
  Division: [
    "Division: 10" /* Division_Ten */,
    "Division: 10 (missing facts)" /* Division_Ten_Missing */,
    "Division: 20" /* Division_Twenty */,
    "Division: 20 (missing facts)" /* Division_Twenty_Missing */
  ],
  Comparison: [
    "Comparison: 10" /* Comparison_Ten */,
    "Comparison: 20" /* Comparison_Twenty */,
    "Comparison: 100" /* Comparison_Hundred */
  ],
  Test: [
    "test" /* Test */
  ]
};
var yearGroupsSl = {
  "1. razred": [
    "Addition: 10" /* Addition_Ten */,
    "Addition: 10 (missing facts)" /* Addition_Ten_Missing */,
    "Subtraction: 10" /* Subtraction_Ten */,
    "Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */,
    "Comparison: 10" /* Comparison_Ten */
  ],
  "2. razred": [
    "Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */,
    "Addition: 20 (with carry)" /* Addition_TwentyWithCarry */,
    "Addition: 20" /* Addition_Twenty */,
    "Addition: 20 (missing facts)" /* Addition_Twenty_Missing */,
    "Subtraction: 20" /* Subtraction_Twenty */,
    "Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */,
    "Comparison: 20" /* Comparison_Twenty */
  ],
  "3. razred": [
    "Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */,
    "Addition: 100 (with carry)" /* Addition_HundredWithCarry */,
    "Addition: 100" /* Addition_Hundred */,
    "Addition: 100 (missing facts)" /* Addition_Hundred_Missing */,
    "Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */,
    "Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */,
    "Subtraction: 100" /* Subtraction_Hundred */,
    "Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */,
    "Multiplication: 10" /* Multiplication_Ten */,
    "Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */,
    "Division: 10" /* Division_Ten */,
    "Division: 10 (missing facts)" /* Division_Ten_Missing */,
    "Comparison: 100" /* Comparison_Hundred */
  ],
  "4. razred": [
    "Multiplication: 20" /* Multiplication_Twenty */,
    "Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */,
    "Division: 20" /* Division_Twenty */,
    "Division: 20 (missing facts)" /* Division_Twenty_Missing */
  ]
};
var categoryToGroup = (() => {
  const dict = {};
  for (const group in categoryGroups) {
    for (const category of categoryGroups[group]) {
      dict[category] = group;
    }
  }
  return dict;
})();

// src/addition.ts
var generateProps = {
  ["Addition: 10" /* Addition_Ten */]: { xMax: 10, yMax: 10 },
  ["Addition: 10 (missing facts)" /* Addition_Ten_Missing */]: {
    xMax: 10,
    yMax: 10,
    missingFact: ["first", "second"]
  },
  ["Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: false
  },
  ["Addition: 20 (with carry)" /* Addition_TwentyWithCarry */]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: true
  },
  ["Addition: 20" /* Addition_Twenty */]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: false
  },
  ["Addition: 20 (missing facts)" /* Addition_Twenty_Missing */]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    carryAllowed: true,
    carryForced: false,
    missingFact: ["first", "second"]
  },
  ["Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: false
  },
  ["Addition: 100 (with carry)" /* Addition_HundredWithCarry */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: true
  },
  ["Addition: 100" /* Addition_Hundred */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: false
  },
  ["Addition: 100 (missing facts)" /* Addition_Hundred_Missing */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    carryAllowed: true,
    carryForced: false,
    missingFact: ["first", "second"]
  }
};
function generate(category) {
  const props = generateProps[category];
  let {
    xMax,
    yMax,
    xMin,
    yMin,
    maxResult,
    carryAllowed,
    carryForced,
    missingFact
  } = props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;
  missingFact = missingFact ?? "result";
  const allProblems = [];
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];
  for (let i = xMin;i <= xMax; i++) {
    for (let j = yMin;j <= yMax; j++) {
      const hasCarry = carryAllowed && i % 10 + j % 10 >= 10;
      if (hasCarry && !carryForced) {
        continue;
      }
      if (!hasCarry && carryForced) {
        continue;
      }
      const result = i + j;
      if (maxResult && result > maxResult) {
        continue;
      }
      for (const fact of missingFacts) {
        let text;
        let answer;
        let id;
        switch (fact) {
          case "first":
            text = `? + ${j} = ${result}`;
            answer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            text = `${i} + ? = ${result}`;
            answer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "result":
          default:
            text = `${i} + ${j} = ?`;
            answer = result;
            id = `${category}_${i}_${j}_result`;
            break;
        }
        allProblems.push({
          id,
          text,
          answer
        });
      }
    }
  }
  return allProblems;
}

// src/subtraction.ts
var generateProps2 = {
  ["Subtraction: 10" /* Subtraction_Ten */]: { xMax: 10, yMax: 10 },
  ["Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */]: {
    xMax: 10,
    yMax: 10,
    missingFact: ["first", "second"]
  },
  ["Subtraction: 20" /* Subtraction_Twenty */]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false
  },
  ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: ["first", "second"]
  },
  ["Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: false
  },
  ["Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: true
  },
  ["Subtraction: 100" /* Subtraction_Hundred */]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: false
  },
  ["Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */]: {
    xMax: 100,
    yMax: 100,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: ["first", "second"]
  }
};
function generate2(category) {
  const props = generateProps2[category];
  let { xMax, yMax, borrowAllowed, borrowForced, missingFact } = props;
  borrowAllowed = borrowAllowed ?? true;
  borrowForced = borrowForced ?? false;
  missingFact = missingFact ?? "result";
  const allProblems = [];
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];
  for (let i = 0;i <= xMax; i++) {
    for (let j = 0;j <= yMax; j++) {
      if (i < j)
        continue;
      const hasBorrow = borrowAllowed && i % 10 < j % 10;
      if (hasBorrow && !borrowForced) {
        continue;
      }
      if (!hasBorrow && borrowForced) {
        continue;
      }
      for (const fact of missingFacts) {
        let text;
        let answer;
        let id;
        switch (fact) {
          case "first":
            text = `? - ${j} = ${i - j}`;
            answer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            text = `${i} - ? = ${i - j}`;
            answer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "result":
          default:
            text = `${i} - ${j} = ?`;
            answer = i - j;
            id = `${category}_${i}_${j}_result`;
            break;
        }
        allProblems.push({
          id,
          text,
          answer
        });
      }
    }
  }
  return allProblems;
}

// src/division.ts
var generateProps3 = {
  ["Division: 10" /* Division_Ten */]: { answerMax: 10, divisorMax: 10 },
  ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: { answerMax: 10, divisorMax: 10, missingField: ["dividend", "divisor"] },
  ["Division: 20" /* Division_Twenty */]: { answerMax: 20, divisorMax: 20 },
  ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: { answerMax: 20, divisorMax: 20, missingField: ["dividend", "divisor"] }
};
function generate3(category) {
  const props = generateProps3[category];
  const { answerMax, divisorMax, missingField = "answer" } = props;
  const allProblems = [];
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];
  for (let answer = 0;answer <= answerMax; answer++) {
    for (let divisor = 1;divisor <= divisorMax; divisor++) {
      const dividend = answer * divisor;
      for (const field of missingFields) {
        let text;
        let problemAnswer;
        let id;
        switch (field) {
          case "dividend":
            text = `? / ${divisor} = ${answer}`;
            problemAnswer = dividend;
            id = `${category}_${dividend}_${divisor}_dividend`;
            break;
          case "divisor":
            if (dividend === 0)
              continue;
            text = `${dividend} / ? = ${answer}`;
            problemAnswer = divisor;
            id = `${category}_${dividend}_${divisor}_divisor`;
            break;
          case "answer":
          default:
            text = `${dividend} / ${divisor} = ?`;
            problemAnswer = answer;
            id = `${category}_${dividend}_${divisor}_answer`;
            break;
        }
        allProblems.push({
          id,
          text,
          answer: problemAnswer
        });
      }
    }
  }
  return allProblems;
}

// src/multiplication.ts
var generateProps4 = {
  ["Multiplication: 10" /* Multiplication_Ten */]: { xMax: 10, yMax: 10 },
  ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: { xMax: 10, yMax: 10, missingField: ["first", "second"] },
  ["Multiplication: 20" /* Multiplication_Twenty */]: { xMax: 20, yMax: 20 },
  ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: { xMax: 20, yMax: 20, missingField: ["first", "second"] }
};
function generate4(category) {
  const props = generateProps4[category];
  const { xMax, yMax, missingField = "answer" } = props;
  const allProblems = [];
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];
  for (let i = 0;i <= xMax; i++) {
    for (let j = 0;j <= yMax; j++) {
      for (const field of missingFields) {
        let text;
        let problemAnswer;
        let id;
        switch (field) {
          case "first":
            if (j === 0)
              continue;
            text = `? × ${j} = ${i * j}`;
            problemAnswer = i;
            id = `${category}_${i}_${j}_first`;
            break;
          case "second":
            if (i === 0)
              continue;
            text = `${i} × ? = ${i * j}`;
            problemAnswer = j;
            id = `${category}_${i}_${j}_second`;
            break;
          case "answer":
          default:
            text = `${i} × ${j} = ?`;
            problemAnswer = i * j;
            id = `${category}_${i}_${j}_answer`;
            break;
        }
        allProblems.push({
          id,
          text,
          answer: problemAnswer
        });
      }
    }
  }
  return allProblems;
}

// src/test.ts
function generate5(category) {
  return [
    { id: "test-1", text: "1", answer: 1 },
    { id: "test-2", text: "2", answer: 2 },
    { id: "test-3", text: "3", answer: 3 }
  ];
}

// src/comparison.ts
var generateProps5 = {
  ["Comparison: 10" /* Comparison_Ten */]: { max: 10 },
  ["Comparison: 20" /* Comparison_Twenty */]: { max: 20 },
  ["Comparison: 100" /* Comparison_Hundred */]: { max: 100, min: 10 }
};
var comparisonOptions = [
  { label: "<", value: -1 },
  { label: "=", value: 0 },
  { label: ">", value: 1 }
];
function generate6(category) {
  const props = generateProps5[category];
  const { max, min = 0 } = props;
  const allProblems = [];
  for (let x = min;x <= max; x++) {
    for (let y = min;y <= max; y++) {
      const answer = x < y ? -1 : x === y ? 0 : 1;
      allProblems.push({
        id: `${category}_${x}_${y}`,
        text: `${x} ? ${y}`,
        answer,
        options: comparisonOptions
      });
    }
  }
  return allProblems;
}

// src/problem.ts
var generateFnPerGroup = {
  Addition: (category) => generate(category),
  Subtraction: (category) => generate2(category),
  Multiplication: (category) => generate4(category),
  Division: (category) => generate3(category),
  Comparison: (category) => generate6(category),
  Test: (category) => generate5(category)
};
var cache = {};
function getCachedProblems(category) {
  if (!cache[category]) {
    populateCache(category);
  }
  return cache[category];
}
function populateCache(category) {
  cache[category] = generateFnPerGroup[categoryToGroup[category]](category);
}
function getRandomProblem(category) {
  const problems = getCachedProblems(category);
  return problems[Math.floor(Math.random() * problems.length)];
}
function removeSolvedProblem(category, problemId) {
  const problems = getCachedProblems(category);
  if (problems) {
    cache[category] = problems.filter((p) => p.id !== problemId);
  }
  if (cache[category]?.length === 0) {
    populateCache(category);
    return true;
  }
  return false;
}

// src/app.ts
function getProblem(categories) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  return { problem: generateProblem(category), category };
}
function generateProblem(category) {
  return getRandomProblem(category);
}
function solvedProblem(category, problemId) {
  return removeSolvedProblem(category, problemId);
}
function getCategories() {
  return categoryGroups;
}
function getYearGroupsSl() {
  return yearGroupsSl;
}
export {
  solvedProblem,
  getYearGroupsSl,
  getProblem,
  getCategories
};
