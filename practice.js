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
  Test: [
    "test" /* Test */
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

// src/problem.ts
var generateFnPerGroup = {
  Addition: (category) => generate(category),
  Subtraction: (category) => generate2(category),
  Multiplication: (category) => generate4(category),
  Division: (category) => generate3(category),
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
    ["Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */]: "Addition: 100 (without carry)",
    ["Addition: 100 (with carry)" /* Addition_HundredWithCarry */]: "Addition: 100 (with carry)",
    ["Addition: 100" /* Addition_Hundred */]: "Addition: 100",
    ["Addition: 100 (missing facts)" /* Addition_Hundred_Missing */]: "Addition: 100 (missing facts)",
    ["Subtraction: 10" /* Subtraction_Ten */]: "Subtraction: 10",
    ["Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */]: "Subtraction: 10 (missing facts)",
    ["Subtraction: 20" /* Subtraction_Twenty */]: "Subtraction: 20",
    ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: "Subtraction: 20 (missing facts)",
    ["Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */]: "Subtraction: 100 (without borrow)",
    ["Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */]: "Subtraction: 100 (with borrow)",
    ["Subtraction: 100" /* Subtraction_Hundred */]: "Subtraction: 100",
    ["Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */]: "Subtraction: 100 (missing facts)",
    ["Multiplication: 10" /* Multiplication_Ten */]: "Multiplication: 10",
    ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: "Multiplication: 10 (missing facts)",
    ["Multiplication: 20" /* Multiplication_Twenty */]: "Multiplication: 20",
    ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: "Multiplication: 20 (missing facts)",
    ["Division: 10" /* Division_Ten */]: "Division: 10",
    ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: "Division: 10 (missing facts)",
    ["Division: 20" /* Division_Twenty */]: "Division: 20",
    ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: "Division: 20 (missing facts)",
    group_Addition: "Addition",
    group_Subtraction: "Subtraction",
    group_Multiplication: "Multiplication",
    group_Division: "Division"
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
    perfect_round: "Popoln krog! Odlično delo! \uD83C\uDF1F",
    review_header: "Naloge za ponovitev:",
    your_answers: "tvoji odgovori:",
    correct_answer: "Pravilna odgovor:",
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
    ["Addition: 100 (without carry)" /* Addition_HundredWithoutCarry */]: "Seštevanje: 100 (brez prehoda)",
    ["Addition: 100 (with carry)" /* Addition_HundredWithCarry */]: "Seštevanje: 100 (s prehodom)",
    ["Addition: 100" /* Addition_Hundred */]: "Seštevanje: 100",
    ["Addition: 100 (missing facts)" /* Addition_Hundred_Missing */]: "Seštevanje: 100 (neznani člen)",
    ["Subtraction: 10" /* Subtraction_Ten */]: "Odštevanje: 10",
    ["Subtraction: 10 (missing facts)" /* Subtraction_Ten_Missing */]: "Odštevanje: 10 (neznani člen)",
    ["Subtraction: 20" /* Subtraction_Twenty */]: "Odštevanje: 20",
    ["Subtraction: 20 (missing facts)" /* Subtraction_Twenty_Missing */]: "Odštevanje: 20 (neznani člen)",
    ["Subtraction: 100 (without borrow)" /* Subtraction_HundredWithoutBorrow */]: "Odštevanje: 100 (brez prehoda)",
    ["Subtraction: 100 (with borrow)" /* Subtraction_HundredWithBorrow */]: "Odštevanje: 100 (s prehodom)",
    ["Subtraction: 100" /* Subtraction_Hundred */]: "Odštevanje: 100",
    ["Subtraction: 100 (missing facts)" /* Subtraction_Hundred_Missing */]: "Odštevanje: 100 (neznani člen)",
    ["Multiplication: 10" /* Multiplication_Ten */]: "Množenje: 10",
    ["Multiplication: 10 (missing facts)" /* Multiplication_Ten_Missing */]: "Množenje: 10 (neznani člen)",
    ["Multiplication: 20" /* Multiplication_Twenty */]: "Množenje: 20",
    ["Multiplication: 20 (missing facts)" /* Multiplication_Twenty_Missing */]: "Množenje: 20 (neznani člen)",
    ["Division: 10" /* Division_Ten */]: "Deljenje: 10",
    ["Division: 10 (missing facts)" /* Division_Ten_Missing */]: "Deljenje: 10 (neznani člen)",
    ["Division: 20" /* Division_Twenty */]: "Deljenje: 20",
    ["Division: 20 (missing facts)" /* Division_Twenty_Missing */]: "Deljenje: 20 (neznani člen)",
    group_Addition: "Seštevanje",
    group_Subtraction: "Odštevanje",
    group_Multiplication: "Množenje",
    group_Division: "Deljenje"
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
function getCategoryDisplayName(category) {
  const lang = getCurrentLanguage();
  const translated = translations[lang][category];
  if (!translated) {
    console.error(`Missing translation for language ${lang} and category: ${category}`);
  }
  return translated || category;
}

// src/practice.ts
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
  let currentProblem;
  let currentCategory;
  let selectedCategories = [];
  let currentRewardImageId = null;
  function chooseRandomRewardImage() {
    if (!rewardImage)
      return;
    const totalImages = 5;
    let completedImages = JSON.parse(localStorage.getItem("completedRewardImages") || "[]");
    let availableImages = Array.from({ length: totalImages }, (_, i) => i + 1).filter((id) => !completedImages.includes(id));
    if (availableImages.length === 0) {
      completedImages = [];
      availableImages = Array.from({ length: totalImages }, (_, i) => i + 1);
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
  for (const category of selectedCategories) {
    const solvedProblemIds = JSON.parse(localStorage.getItem(category) || "[]");
    let flushCategoryCache = false;
    for (const problemId of solvedProblemIds) {
      flushCategoryCache = flushCategoryCache || solvedProblem(category, problemId);
    }
    if (flushCategoryCache) {
      localStorage.removeItem(category);
    }
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
    const result = getProblem(selectedCategories);
    console.log(JSON.stringify(result, null, 2));
    currentProblem = result.problem;
    currentCategory = result.category;
    if (problemElement)
      problemElement.textContent = currentProblem.text;
    resetState();
    stats.problemStartTime = Date.now();
  }
  function checkAnswer() {
    if (!answerInput || !feedbackElement)
      return;
    const userAnswer = parseInt(answerInput.value, 10);
    if (isNaN(userAnswer)) {
      feedbackElement.textContent = t("nan_error");
      feedbackElement.className = "incorrect";
      return;
    }
    const elapsed = Date.now() - stats.problemStartTime;
    stats.totalTime += elapsed;
    stats.allTimes.push(elapsed);
    if (userAnswer === currentProblem.answer) {
      feedbackElement.textContent = t("correct");
      feedbackElement.className = "correct";
      revealRandomPart();
      const flushCategoryCache = solvedProblem(currentCategory, currentProblem.id);
      if (flushCategoryCache) {
        localStorage.removeItem(currentCategory);
      }
      const solvedProblemIds = JSON.parse(localStorage.getItem(currentCategory) || "[]");
      if (!solvedProblemIds.includes(currentProblem.id)) {
        solvedProblemIds.push(currentProblem.id);
        localStorage.setItem(currentCategory, JSON.stringify(solvedProblemIds));
      }
      stats.correct++;
      stats.currentStreak++;
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
      updateStatsDisplay();
      if (submitButton)
        submitButton.disabled = true;
      if (answerInput)
        answerInput.disabled = true;
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
        if (answerSection)
          answerSection.style.display = "none";
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
                                    <span class="review-problem">${problemText}</span>
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
          correctAnswer: currentProblem.answer,
          givenAnswers: []
        });
      }
      const record = stats.roundIncorrectProblems.get(problemText);
      if (!record.givenAnswers.includes(userAnswer)) {
        record.givenAnswers.push(userAnswer);
      }
      updateStatsDisplay();
      if (submitButton)
        submitButton.disabled = true;
      if (answerInput)
        answerInput.disabled = true;
      setTimeout(() => {
        resetState();
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
    if (answerSection)
      answerSection.style.display = "flex";
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
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  if (submitButton) {
    submitButton.addEventListener("click", checkAnswer);
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
  newProblem();
});
