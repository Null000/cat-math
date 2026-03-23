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
    "Addition: 10 (3 numbers)" /* Addition_ThreeNumbers_Ten */,
    "Addition: 20 (3 numbers)" /* Addition_ThreeNumbers_Twenty */,
    "Addition: 100 (3 numbers)" /* Addition_ThreeNumbers_Hundred */,
    "Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */,
    "Addition: 100 (with carry)" /* Addition_HundredWithCarry */,
    "Addition: 100" /* Addition_Hundred */,
    "Addition: 100 (missing facts)" /* Addition_Hundred_Missing */,
    "Addition: Tens" /* Addition_Tens */,
    "Addition: 1000 (3 numbers)" /* Addition_ThreeNumbers_Thousand */,
    "Addition: 1000 (without carry)" /* Addition_ThousandWithoutCarry */,
    "Addition: 1000 (with carry)" /* Addition_ThousandWithCarry */,
    "Addition: 1000" /* Addition_Thousand */,
    "Addition: Hundreds" /* Addition_Hundreds */
  ],
  Subtraction: [
    "Subtraction: 10" /* Subtraction_Ten */,
    "Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */,
    "Subtraction: 20" /* Subtraction_Twenty */,
    "Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */,
    "Subtraction: 10 (3 numbers)" /* Subtraction_ThreeNumbers_Ten */,
    "Subtraction: 20 (3 numbers)" /* Subtraction_ThreeNumbers_Twenty */,
    "Subtraction: 100 (3 numbers)" /* Subtraction_ThreeNumbers_Hundred */,
    "Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */,
    "Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */,
    "Subtraction: 100" /* Subtraction_Hundred */,
    "Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */,
    "Subtraction: Tens" /* Subtraction_Tens */,
    "Subtraction: 1000 (3 numbers)" /* Subtraction_ThreeNumbers_Thousand */,
    "Subtraction: 1000 (without borrow)" /* Subtraction_ThousandWithoutBorrow */,
    "Subtraction: 1000 (with borrow)" /* Subtraction_ThousandWithBorrow */,
    "Subtraction: 1000" /* Subtraction_Thousand */,
    "Subtraction: Hundreds" /* Subtraction_Hundreds */
  ],
  Mixed: [
    "Mixed +/-: 10 (3 numbers)" /* Mixed_ThreeNumbers_Ten */,
    "Mixed +/-: 20 (3 numbers)" /* Mixed_ThreeNumbers_Twenty */,
    "Mixed +/-: 100 (3 numbers)" /* Mixed_ThreeNumbers_Hundred */,
    "Mixed +/-: 1000 (3 numbers)" /* Mixed_ThreeNumbers_Thousand */
  ],
  Multiplication: [
    "Multiplication: 10" /* Multiplication_Ten */,
    "Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */,
    "Multiplication: 20" /* Multiplication_Twenty */,
    "Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */,
    "Multiplication: 100" /* Multiplication_Hundred */,
    "Multiplication: 100 (missing facts)" /* Multiplication_Hundred_Missing */
  ],
  Division: [
    "Division: 10" /* Division_Ten */,
    "Division: 10 (missing facts)" /* Division_Ten_Missing */,
    "Division: 20" /* Division_Twenty */,
    "Division: 20 (missing facts)" /* Division_Twenty_Missing */,
    "Division: 100" /* Division_Hundred */,
    "Division: 100 (missing facts)" /* Division_Hundred_Missing */
  ],
  Comparison: [
    "Comparison: 10" /* Comparison_Ten */,
    "Comparison: 20" /* Comparison_Twenty */,
    "Comparison: 100" /* Comparison_Hundred */,
    "Comparison: 1000" /* Comparison_Thousand */
  ],
  NumberText: [
    "Number to Text: 10" /* NumberToText_Ten */,
    "Text to Number: 10" /* TextToNumber_Ten */,
    "Number to Text: 20" /* NumberToText_Twenty */,
    "Text to Number: 20" /* TextToNumber_Twenty */,
    "Number to Text: 100" /* NumberToText_Hundred */,
    "Text to Number: 100" /* TextToNumber_Hundred */,
    "Number to Text: 1000" /* NumberToText_Thousand */,
    "Text to Number: 1000" /* TextToNumber_Thousand */
  ],
  NextPrevious: [
    "Next/Previous: 10" /* NextPrevious_Ten */,
    "Next/Previous: 20" /* NextPrevious_Twenty */
  ],
  Test: ["test" /* Test */]
};
var yearGroupsSl = {
  "1. razred": [
    "Next/Previous: 10" /* NextPrevious_Ten */,
    "Next/Previous: 20" /* NextPrevious_Twenty */,
    "Addition: 10" /* Addition_Ten */,
    "Addition: 10 (missing facts)" /* Addition_Ten_Missing */,
    "Addition: 10 (3 numbers)" /* Addition_ThreeNumbers_Ten */,
    "Subtraction: 10" /* Subtraction_Ten */,
    "Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */,
    "Subtraction: 10 (3 numbers)" /* Subtraction_ThreeNumbers_Ten */,
    "Mixed +/-: 10 (3 numbers)" /* Mixed_ThreeNumbers_Ten */,
    "Comparison: 10" /* Comparison_Ten */,
    "Comparison: 20" /* Comparison_Twenty */,
    "Number to Text: 10" /* NumberToText_Ten */,
    "Text to Number: 10" /* TextToNumber_Ten */,
    "Number to Text: 20" /* NumberToText_Twenty */,
    "Text to Number: 20" /* TextToNumber_Twenty */
  ],
  "2. razred": [
    "Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */,
    "Addition: 20 (with carry)" /* Addition_TwentyWithCarry */,
    "Addition: 20" /* Addition_Twenty */,
    "Addition: 20 (missing facts)" /* Addition_Twenty_Missing */,
    "Addition: 20 (3 numbers)" /* Addition_ThreeNumbers_Twenty */,
    "Addition: Tens" /* Addition_Tens */,
    "Subtraction: 20" /* Subtraction_Twenty */,
    "Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */,
    "Subtraction: 20 (3 numbers)" /* Subtraction_ThreeNumbers_Twenty */,
    "Mixed +/-: 20 (3 numbers)" /* Mixed_ThreeNumbers_Twenty */,
    "Subtraction: Tens" /* Subtraction_Tens */,
    "Number to Text: 100" /* NumberToText_Hundred */,
    "Text to Number: 100" /* TextToNumber_Hundred */
  ],
  "3. razred": [
    "Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */,
    "Addition: 100 (with carry)" /* Addition_HundredWithCarry */,
    "Addition: 100" /* Addition_Hundred */,
    "Addition: 100 (missing facts)" /* Addition_Hundred_Missing */,
    "Addition: 100 (3 numbers)" /* Addition_ThreeNumbers_Hundred */,
    "Addition: Hundreds" /* Addition_Hundreds */,
    "Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */,
    "Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */,
    "Subtraction: 100" /* Subtraction_Hundred */,
    "Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */,
    "Subtraction: 100 (3 numbers)" /* Subtraction_ThreeNumbers_Hundred */,
    "Mixed +/-: 100 (3 numbers)" /* Mixed_ThreeNumbers_Hundred */,
    "Subtraction: Hundreds" /* Subtraction_Hundreds */,
    "Multiplication: 10" /* Multiplication_Ten */,
    "Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */,
    "Division: 10" /* Division_Ten */,
    "Division: 10 (missing facts)" /* Division_Ten_Missing */,
    "Comparison: 100" /* Comparison_Hundred */,
    "Number to Text: 1000" /* NumberToText_Thousand */,
    "Text to Number: 1000" /* TextToNumber_Thousand */
  ],
  "4. razred": [
    "Addition: 1000 (without carry)" /* Addition_ThousandWithoutCarry */,
    "Addition: 1000 (with carry)" /* Addition_ThousandWithCarry */,
    "Addition: 1000" /* Addition_Thousand */,
    "Addition: 1000 (3 numbers)" /* Addition_ThreeNumbers_Thousand */,
    "Subtraction: 1000 (without borrow)" /* Subtraction_ThousandWithoutBorrow */,
    "Subtraction: 1000 (with borrow)" /* Subtraction_ThousandWithBorrow */,
    "Subtraction: 1000" /* Subtraction_Thousand */,
    "Subtraction: 1000 (3 numbers)" /* Subtraction_ThreeNumbers_Thousand */,
    "Mixed +/-: 1000 (3 numbers)" /* Mixed_ThreeNumbers_Thousand */,
    "Multiplication: 20" /* Multiplication_Twenty */,
    "Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */,
    "Division: 20" /* Division_Twenty */,
    "Division: 20 (missing facts)" /* Division_Twenty_Missing */,
    "Comparison: 1000" /* Comparison_Thousand */
  ],
  "5. razred": [
    "Multiplication: 100" /* Multiplication_Hundred */,
    "Multiplication: 100 (missing facts)" /* Multiplication_Hundred_Missing */,
    "Division: 100" /* Division_Hundred */,
    "Division: 100 (missing facts)" /* Division_Hundred_Missing */
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
function makeGenerator(enumerate) {
  const countCache = new Map;
  return {
    count(category) {
      let c = countCache.get(category);
      if (c === undefined) {
        c = enumerate(category, -1).count;
        countCache.set(category, c);
      }
      return c;
    },
    getProblem(category, n) {
      return enumerate(category, n).problem;
    }
  };
}

// src/addition.ts
var exports_addition = {};
__export(exports_addition, {
  getProblem: () => getProblem,
  count: () => count
});
var generateProps = {
  ["Addition: 10" /* Addition_Ten */]: { xMax: 10, yMax: 10 },
  ["Addition: 10 (3 numbers)" /* Addition_ThreeNumbers_Ten */]: {
    xMax: 10,
    yMax: 10,
    maxResult: 10,
    threeNumbers: true
  },
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
  ["Addition: 20 (3 numbers)" /* Addition_ThreeNumbers_Twenty */]: {
    xMax: 20,
    yMax: 20,
    maxResult: 20,
    threeNumbers: true
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
  ["Addition: 100 (3 numbers)" /* Addition_ThreeNumbers_Hundred */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 10,
    maxResult: 100,
    threeNumbers: true
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
  },
  ["Addition: Tens" /* Addition_Tens */]: {
    xMax: 90,
    yMax: 90,
    xMin: 10,
    yMin: 10,
    step: 10,
    maxResult: 100
  },
  ["Addition: 1000 (3 numbers)" /* Addition_ThreeNumbers_Thousand */]: {
    xMax: 990,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    maxResult: 1000,
    threeNumbers: true
  },
  ["Addition: 1000 (without carry)" /* Addition_ThousandWithoutCarry */]: {
    xMax: 990,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    maxResult: 1000,
    carryAllowed: false
  },
  ["Addition: 1000 (with carry)" /* Addition_ThousandWithCarry */]: {
    xMax: 990,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    maxResult: 1000,
    carryAllowed: true,
    carryForced: true
  },
  ["Addition: 1000" /* Addition_Thousand */]: {
    xMax: 990,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    maxResult: 1000,
    carryAllowed: true,
    carryForced: false
  },
  ["Addition: Hundreds" /* Addition_Hundreds */]: {
    xMax: 900,
    yMax: 900,
    xMin: 100,
    yMin: 100,
    step: 100,
    maxResult: 1000
  }
};
function makeProblem(category, i, j, fact) {
  const result = i + j;
  switch (fact) {
    case "first":
      return {
        id: `${category}_${i}_${j}_first`,
        text: `? + ${j} = ${result}`,
        answer: i
      };
    case "second":
      return {
        id: `${category}_${i}_${j}_second`,
        text: `${i} + ? = ${result}`,
        answer: j
      };
    case "result":
      return {
        id: `${category}_${i}_${j}_result`,
        text: `${i} + ${j} = ?`,
        answer: result
      };
  }
}
function makeThreeNumberProblem(category, i, j, k) {
  return {
    id: `${category}_${i}_${j}_${k}_result`,
    text: `${i} + ${j} + ${k} = ?`,
    answer: i + j + k
  };
}
function enumerate(category, targetIndex) {
  const props = generateProps[category];
  let {
    xMax,
    yMax,
    xMin,
    yMin,
    step,
    maxResult,
    carryAllowed,
    carryForced,
    missingFact
  } = props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  step = step ?? 1;
  carryAllowed = carryAllowed ?? true;
  carryForced = carryForced ?? false;
  missingFact = missingFact ?? "result";
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];
  let idx = 0;
  for (let i = xMin;i <= xMax; i += step) {
    for (let j = yMin;j <= yMax; j += step) {
      if (props.threeNumbers) {
        const currentSum = i + j;
        if (maxResult && currentSum > maxResult)
          continue;
        for (let k = yMin;maxResult ? k <= maxResult : k <= yMax; k += step) {
          const result2 = currentSum + k;
          if (maxResult && result2 > maxResult)
            continue;
          if (idx === targetIndex) {
            return { problem: makeThreeNumberProblem(category, i, j, k), count: idx };
          }
          idx++;
        }
        continue;
      }
      const digitI = Math.floor(i / step) % 10;
      const digitJ = Math.floor(j / step) % 10;
      const hasCarry = carryAllowed && digitI + digitJ >= 10;
      if (hasCarry && !carryForced)
        continue;
      if (!hasCarry && carryForced)
        continue;
      const result = i + j;
      if (maxResult && result > maxResult)
        continue;
      for (const fact of missingFacts) {
        if (idx === targetIndex) {
          return { problem: makeProblem(category, i, j, fact), count: idx };
        }
        idx++;
      }
    }
  }
  return { count: idx };
}
var { count, getProblem } = makeGenerator(enumerate);

// src/subtraction.ts
var exports_subtraction = {};
__export(exports_subtraction, {
  getProblem: () => getProblem2,
  count: () => count2
});
var generateProps2 = {
  ["Subtraction: 10" /* Subtraction_Ten */]: { xMax: 10, yMax: 10 },
  ["Subtraction: 10 (3 numbers)" /* Subtraction_ThreeNumbers_Ten */]: {
    xMax: 10,
    yMax: 10,
    threeNumbers: true
  },
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
  ["Subtraction: 20 (3 numbers)" /* Subtraction_ThreeNumbers_Twenty */]: {
    xMax: 20,
    yMax: 20,
    threeNumbers: true
  },
  ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: {
    xMax: 20,
    yMax: 20,
    borrowAllowed: true,
    borrowForced: false,
    missingFact: ["first", "second"]
  },
  ["Subtraction: 100 (3 numbers)" /* Subtraction_ThreeNumbers_Hundred */]: {
    xMax: 100,
    yMax: 100,
    xMin: 10,
    yMin: 1,
    threeNumbers: true
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
  },
  ["Subtraction: Tens" /* Subtraction_Tens */]: {
    xMax: 100,
    yMax: 90,
    xMin: 10,
    yMin: 10,
    step: 10
  },
  ["Subtraction: 1000 (3 numbers)" /* Subtraction_ThreeNumbers_Thousand */]: {
    xMax: 1000,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    threeNumbers: true
  },
  ["Subtraction: 1000 (without borrow)" /* Subtraction_ThousandWithoutBorrow */]: {
    xMax: 1000,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    borrowAllowed: false
  },
  ["Subtraction: 1000 (with borrow)" /* Subtraction_ThousandWithBorrow */]: {
    xMax: 1000,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    borrowAllowed: true,
    borrowForced: true
  },
  ["Subtraction: 1000" /* Subtraction_Thousand */]: {
    xMax: 1000,
    yMax: 990,
    xMin: 100,
    yMin: 100,
    step: 10,
    borrowAllowed: true,
    borrowForced: false
  },
  ["Subtraction: Hundreds" /* Subtraction_Hundreds */]: {
    xMax: 1000,
    yMax: 900,
    xMin: 100,
    yMin: 100,
    step: 100
  }
};
function makeProblem2(category, i, j, fact) {
  switch (fact) {
    case "first":
      return {
        id: `${category}_${i}_${j}_first`,
        text: `? - ${j} = ${i - j}`,
        answer: i
      };
    case "second":
      return {
        id: `${category}_${i}_${j}_second`,
        text: `${i} - ? = ${i - j}`,
        answer: j
      };
    case "result":
      return {
        id: `${category}_${i}_${j}_result`,
        text: `${i} - ${j} = ?`,
        answer: i - j
      };
  }
}
function makeThreeNumberProblem2(category, i, j, k) {
  return {
    id: `${category}_${i}_${j}_${k}_result`,
    text: `${i} - ${j} - ${k} = ?`,
    answer: i - j - k
  };
}
function enumerate2(category, targetIndex) {
  const props = generateProps2[category];
  let {
    xMax,
    yMax,
    xMin,
    yMin,
    step,
    borrowAllowed,
    borrowForced,
    missingFact
  } = props;
  xMin = xMin ?? 0;
  yMin = yMin ?? 0;
  step = step ?? 1;
  borrowAllowed = borrowAllowed ?? true;
  borrowForced = borrowForced ?? false;
  missingFact = missingFact ?? "result";
  const missingFacts = Array.isArray(missingFact) ? missingFact : [missingFact];
  let idx = 0;
  for (let i = xMin;i <= xMax; i += step) {
    for (let j = yMin;j <= yMax; j += step) {
      if (i < j)
        continue;
      if (props.threeNumbers) {
        const currentDiff = i - j;
        for (let k = yMin;k <= yMax; k += step) {
          if (currentDiff < k)
            continue;
          if (idx === targetIndex) {
            return { problem: makeThreeNumberProblem2(category, i, j, k), count: idx };
          }
          idx++;
        }
        continue;
      }
      const digitI = Math.floor(i / step) % 10;
      const digitJ = Math.floor(j / step) % 10;
      const hasBorrow = borrowAllowed && digitI < digitJ;
      if (hasBorrow && !borrowForced)
        continue;
      if (!hasBorrow && borrowForced)
        continue;
      for (const fact of missingFacts) {
        if (idx === targetIndex) {
          return { problem: makeProblem2(category, i, j, fact), count: idx };
        }
        idx++;
      }
    }
  }
  return { count: idx };
}
var { count: count2, getProblem: getProblem2 } = makeGenerator(enumerate2);

// src/division.ts
var exports_division = {};
__export(exports_division, {
  getProblem: () => getProblem3,
  count: () => count3
});
var generateProps3 = {
  ["Division: 10" /* Division_Ten */]: { answerMax: 10, divisorMax: 10 },
  ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: {
    answerMax: 10,
    divisorMax: 10,
    missingField: ["dividend", "divisor"]
  },
  ["Division: 20" /* Division_Twenty */]: { answerMax: 20, divisorMax: 20 },
  ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: {
    answerMax: 20,
    divisorMax: 20,
    missingField: ["dividend", "divisor"]
  },
  ["Division: 100" /* Division_Hundred */]: { answerMax: 100, divisorMax: 9 },
  ["Division: 100 (missing facts)" /* Division_Hundred_Missing */]: {
    answerMax: 100,
    divisorMax: 9,
    missingField: ["dividend", "divisor"]
  }
};
function makeProblem3(category, dividend, divisor, answer, field) {
  switch (field) {
    case "dividend":
      return {
        id: `${category}_${dividend}_${divisor}_dividend`,
        text: `? / ${divisor} = ${answer}`,
        answer: dividend
      };
    case "divisor":
      return {
        id: `${category}_${dividend}_${divisor}_divisor`,
        text: `${dividend} / ? = ${answer}`,
        answer: divisor
      };
    case "answer":
      return {
        id: `${category}_${dividend}_${divisor}_answer`,
        text: `${dividend} / ${divisor} = ?`,
        answer
      };
  }
}
function enumerate3(category, targetIndex) {
  const props = generateProps3[category];
  const { answerMax, divisorMax, missingField = "answer" } = props;
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];
  let idx = 0;
  for (let answer = 0;answer <= answerMax; answer++) {
    for (let divisor = 1;divisor <= divisorMax; divisor++) {
      const dividend = answer * divisor;
      for (const field of missingFields) {
        if (field === "divisor" && dividend === 0)
          continue;
        if (idx === targetIndex) {
          return { problem: makeProblem3(category, dividend, divisor, answer, field), count: idx };
        }
        idx++;
      }
    }
  }
  return { count: idx };
}
var { count: count3, getProblem: getProblem3 } = makeGenerator(enumerate3);

// src/multiplication.ts
var exports_multiplication = {};
__export(exports_multiplication, {
  getProblem: () => getProblem4,
  count: () => count4
});
var generateProps4 = {
  ["Multiplication: 10" /* Multiplication_Ten */]: { xMax: 10, yMax: 10 },
  ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: {
    xMax: 10,
    yMax: 10,
    missingField: ["first", "second"]
  },
  ["Multiplication: 20" /* Multiplication_Twenty */]: { xMax: 20, yMax: 20 },
  ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: {
    xMax: 20,
    yMax: 20,
    missingField: ["first", "second"]
  },
  ["Multiplication: 100" /* Multiplication_Hundred */]: { xMax: 100, yMax: 9 },
  ["Multiplication: 100 (missing facts)" /* Multiplication_Hundred_Missing */]: {
    xMax: 100,
    yMax: 9,
    missingField: ["first", "second"]
  }
};
function makeProblem4(category, i, j, field) {
  switch (field) {
    case "first":
      return {
        id: `${category}_${i}_${j}_first`,
        text: `? × ${j} = ${i * j}`,
        answer: i
      };
    case "second":
      return {
        id: `${category}_${i}_${j}_second`,
        text: `${i} × ? = ${i * j}`,
        answer: j
      };
    case "answer":
      return {
        id: `${category}_${i}_${j}_answer`,
        text: `${i} × ${j} = ?`,
        answer: i * j
      };
  }
}
function enumerate4(category, targetIndex) {
  const props = generateProps4[category];
  const { xMax, yMax, missingField = "answer" } = props;
  const missingFields = Array.isArray(missingField) ? missingField : [missingField];
  let idx = 0;
  for (let i = 0;i <= xMax; i++) {
    for (let j = 0;j <= yMax; j++) {
      for (const field of missingFields) {
        if (field === "first" && j === 0)
          continue;
        if (field === "second" && i === 0)
          continue;
        if (idx === targetIndex) {
          return { problem: makeProblem4(category, i, j, field), count: idx };
        }
        idx++;
      }
    }
  }
  return { count: idx };
}
var { count: count4, getProblem: getProblem4 } = makeGenerator(enumerate4);

// src/test.ts
var exports_test = {};
__export(exports_test, {
  getProblem: () => getProblem5,
  count: () => count5
});
var problems = [
  { id: "test-1", text: "1", answer: 1 },
  { id: "test-2", text: "2", answer: 2 },
  { id: "test-3", text: "3", answer: 3 },
  { id: "test-67", text: "67", answer: 67 }
];
function count5(_category) {
  return problems.length;
}
function getProblem5(_category, n) {
  return problems[n % problems.length];
}

// src/comparison.ts
var exports_comparison = {};
__export(exports_comparison, {
  getProblem: () => getProblem6,
  count: () => count6
});
var generateProps5 = {
  ["Comparison: 10" /* Comparison_Ten */]: { max: 10 },
  ["Comparison: 20" /* Comparison_Twenty */]: { max: 20 },
  ["Comparison: 100" /* Comparison_Hundred */]: { max: 100, min: 10 },
  ["Comparison: 1000" /* Comparison_Thousand */]: { max: 1000, min: 100, step: 10 }
};
var comparisonOptions = [
  { label: "<", value: -1 },
  { label: "=", value: 0 },
  { label: ">", value: 1 }
];
function rangeSize(category) {
  const props = generateProps5[category];
  const { max, min = 0, step = 1 } = props;
  return Math.floor((max - min) / step) + 1;
}
function count6(category) {
  const size = rangeSize(category);
  return size * size;
}
function getProblem6(category, n) {
  const props = generateProps5[category];
  const { min = 0, step = 1 } = props;
  const size = rangeSize(category);
  const xIdx = Math.floor(n / size);
  const yIdx = n % size;
  const x = min + xIdx * step;
  const y = min + yIdx * step;
  const answer = x < y ? -1 : x === y ? 0 : 1;
  return {
    id: `${category}_${x}_${y}`,
    text: `${x} ? ${y}`,
    answer,
    options: comparisonOptions
  };
}

// src/numberText.ts
var exports_numberText = {};
__export(exports_numberText, {
  getProblem: () => getProblem7,
  count: () => count7
});

// src/translations.ts
var translations = {
  en: {
    title: "Cat Math",
    select_categories: "Select Practice Categories",
    start_practice: "Start Practice",
    back_to_categories: "← Back to Categories",
    check_button: "Check",
    correct: "Correct! \uD83C\uDF89",
    incorrect: "Incorrect. \uD83D\uDE22",
    nan_error: "Please enter a number!",
    select_warning: "Please select at least one category to practice!",
    input_placeholder: "Your answer",
    examples: "Examples",
    solved: "solved",
    selected_label: "Selected:",
    next_round: "Next Round",
    end_round: "End Round",
    perfect_round: "Perfect round! Great job! \uD83C\uDF1F",
    review_header: "Problems to review:",
    your_answers: "your answers:",
    correct_answer: "Correct answer:",
    stat_correct: "Correct:",
    stat_incorrect: "Incorrect:",
    stat_accuracy: "Accuracy:",
    stat_streak: "Streak:",
    stat_best: "Best:",
    stat_time: "Time:",
    stat_avg: "Avg:",
    stat_median: "Median:",
    ["Addition: 10" /* Addition_Ten */]: "Addition: 10",
    ["Addition: 10 (missing facts)" /* Addition_Ten_Missing */]: "Addition: 10 (missing facts)",
    ["Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */]: "Addition: 20 (without carry)",
    ["Addition: 20 (with carry)" /* Addition_TwentyWithCarry */]: "Addition: 20 (with carry)",
    ["Addition: 20" /* Addition_Twenty */]: "Addition: 20",
    ["Addition: 20 (missing facts)" /* Addition_Twenty_Missing */]: "Addition: 20 (missing facts)",
    ["Addition: 10 (3 numbers)" /* Addition_ThreeNumbers_Ten */]: "Addition: 10 (3 numbers)",
    ["Addition: 20 (3 numbers)" /* Addition_ThreeNumbers_Twenty */]: "Addition: 20 (3 numbers)",
    ["Addition: 100 (3 numbers)" /* Addition_ThreeNumbers_Hundred */]: "Addition: 100 (3 numbers)",
    ["Addition: 1000 (3 numbers)" /* Addition_ThreeNumbers_Thousand */]: "Addition: 1000 (3 numbers)",
    ["Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */]: "Addition: 100 (without carry)",
    ["Addition: 100 (with carry)" /* Addition_HundredWithCarry */]: "Addition: 100 (with carry)",
    ["Addition: 100" /* Addition_Hundred */]: "Addition: 100",
    ["Addition: 100 (missing facts)" /* Addition_Hundred_Missing */]: "Addition: 100 (missing facts)",
    ["Addition: Tens" /* Addition_Tens */]: "Addition: Tens",
    ["Addition: 1000 (without carry)" /* Addition_ThousandWithoutCarry */]: "Addition: 1000 (without carry)",
    ["Addition: 1000 (with carry)" /* Addition_ThousandWithCarry */]: "Addition: 1000 (with carry)",
    ["Addition: 1000" /* Addition_Thousand */]: "Addition: 1000",
    ["Addition: Hundreds" /* Addition_Hundreds */]: "Addition: Hundreds",
    ["Subtraction: 10" /* Subtraction_Ten */]: "Subtraction: 10",
    ["Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */]: "Subtraction: 10 (missing facts)",
    ["Subtraction: 20" /* Subtraction_Twenty */]: "Subtraction: 20",
    ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: "Subtraction: 20 (missing facts)",
    ["Subtraction: 10 (3 numbers)" /* Subtraction_ThreeNumbers_Ten */]: "Subtraction: 10 (3 numbers)",
    ["Subtraction: 20 (3 numbers)" /* Subtraction_ThreeNumbers_Twenty */]: "Subtraction: 20 (3 numbers)",
    ["Subtraction: 100 (3 numbers)" /* Subtraction_ThreeNumbers_Hundred */]: "Subtraction: 100 (3 numbers)",
    ["Subtraction: 1000 (3 numbers)" /* Subtraction_ThreeNumbers_Thousand */]: "Subtraction: 1000 (3 numbers)",
    ["Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */]: "Subtraction: 100 (without borrow)",
    ["Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */]: "Subtraction: 100 (with borrow)",
    ["Subtraction: 100" /* Subtraction_Hundred */]: "Subtraction: 100",
    ["Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */]: "Subtraction: 100 (missing facts)",
    ["Subtraction: Tens" /* Subtraction_Tens */]: "Subtraction: Tens",
    ["Subtraction: 1000 (without borrow)" /* Subtraction_ThousandWithoutBorrow */]: "Subtraction: 1000 (without borrow)",
    ["Subtraction: 1000 (with borrow)" /* Subtraction_ThousandWithBorrow */]: "Subtraction: 1000 (with borrow)",
    ["Subtraction: 1000" /* Subtraction_Thousand */]: "Subtraction: 1000",
    ["Subtraction: Hundreds" /* Subtraction_Hundreds */]: "Subtraction: Hundreds",
    ["Mixed +/-: 10 (3 numbers)" /* Mixed_ThreeNumbers_Ten */]: "Mixed +/-: 10 (3 numbers)",
    ["Mixed +/-: 20 (3 numbers)" /* Mixed_ThreeNumbers_Twenty */]: "Mixed +/-: 20 (3 numbers)",
    ["Mixed +/-: 100 (3 numbers)" /* Mixed_ThreeNumbers_Hundred */]: "Mixed +/-: 100 (3 numbers)",
    ["Mixed +/-: 1000 (3 numbers)" /* Mixed_ThreeNumbers_Thousand */]: "Mixed +/-: 1000 (3 numbers)",
    ["Multiplication: 10" /* Multiplication_Ten */]: "Multiplication: 10",
    ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: "Multiplication: 10 (missing facts)",
    ["Multiplication: 20" /* Multiplication_Twenty */]: "Multiplication: 20",
    ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: "Multiplication: 20 (missing facts)",
    ["Division: 10" /* Division_Ten */]: "Division: 10",
    ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: "Division: 10 (missing facts)",
    ["Division: 20" /* Division_Twenty */]: "Division: 20",
    ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: "Division: 20 (missing facts)",
    ["Division: 100" /* Division_Hundred */]: "Division: 100",
    ["Division: 100 (missing facts)" /* Division_Hundred_Missing */]: "Division: 100 (missing facts)",
    ["Multiplication: 100" /* Multiplication_Hundred */]: "Multiplication: 100",
    ["Multiplication: 100 (missing facts)" /* Multiplication_Hundred_Missing */]: "Multiplication: 100 (missing facts)",
    ["Comparison: 10" /* Comparison_Ten */]: "Comparison: 10",
    ["Comparison: 20" /* Comparison_Twenty */]: "Comparison: 20",
    ["Comparison: 100" /* Comparison_Hundred */]: "Comparison: 100",
    ["Comparison: 1000" /* Comparison_Thousand */]: "Comparison: 1000",
    ["Number to Text: 10" /* NumberToText_Ten */]: "Number to Text: 10",
    ["Text to Number: 10" /* TextToNumber_Ten */]: "Text to Number: 10",
    ["Number to Text: 20" /* NumberToText_Twenty */]: "Number to Text: 20",
    ["Text to Number: 20" /* TextToNumber_Twenty */]: "Text to Number: 20",
    ["Number to Text: 100" /* NumberToText_Hundred */]: "Number to Text: 100",
    ["Text to Number: 100" /* TextToNumber_Hundred */]: "Text to Number: 100",
    ["Number to Text: 1000" /* NumberToText_Thousand */]: "Number to Text: 1000",
    ["Text to Number: 1000" /* TextToNumber_Thousand */]: "Text to Number: 1000",
    number_0: "zero",
    number_1: "one",
    number_2: "two",
    number_3: "three",
    number_4: "four",
    number_5: "five",
    number_6: "six",
    number_7: "seven",
    number_8: "eight",
    number_9: "nine",
    number_10: "ten",
    number_11: "eleven",
    number_12: "twelve",
    number_13: "thirteen",
    number_14: "fourteen",
    number_15: "fifteen",
    number_16: "sixteen",
    number_17: "seventeen",
    number_18: "eighteen",
    number_19: "nineteen",
    number_20: "twenty",
    ["Next/Previous: 10" /* NextPrevious_Ten */]: "Next/Previous: 10",
    ["Next/Previous: 20" /* NextPrevious_Twenty */]: "Next/Previous: 20",
    group_Addition: "Addition",
    group_Subtraction: "Subtraction",
    group_Mixed: "Mixed +/-",
    group_Multiplication: "Multiplication",
    group_Division: "Division",
    group_Comparison: "Comparison",
    group_NumberText: "Number & Text",
    group_NextPrevious: "Next/Previous",
    grouping_by_type: "By Type",
    grouping_by_year: "By Year",
    rpg_title: "Choose Your Spells",
    rpg_subtitle: "Select the math spells you wish to master",
    rpg_select_categories: "Spell Book",
    rpg_start_battle: "Enter Battle",
    rpg_adventure_link: "Cat Math Adventure \uD83D\uDC08‍⬛",
    new_sticker: "NEW"
  },
  sl: {
    title: "Mačja Matematika",
    select_categories: "Izberi Kategorije",
    start_practice: "Začni Vajo",
    back_to_categories: "← Nazaj na Kategorije",
    check_button: "Preveri",
    correct: "Pravilno! \uD83C\uDF89",
    incorrect: "Nepravilno. \uD83D\uDE22",
    nan_error: "Prosim vnesi številko!",
    select_warning: "Prosim izberi vsaj eno kategorijo!",
    input_placeholder: "Tvoj odgovor",
    examples: "Primeri",
    solved: "rešeno",
    selected_label: "Izbrano:",
    next_round: "Naslednji krog",
    end_round: "Končaj krog",
    perfect_round: "Popoln krog! Odlično delo! \uD83C\uDF1F",
    review_header: "Naloge za ponovitev:",
    your_answers: "tvoji odgovori:",
    correct_answer: "Pravilni odgovor:",
    stat_correct: "Pravilno:",
    stat_incorrect: "Nepravilno:",
    stat_accuracy: "Natančnost:",
    stat_streak: "Zaporedoma:",
    stat_best: "Najboljše:",
    stat_time: "Čas:",
    stat_avg: "Povpr:",
    stat_median: "Med:",
    ["Addition: 10" /* Addition_Ten */]: "Seštevanje: 10",
    ["Addition: 10 (missing facts)" /* Addition_Ten_Missing */]: "Seštevanje: 10 (neznani člen)",
    ["Addition: 20 (without carry)" /* Addition_TwentyWithoutCarry */]: "Seštevanje: 20 (brez prehoda)",
    ["Addition: 20 (with carry)" /* Addition_TwentyWithCarry */]: "Seštevanje: 20 (s prehodom)",
    ["Addition: 20" /* Addition_Twenty */]: "Seštevanje: 20",
    ["Addition: 20 (missing facts)" /* Addition_Twenty_Missing */]: "Seštevanje: 20 (neznani člen)",
    ["Addition: 10 (3 numbers)" /* Addition_ThreeNumbers_Ten */]: "Seštevanje: 10 (3 števila)",
    ["Addition: 20 (3 numbers)" /* Addition_ThreeNumbers_Twenty */]: "Seštevanje: 20 (3 števila)",
    ["Addition: 100 (3 numbers)" /* Addition_ThreeNumbers_Hundred */]: "Seštevanje: 100 (3 števila)",
    ["Addition: 1000 (3 numbers)" /* Addition_ThreeNumbers_Thousand */]: "Seštevanje: 1000 (3 števila)",
    ["Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */]: "Seštevanje: 100 (brez prehoda)",
    ["Addition: 100 (with carry)" /* Addition_HundredWithCarry */]: "Seštevanje: 100 (s prehodom)",
    ["Addition: 100" /* Addition_Hundred */]: "Seštevanje: 100",
    ["Addition: 100 (missing facts)" /* Addition_Hundred_Missing */]: "Seštevanje: 100 (neznani člen)",
    ["Addition: Tens" /* Addition_Tens */]: "Seštevanje: desetice",
    ["Addition: 1000 (without carry)" /* Addition_ThousandWithoutCarry */]: "Seštevanje: 1000 (brez prehoda)",
    ["Addition: 1000 (with carry)" /* Addition_ThousandWithCarry */]: "Seštevanje: 1000 (s prehodom)",
    ["Addition: 1000" /* Addition_Thousand */]: "Seštevanje: 1000",
    ["Addition: Hundreds" /* Addition_Hundreds */]: "Seštevanje: stotice",
    ["Subtraction: 10" /* Subtraction_Ten */]: "Odštevanje: 10",
    ["Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */]: "Odštevanje: 10 (neznani člen)",
    ["Subtraction: 20" /* Subtraction_Twenty */]: "Odštevanje: 20",
    ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: "Odštevanje: 20 (neznani člen)",
    ["Subtraction: 10 (3 numbers)" /* Subtraction_ThreeNumbers_Ten */]: "Odštevanje: 10 (3 števila)",
    ["Subtraction: 20 (3 numbers)" /* Subtraction_ThreeNumbers_Twenty */]: "Odštevanje: 20 (3 števila)",
    ["Subtraction: 100 (3 numbers)" /* Subtraction_ThreeNumbers_Hundred */]: "Odštevanje: 100 (3 števila)",
    ["Subtraction: 1000 (3 numbers)" /* Subtraction_ThreeNumbers_Thousand */]: "Odštevanje: 1000 (3 števila)",
    ["Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */]: "Odštevanje: 100 (brez prehoda)",
    ["Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */]: "Odštevanje: 100 (s prehodom)",
    ["Subtraction: 100" /* Subtraction_Hundred */]: "Odštevanje: 100",
    ["Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */]: "Odštevanje: 100 (neznani člen)",
    ["Subtraction: Tens" /* Subtraction_Tens */]: "Odštevanje: desetice",
    ["Subtraction: 1000 (without borrow)" /* Subtraction_ThousandWithoutBorrow */]: "Odštevanje: 1000 (brez prehoda)",
    ["Subtraction: 1000 (with borrow)" /* Subtraction_ThousandWithBorrow */]: "Odštevanje: 1000 (s prehodom)",
    ["Subtraction: 1000" /* Subtraction_Thousand */]: "Odštevanje: 1000",
    ["Subtraction: Hundreds" /* Subtraction_Hundreds */]: "Odštevanje: stotice",
    ["Mixed +/-: 10 (3 numbers)" /* Mixed_ThreeNumbers_Ten */]: "Mešano +/-: 10 (3 števila)",
    ["Mixed +/-: 20 (3 numbers)" /* Mixed_ThreeNumbers_Twenty */]: "Mešano +/-: 20 (3 števila)",
    ["Mixed +/-: 100 (3 numbers)" /* Mixed_ThreeNumbers_Hundred */]: "Mešano +/-: 100 (3 števila)",
    ["Mixed +/-: 1000 (3 numbers)" /* Mixed_ThreeNumbers_Thousand */]: "Mešano +/-: 1000 (3 števila)",
    ["Multiplication: 10" /* Multiplication_Ten */]: "Množenje: 10",
    ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: "Množenje: 10 (neznani člen)",
    ["Multiplication: 20" /* Multiplication_Twenty */]: "Množenje: 20",
    ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: "Množenje: 20 (neznani člen)",
    ["Division: 10" /* Division_Ten */]: "Deljenje: 10",
    ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: "Deljenje: 10 (neznani člen)",
    ["Division: 20" /* Division_Twenty */]: "Deljenje: 20",
    ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: "Deljenje: 20 (neznani člen)",
    ["Division: 100" /* Division_Hundred */]: "Deljenje: 100",
    ["Division: 100 (missing facts)" /* Division_Hundred_Missing */]: "Deljenje: 100 (neznani člen)",
    ["Multiplication: 100" /* Multiplication_Hundred */]: "Množenje: 100",
    ["Multiplication: 100 (missing facts)" /* Multiplication_Hundred_Missing */]: "Množenje: 100 (neznani člen)",
    ["Comparison: 10" /* Comparison_Ten */]: "Primerjanje: 10",
    ["Comparison: 20" /* Comparison_Twenty */]: "Primerjanje: 20",
    ["Comparison: 100" /* Comparison_Hundred */]: "Primerjanje: 100",
    ["Comparison: 1000" /* Comparison_Thousand */]: "Primerjanje: 1000",
    ["Number to Text: 10" /* NumberToText_Ten */]: "Število v besedo: 10",
    ["Text to Number: 10" /* TextToNumber_Ten */]: "Beseda v število: 10",
    ["Number to Text: 20" /* NumberToText_Twenty */]: "Število v besedo: 20",
    ["Text to Number: 20" /* TextToNumber_Twenty */]: "Beseda v število: 20",
    ["Number to Text: 100" /* NumberToText_Hundred */]: "Število v besedo: 100",
    ["Text to Number: 100" /* TextToNumber_Hundred */]: "Beseda v število: 100",
    ["Number to Text: 1000" /* NumberToText_Thousand */]: "Število v besedo: 1000",
    ["Text to Number: 1000" /* TextToNumber_Thousand */]: "Beseda v število: 1000",
    number_0: "nič",
    number_1: "ena",
    number_2: "dve",
    number_3: "tri",
    number_4: "štiri",
    number_5: "pet",
    number_6: "šest",
    number_7: "sedem",
    number_8: "osem",
    number_9: "devet",
    number_10: "deset",
    number_11: "enajst",
    number_12: "dvanajst",
    number_13: "trinajst",
    number_14: "štirinajst",
    number_15: "petnajst",
    number_16: "šestnajst",
    number_17: "sedemnajst",
    number_18: "osemnajst",
    number_19: "devetnajst",
    number_20: "dvajset",
    ["Next/Previous: 10" /* NextPrevious_Ten */]: "Predhodnik/Naslednik: 10",
    ["Next/Previous: 20" /* NextPrevious_Twenty */]: "Predhodnik/Naslednik: 20",
    group_Addition: "Seštevanje",
    group_Subtraction: "Odštevanje",
    group_Mixed: "Mešano +/-",
    group_Multiplication: "Množenje",
    group_Division: "Deljenje",
    group_Comparison: "Primerjanje",
    group_NumberText: "Številke in besede",
    group_NextPrevious: "Predhodnik/Naslednik",
    "group_1. razred": "1. razred",
    "group_2. razred": "2. razred",
    "group_3. razred": "3. razred",
    "group_4. razred": "4. razred",
    "group_5. razred": "5. razred",
    grouping_by_type: "Po vrsti",
    grouping_by_year: "Po razredu",
    rpg_title: "Izberi Uroke",
    rpg_subtitle: "Izberi matematične uroke za vadbo",
    rpg_select_categories: "Knjiga Urokov",
    rpg_start_battle: "Vstopi v Bitko",
    rpg_adventure_link: "Avantura Mačja Matematika \uD83D\uDC08‍⬛",
    new_sticker: "NOVO"
  }
};

// src/i18n.ts
var LOCAL_STORAGE_KEY = "math_practice_language";
var DEFAULT_LANGUAGE = "sl";
function getCurrentLanguage() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored === "en" || stored === "sl") {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}
function setLanguage(lang) {
  localStorage.setItem(LOCAL_STORAGE_KEY, lang);
  location.reload();
}
function t(key) {
  const lang = getCurrentLanguage();
  const translated = translations[lang][key];
  if (!translated) {
    console.error(`Missing translation for language ${lang} and key: ${key}`);
  }
  return translated || key;
}
function localizeProblemText(text) {
  const lang = getCurrentLanguage();
  if (lang === "sl") {
    return text.replace(/ × /g, " · ").replace(/ \/ /g, " : ");
  }
  return text.replace(/ \/ /g, " ÷ ");
}
function getCategoryDisplayName(category) {
  const lang = getCurrentLanguage();
  const translated = translations[lang][category];
  if (!translated) {
    console.error(`Missing translation for language ${lang} and category: ${category}`);
  }
  return translated || category;
}

// src/numberText.ts
var enTens = {
  20: "twenty",
  30: "thirty",
  40: "forty",
  50: "fifty",
  60: "sixty",
  70: "seventy",
  80: "eighty",
  90: "ninety"
};
var slTens = {
  20: "dvajset",
  30: "trideset",
  40: "štirideset",
  50: "petdeset",
  60: "šestdeset",
  70: "sedemdeset",
  80: "osemdeset",
  90: "devetdeset"
};
function getNumberWord(n) {
  const lang = getCurrentLanguage();
  if (n <= 20) {
    const key = `number_${n}`;
    return translations[lang][key];
  }
  if (n === 1000) {
    return lang === "sl" ? "tisoč" : "one thousand";
  }
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    let prefix = "";
    if (lang === "sl") {
      if (hundreds === 1) {
        prefix = "sto";
      } else {
        const slOnesWord = translations.sl[`number_${hundreds}`];
        prefix = slOnesWord + "sto";
      }
    } else {
      const enOnesWord = translations.en[`number_${hundreds}`];
      prefix = enOnesWord + " hundred";
    }
    if (remainder === 0)
      return prefix;
    return prefix + " " + getNumberWord(remainder);
  }
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  if (lang === "sl") {
    if (ones === 0)
      return slTens[tens];
    const onesWord = translations.sl[`number_${ones}`];
    return `${onesWord}in${slTens[tens]}`;
  } else {
    if (ones === 0)
      return enTens[tens];
    const onesWord = translations.en[`number_${ones}`];
    return `${enTens[tens]}-${onesWord}`;
  }
}
function getMaxNumber(category) {
  switch (category) {
    case "Number to Text: 10" /* NumberToText_Ten */:
    case "Text to Number: 10" /* TextToNumber_Ten */:
      return 10;
    case "Number to Text: 20" /* NumberToText_Twenty */:
    case "Text to Number: 20" /* TextToNumber_Twenty */:
      return 20;
    case "Number to Text: 100" /* NumberToText_Hundred */:
    case "Text to Number: 100" /* TextToNumber_Hundred */:
      return 100;
    case "Number to Text: 1000" /* NumberToText_Thousand */:
    case "Text to Number: 1000" /* TextToNumber_Thousand */:
      return 1000;
    default:
      return 0;
  }
}
function isNumberToText(category) {
  return category === "Number to Text: 10" /* NumberToText_Ten */ || category === "Number to Text: 20" /* NumberToText_Twenty */ || category === "Number to Text: 100" /* NumberToText_Hundred */ || category === "Number to Text: 1000" /* NumberToText_Thousand */;
}
function count7(category) {
  return getMaxNumber(category) + 1;
}
function getProblem7(category, n) {
  if (isNumberToText(category)) {
    return {
      id: `${category}_${n}`,
      text: `${n} = ?`,
      answer: getNumberWord(n)
    };
  } else {
    return {
      id: `${category}_${n}`,
      text: `${getNumberWord(n)} = ?`,
      answer: n
    };
  }
}

// src/nextPrevious.ts
var exports_nextPrevious = {};
__export(exports_nextPrevious, {
  getProblem: () => getProblem8,
  count: () => count8
});
var generateProps6 = {
  ["Next/Previous: 10" /* NextPrevious_Ten */]: { max: 10, min: 0 },
  ["Next/Previous: 20" /* NextPrevious_Twenty */]: { max: 20, min: 0 }
};
function count8(category) {
  const props = generateProps6[category];
  const min = props.min ?? 0;
  return 2 * (props.max - min);
}
function getProblem8(category, n) {
  const props = generateProps6[category];
  const min = props.min ?? 0;
  const range = props.max - min;
  if (n < range) {
    const i = min + 1 + n;
    return {
      id: `${category}_${i}_prev`,
      text: `?, ${i}`,
      answer: i - 1
    };
  } else {
    const i = min + (n - range);
    return {
      id: `${category}_${i}_next`,
      text: `${i}, ?`,
      answer: i + 1
    };
  }
}

// src/mixed.ts
var exports_mixed = {};
__export(exports_mixed, {
  getProblem: () => getProblem9,
  count: () => count9
});
var generateProps7 = {
  ["Mixed +/-: 10 (3 numbers)" /* Mixed_ThreeNumbers_Ten */]: { max: 10 },
  ["Mixed +/-: 20 (3 numbers)" /* Mixed_ThreeNumbers_Twenty */]: { max: 20 },
  ["Mixed +/-: 100 (3 numbers)" /* Mixed_ThreeNumbers_Hundred */]: { max: 100, min: 10 },
  ["Mixed +/-: 1000 (3 numbers)" /* Mixed_ThreeNumbers_Thousand */]: { max: 1000, min: 100 }
};
function patternACountForA(aPrime, R) {
  const L = R - aPrime;
  return (L + 1) * (aPrime + 1) + L * (L + 1) / 2;
}
function patternBCountForA(aPrime, R) {
  const D = R - aPrime;
  return (aPrime + 1) * (D + 1) + aPrime * (aPrime + 1) / 2;
}
function lookupPatternA(category, n, min, step, R) {
  let remaining = n;
  for (let aPrime = 0;aPrime <= R; aPrime++) {
    const aCount = patternACountForA(aPrime, R);
    if (remaining < aCount) {
      for (let bPrime = 0;bPrime <= R - aPrime; bPrime++) {
        const cCount = aPrime + bPrime + 1;
        if (remaining < cCount) {
          const cPrime = remaining;
          const a = min + aPrime * step;
          const b = min + bPrime * step;
          const c = min + cPrime * step;
          return {
            id: `${category}_${a}_add_${b}_sub_${c}_result`,
            text: `${a} + ${b} - ${c} = ?`,
            answer: a + b - c
          };
        }
        remaining -= cCount;
      }
    }
    remaining -= aCount;
  }
  throw new Error("Index out of bounds");
}
function lookupPatternB(category, n, min, step, R) {
  let remaining = n;
  for (let aPrime = 0;aPrime <= R; aPrime++) {
    const aCount = patternBCountForA(aPrime, R);
    if (remaining < aCount) {
      for (let bPrime = 0;bPrime <= aPrime; bPrime++) {
        const cCount = R - aPrime + bPrime + 1;
        if (remaining < cCount) {
          const cPrime = remaining;
          const a = min + aPrime * step;
          const b = min + bPrime * step;
          const c = min + cPrime * step;
          return {
            id: `${category}_${a}_sub_${b}_add_${c}_result`,
            text: `${a} - ${b} + ${c} = ?`,
            answer: a - b + c
          };
        }
        remaining -= cCount;
      }
    }
    remaining -= aCount;
  }
  throw new Error("Index out of bounds");
}
function enumerate5(category, targetIndex) {
  const props = generateProps7[category];
  const { max } = props;
  const min = props.min ?? 0;
  const step = props.step ?? 1;
  const R = (max - min) / step;
  let countA = 0;
  for (let aPrime = 0;aPrime <= R; aPrime++) {
    countA += patternACountForA(aPrime, R);
  }
  let countB = 0;
  for (let aPrime = 0;aPrime <= R; aPrime++) {
    countB += patternBCountForA(aPrime, R);
  }
  const total = countA + countB;
  if (targetIndex < 0) {
    return { count: total };
  }
  if (targetIndex < countA) {
    return { problem: lookupPatternA(category, targetIndex, min, step, R), count: total };
  }
  return { problem: lookupPatternB(category, targetIndex - countA, min, step, R), count: total };
}
var { count: count9, getProblem: getProblem9 } = makeGenerator(enumerate5);

// src/problem.ts
var generatorPerGroup = {
  Addition: exports_addition,
  Subtraction: exports_subtraction,
  Multiplication: exports_multiplication,
  Division: exports_division,
  Mixed: exports_mixed,
  Comparison: exports_comparison,
  NumberText: exports_numberText,
  NextPrevious: exports_nextPrevious,
  Test: exports_test
};
function getGenerator(category) {
  return generatorPerGroup[categoryToGroup[category]];
}
function getRandomProblem(category) {
  const gen = getGenerator(category);
  const total = gen.count(category);
  const n = Math.floor(Math.random() * total);
  return gen.getProblem(category, n);
}

// src/app.ts
function getProblem10(categories) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  return { problem: getRandomProblem(category), category };
}
function getCategories() {
  return categoryGroups;
}
function getYearGroupsSl() {
  return yearGroupsSl;
}

// src/constants.ts
var numberOfRewardImages = 12;
var SOLVED_COUNT_PREFIX = "solved_count:";
function getSolvedCount(category) {
  return parseInt(localStorage.getItem(SOLVED_COUNT_PREFIX + category) || "0");
}
function incrementSolvedCount(category) {
  const count10 = getSolvedCount(category) + 1;
  localStorage.setItem(SOLVED_COUNT_PREFIX + category, count10.toString());
}

// src/practice.ts
function show67EasterEgg() {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;pointer-events:none;display:flex;gap:8px;";
  const digits = ["6", "7"].map((d, i) => {
    const el = document.createElement("div");
    el.textContent = d;
    el.style.cssText = `font-size:100px;font-weight:bold;color:#667eea;animation:jump67 0.4s ease-in-out ${i * 0.2}s infinite alternate;`;
    return el;
  });
  digits.forEach((d) => container.appendChild(d));
  const style = document.createElement("style");
  style.textContent = "@keyframes jump67{0%{transform:translateY(0)}100%{transform:translateY(-40px)}}";
  container.appendChild(style);
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.transition = "opacity 0.3s";
    container.style.opacity = "0";
    container.addEventListener("transitionend", () => container.remove());
  }, 1500);
}
document.addEventListener("DOMContentLoaded", () => {
  const currentLang = getCurrentLanguage();
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key)
      return;
    if (el instanceof HTMLInputElement && el.getAttribute("placeholder")) {
      el.placeholder = t(key);
    } else {
      if (key === "title") {
        el.innerHTML = `${t(key)} <span class="brain-emoji">\uD83D\uDC08‍⬛</span>`;
      } else {
        el.textContent = t(key);
      }
    }
  });
  document.title = t("title");
  const problemElement = document.getElementById("problem");
  const problemContainer = document.getElementById("problem-container");
  const answerInput = document.getElementById("answer-input");
  const submitButton = document.getElementById("submit-btn");
  const feedbackElement = document.getElementById("feedback");
  const backBtn = document.getElementById("back-btn");
  const correctCountElement = document.getElementById("correct-count");
  const incorrectCountElement = document.getElementById("incorrect-count");
  const accuracyPercentElement = document.getElementById("accuracy-percent");
  const currentStreakElement = document.getElementById("current-streak");
  const longestStreakElement = document.getElementById("longest-streak");
  const totalTimeElement = document.getElementById("total-time");
  const averageTimeElement = document.getElementById("average-time");
  const medianTimeElement = document.getElementById("median-time");
  const gridParts = Array.from(document.querySelectorAll(".grid-part"));
  const rewardImage = document.getElementById("reward-image");
  const nextRoundBtn = document.getElementById("next-round-btn");
  const feedbackSummary = document.getElementById("feedback-summary");
  const answerSection = document.querySelector(".answer-section");
  const optionsSection = document.getElementById("options-section");
  const endRoundBtn = document.getElementById("end-round-btn");
  let currentProblem;
  let currentCategory;
  let selectedCategories = [];
  let currentRewardImageId = null;
  function hasOptions(problem) {
    return problem.options !== undefined && problem.options.length > 0;
  }
  function getOptionLabel(problem, value) {
    if (typeof value === "string")
      return value;
    const option = problem.options?.find((o) => o.value === value);
    return option ? option.label : String(value);
  }
  function chooseRandomRewardImage() {
    if (!rewardImage)
      return;
    let completedImages = JSON.parse(localStorage.getItem("completedRewardImages") || "[]");
    let availableImages = Array.from({ length: numberOfRewardImages }, (_, i) => i + 1).filter((id) => !completedImages.includes(id));
    if (availableImages.length === 0) {
      completedImages = [];
      availableImages = Array.from({ length: numberOfRewardImages }, (_, i) => i + 1);
      localStorage.setItem("completedRewardImages", JSON.stringify(completedImages));
    }
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    currentRewardImageId = availableImages[randomIndex];
    rewardImage.src = `rewardImages/${currentRewardImageId}.jpg`;
  }
  chooseRandomRewardImage();
  const stats = {
    correct: 0,
    incorrect: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTime: 0,
    problemStartTime: 0,
    allTimes: [],
    roundIncorrectProblems: new Map
  };
  function updateStatsDisplay() {
    const totalProblems = stats.correct + stats.incorrect;
    const accuracy = totalProblems > 0 ? (stats.correct / totalProblems * 100).toFixed(1) : "0.0";
    const averageTime = totalProblems > 0 ? (stats.totalTime / totalProblems / 1000).toFixed(1) : "0.0";
    const medianTime = stats.allTimes.length > 0 ? (() => {
      const sorted = [...stats.allTimes].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      return (median / 1000).toFixed(1);
    })() : "0.0";
    const totalSeconds = Math.floor(stats.totalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    if (correctCountElement)
      correctCountElement.textContent = stats.correct.toString();
    if (incorrectCountElement)
      incorrectCountElement.textContent = stats.incorrect.toString();
    if (accuracyPercentElement)
      accuracyPercentElement.textContent = `${accuracy}%`;
    if (currentStreakElement)
      currentStreakElement.textContent = stats.currentStreak.toString();
    if (longestStreakElement)
      longestStreakElement.textContent = stats.longestStreak.toString();
    if (totalTimeElement)
      totalTimeElement.textContent = formattedTime;
    if (averageTimeElement)
      averageTimeElement.textContent = `${averageTime}s`;
    if (medianTimeElement)
      medianTimeElement.textContent = `${medianTime}s`;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const categoriesParam = urlParams.get("categories");
  if (categoriesParam) {
    selectedCategories = categoriesParam.split(";").map(decodeURIComponent);
  }
  if (selectedCategories.length === 0) {
    selectedCategories = ["Addition: 10"];
  }
  function revealRandomPart() {
    const coveredParts = gridParts.filter((part) => !part.classList.contains("revealed"));
    if (coveredParts.length > 0) {
      const randomPart = coveredParts[Math.floor(Math.random() * coveredParts.length)];
      if (randomPart) {
        randomPart.classList.add("revealed");
      }
    }
  }
  function isPictureComplete() {
    return gridParts.every((part) => part.classList.contains("revealed"));
  }
  function hideRandomPart() {
    const revealedParts = gridParts.filter((part) => part.classList.contains("revealed"));
    if (revealedParts.length > 0) {
      const randomPart = revealedParts[Math.floor(Math.random() * revealedParts.length)];
      if (randomPart) {
        randomPart.classList.remove("revealed");
      }
    }
  }
  function newProblem() {
    const result = getProblem10(selectedCategories);
    currentProblem = result.problem;
    currentCategory = result.category;
    if (problemElement)
      problemElement.textContent = localizeProblemText(currentProblem.text);
    if (hasOptions(currentProblem)) {
      if (answerSection)
        answerSection.style.display = "none";
      renderOptionButtons(currentProblem.options);
      if (optionsSection)
        optionsSection.style.display = "flex";
    } else {
      if (optionsSection)
        optionsSection.style.display = "none";
      if (answerSection)
        answerSection.style.display = "flex";
      if (typeof currentProblem.answer === "string") {
        answerInput.inputMode = "text";
        answerInput.removeAttribute("pattern");
      } else {
        answerInput.inputMode = "numeric";
        answerInput.setAttribute("pattern", "[0-9]*");
      }
      resetState();
    }
    stats.problemStartTime = Date.now();
  }
  function renderOptionButtons(options) {
    if (!optionsSection)
      return;
    optionsSection.innerHTML = "";
    for (const option of options) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option.label;
      btn.addEventListener("click", () => checkAnswer(option.value));
      optionsSection.appendChild(btn);
    }
  }
  function setOptionButtonsDisabled(disabled) {
    if (!optionsSection)
      return;
    for (const btn of Array.from(optionsSection.querySelectorAll(".option-btn"))) {
      btn.disabled = disabled;
    }
  }
  function checkAnswer(optionValue) {
    if (!feedbackElement)
      return;
    let userAnswer;
    if (optionValue !== undefined) {
      userAnswer = optionValue;
    } else {
      if (!answerInput)
        return;
      if (typeof currentProblem.answer === "string") {
        userAnswer = answerInput.value.trim().toLowerCase();
      } else {
        userAnswer = parseInt(answerInput.value, 10);
        if (isNaN(userAnswer)) {
          feedbackElement.textContent = t("nan_error");
          feedbackElement.className = "incorrect";
          return;
        }
      }
    }
    const elapsed = Date.now() - stats.problemStartTime;
    stats.totalTime += elapsed;
    stats.allTimes.push(elapsed);
    let isCorrect = false;
    if (typeof currentProblem.answer === "string") {
      isCorrect = userAnswer === currentProblem.answer.toLowerCase();
    } else {
      isCorrect = userAnswer === currentProblem.answer;
    }
    gtag("event", "problem_answer", {
      category: currentCategory,
      correct: isCorrect
    });
    if (isCorrect) {
      feedbackElement.textContent = t("correct");
      feedbackElement.className = "correct";
      if (currentProblem.answer === 67)
        show67EasterEgg();
      incrementSolvedCount(currentCategory);
      revealRandomPart();
      stats.correct++;
      stats.currentStreak++;
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
      updateStatsDisplay();
      if (submitButton)
        submitButton.disabled = true;
      if (answerInput)
        answerInput.disabled = true;
      setOptionButtonsDisabled(true);
      if (isPictureComplete()) {
        if (currentRewardImageId !== null) {
          const completedImages = JSON.parse(localStorage.getItem("completedRewardImages") || "[]");
          if (!completedImages.includes(currentRewardImageId)) {
            completedImages.push(currentRewardImageId);
            localStorage.setItem("completedRewardImages", JSON.stringify(completedImages));
          }
        }
        if (nextRoundBtn)
          nextRoundBtn.style.display = "block";
        if (backBtn)
          backBtn.style.display = "inline-block";
        if (endRoundBtn)
          endRoundBtn.style.display = "none";
        if (answerSection)
          answerSection.style.display = "none";
        if (optionsSection)
          optionsSection.style.display = "none";
        if (feedbackElement)
          feedbackElement.style.display = "none";
        if (problemContainer)
          problemContainer.style.display = "none";
        if (feedbackSummary) {
          feedbackSummary.style.display = "block";
          if (stats.roundIncorrectProblems.size === 0) {
            feedbackSummary.innerHTML = `<div class="feedback-perfect">${t("perfect_round")}</div>`;
          } else {
            let html = `<span class="review-header">${t("review_header")}</span>`;
            stats.roundIncorrectProblems.forEach((details, problemText) => {
              html += `
                                <div class="review-item">
                                    <span class="review-problem">${localizeProblemText(problemText)}</span>
                                    <div class="review-details">
                                        ${t("correct_answer")} <span class="review-correct">${details.correctAnswer}</span>,
                                        ${t("your_answers")} <span class="review-incorrect">${details.givenAnswers.join(", ")}</span>
                                    </div>
                                </div>
                            `;
            });
            feedbackSummary.innerHTML = html;
            stats.roundIncorrectProblems.clear();
          }
        }
      } else {
        setTimeout(newProblem, 1000);
      }
    } else {
      feedbackElement.textContent = t("incorrect");
      feedbackElement.className = "incorrect";
      hideRandomPart();
      hideRandomPart();
      stats.incorrect++;
      stats.currentStreak = 0;
      const problemText = currentProblem.text;
      if (!stats.roundIncorrectProblems.has(problemText)) {
        stats.roundIncorrectProblems.set(problemText, {
          correctAnswer: getOptionLabel(currentProblem, currentProblem.answer),
          givenAnswers: []
        });
      }
      const record = stats.roundIncorrectProblems.get(problemText);
      const userLabel = getOptionLabel(currentProblem, userAnswer);
      if (!record.givenAnswers.includes(userLabel)) {
        record.givenAnswers.push(userLabel);
      }
      updateStatsDisplay();
      if (submitButton)
        submitButton.disabled = true;
      if (answerInput)
        answerInput.disabled = true;
      setOptionButtonsDisabled(true);
      setTimeout(() => {
        if (hasOptions(currentProblem)) {
          setOptionButtonsDisabled(false);
        } else {
          resetState();
        }
        if (feedbackElement) {
          feedbackElement.innerHTML = "&nbsp;";
          feedbackElement.className = "";
        }
      }, 2000);
    }
  }
  function resetState() {
    if (answerInput) {
      answerInput.value = "";
      answerInput.disabled = false;
      answerInput.focus();
    }
    if (feedbackElement) {
      feedbackElement.innerHTML = "&nbsp;";
      feedbackElement.className = "";
    }
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
  function startNextRound() {
    if (nextRoundBtn)
      nextRoundBtn.style.display = "none";
    if (backBtn)
      backBtn.style.display = "none";
    if (endRoundBtn)
      endRoundBtn.style.display = "inline-block";
    if (feedbackElement)
      feedbackElement.style.display = "flex";
    if (problemContainer)
      problemContainer.style.display = "block";
    if (feedbackSummary) {
      feedbackSummary.style.display = "none";
      feedbackSummary.innerHTML = "";
    }
    stats.roundIncorrectProblems.clear();
    gridParts.forEach((part) => part.classList.remove("revealed"));
    chooseRandomRewardImage();
    newProblem();
  }
  function endRound() {
    if (nextRoundBtn)
      nextRoundBtn.style.display = "block";
    if (backBtn)
      backBtn.style.display = "inline-block";
    if (endRoundBtn)
      endRoundBtn.style.display = "none";
    if (answerSection)
      answerSection.style.display = "none";
    if (optionsSection)
      optionsSection.style.display = "none";
    if (feedbackElement)
      feedbackElement.style.display = "none";
    if (problemContainer)
      problemContainer.style.display = "none";
    if (feedbackSummary) {
      feedbackSummary.style.display = "block";
      if (stats.roundIncorrectProblems.size === 0) {
        feedbackSummary.innerHTML = `<div class="feedback-perfect">${t("perfect_round")}</div>`;
      } else {
        let html = `<span class="review-header">${t("review_header")}</span>`;
        stats.roundIncorrectProblems.forEach((details, problemText) => {
          html += `
                        <div class="review-item">
                            <span class="review-problem">${localizeProblemText(problemText)}</span>
                            <div class="review-details">
                                ${t("correct_answer")} <span class="review-correct">${details.correctAnswer}</span>,
                                ${t("your_answers")} <span class="review-incorrect">${details.givenAnswers.join(", ")}</span>
                            </div>
                        </div>
                    `;
        });
        feedbackSummary.innerHTML = html;
      }
    }
  }
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  if (submitButton) {
    submitButton.addEventListener("click", () => checkAnswer());
  }
  if (answerInput) {
    answerInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        checkAnswer();
      }
    });
  }
  if (nextRoundBtn) {
    nextRoundBtn.addEventListener("click", startNextRound);
  }
  if (endRoundBtn) {
    endRoundBtn.addEventListener("click", endRound);
  }
  newProblem();
});
