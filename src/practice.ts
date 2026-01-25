import { getProblem, solvedProblem } from "./app.js";
import { getCurrentLanguage, t, Language } from "./i18n.js";
import { Category } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Language
    const currentLang = getCurrentLanguage();
    document.documentElement.lang = currentLang;

    // Translate static elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;

        if (el instanceof HTMLInputElement && el.getAttribute("placeholder")) {
            el.placeholder = t(key);
        } else {
            // Handle emoji in title if it exists, simple replacement otherwise
            if (key === "title") {
                el.innerHTML = `${t(key)} <span class="brain-emoji">🐈‍⬛</span>`;
            } else {
                el.textContent = t(key);
            }
        }
    });
    document.title = t("title");

    // DOM Elements
    const problemElement = document.getElementById("problem");
    const problemContainer = document.getElementById("problem-container");
    const answerInput = document.getElementById("answer-input") as HTMLInputElement;
    const submitButton = document.getElementById("submit-btn") as HTMLButtonElement;
    const feedbackElement = document.getElementById("feedback");
    const backBtn = document.getElementById("back-btn");

    // Statistics DOM Elements
    const correctCountElement = document.getElementById("correct-count");
    const incorrectCountElement = document.getElementById("incorrect-count");
    const accuracyPercentElement = document.getElementById("accuracy-percent");
    const currentStreakElement = document.getElementById("current-streak");
    const longestStreakElement = document.getElementById("longest-streak");
    const totalTimeElement = document.getElementById("total-time");
    const averageTimeElement = document.getElementById("average-time");

    // Reward Image Elements
    const gridParts = Array.from(document.querySelectorAll(".grid-part")) as HTMLElement[];
    const rewardImage = document.getElementById("reward-image") as HTMLImageElement;
    const nextRoundBtn = document.getElementById("next-round-btn") as HTMLButtonElement;
    const answerSection = document.querySelector(".answer-section") as HTMLElement;

    // Function to choose a random reward image
    function chooseRandomRewardImage() {
        if (!rewardImage) return;
        const imageCount = 5; // We have 1.jpg to 5.jpg
        const randomIndex = Math.floor(Math.random() * imageCount) + 1;
        rewardImage.src = `rewardImages/${randomIndex}.jpg`;
    }

    // Choose random reward image on page load
    chooseRandomRewardImage();

    // Statistics tracking
    const stats = {
        correct: 0,
        incorrect: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTime: 0,
        problemStartTime: 0,
    };

    // Function to update statistics display
    function updateStatsDisplay() {
        const totalProblems = stats.correct + stats.incorrect;
        const accuracy =
            totalProblems > 0
                ? ((stats.correct / totalProblems) * 100).toFixed(1)
                : "0.0";
        const averageTime =
            totalProblems > 0
                ? (stats.totalTime / totalProblems / 1000).toFixed(1)
                : "0.0";

        // Format total time as minutes:seconds
        const totalSeconds = Math.floor(stats.totalTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Update DOM elements
        if (correctCountElement) correctCountElement.textContent = stats.correct.toString();
        if (incorrectCountElement) incorrectCountElement.textContent = stats.incorrect.toString();
        if (accuracyPercentElement) accuracyPercentElement.textContent = `${accuracy}%`;
        if (currentStreakElement) currentStreakElement.textContent = stats.currentStreak.toString();
        if (longestStreakElement) longestStreakElement.textContent = stats.longestStreak.toString();
        if (totalTimeElement) totalTimeElement.textContent = formattedTime;
        if (averageTimeElement) averageTimeElement.textContent = `${averageTime}s`;
    }

    let currentProblem: any;
    let currentCategory: Category;
    let selectedCategories: string[] = [];

    // Get categories from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const categoriesParam = urlParams.get("categories");
    if (categoriesParam) {
        selectedCategories = categoriesParam
            .split(";")
            .map(decodeURIComponent);
    }

    if (selectedCategories.length === 0) {
        // Fallback if no categories provided
        selectedCategories = ["Addition: 10"];
    }

    // Load solved problems from localStorage and mark them as solved
    selectedCategories.forEach((category) => {
        const solvedProblemIds = JSON.parse(
            localStorage.getItem(category) || "[]",
        );
        (solvedProblemIds as string[]).forEach((problemId) => {
            solvedProblem(category as Category, problemId);
        });
    });

    // Function to reveal a random covered part of the reward image
    function revealRandomPart() {
        const coveredParts = gridParts.filter(
            (part) => !part.classList.contains("revealed"),
        );
        if (coveredParts.length > 0) {
            const randomPart =
                coveredParts[Math.floor(Math.random() * coveredParts.length)];
            if (randomPart) {
                randomPart.classList.add("revealed");
            }
        }
    }

    // Function to check if the whole picture is revealed
    function isPictureComplete() {
        return gridParts.every((part) => part.classList.contains("revealed"));
    }

    // Function to hide a random revealed part of the reward image
    function hideRandomPart() {
        const revealedParts = gridParts.filter((part) =>
            part.classList.contains("revealed"),
        );
        if (revealedParts.length > 0) {
            const randomPart =
                revealedParts[Math.floor(Math.random() * revealedParts.length)];
            if (randomPart) {
                randomPart.classList.remove("revealed");
            }
        }
    }

    // Function to generate a new math problem
    function newProblem() {
        const result = getProblem(selectedCategories as Category[]);
        console.log(JSON.stringify(result, null, 2));
        currentProblem = result.problem;
        currentCategory = result.category;

        if (problemElement) problemElement.textContent = currentProblem.text;
        resetState();

        // Start timing for this problem
        stats.problemStartTime = Date.now();
    }

    // Function to check the user's answer
    function checkAnswer() {
        if (!answerInput || !feedbackElement) return;
        const userAnswer = parseInt(answerInput.value, 10);

        if (isNaN(userAnswer)) {
            feedbackElement.textContent = t("nan_error");
            feedbackElement.className = "incorrect";
            return;
        }

        // Calculate time spent on this problem
        const elapsed = Date.now() - stats.problemStartTime;
        stats.totalTime += elapsed;

        if (userAnswer === currentProblem.answer) {
            feedbackElement.textContent = t("correct");
            feedbackElement.className = "correct";
            // Reveal a random part of the reward image
            revealRandomPart();
            // Remove the correctly solved problem from cache
            solvedProblem(currentCategory, currentProblem.id);
            // Store the solved problem in localStorage
            const solvedProblemIds = JSON.parse(
                localStorage.getItem(currentCategory) || "[]",
            );
            if (!solvedProblemIds.includes(currentProblem.id)) {
                solvedProblemIds.push(currentProblem.id);
                localStorage.setItem(
                    currentCategory,
                    JSON.stringify(solvedProblemIds),
                );
            }

            // Update statistics for correct answer
            stats.correct++;
            stats.currentStreak++;
            stats.longestStreak = Math.max(
                stats.longestStreak,
                stats.currentStreak,
            );

            // Update statistics display
            updateStatsDisplay();

            if (submitButton) submitButton.disabled = true;
            if (answerInput) answerInput.disabled = true;

            if (isPictureComplete()) {
                // Show "Next Round" button and hide answer section
                if (nextRoundBtn) nextRoundBtn.style.display = "block";
                if (answerSection) answerSection.style.display = "none";
                if (feedbackElement) feedbackElement.style.display = "none";
                if (problemContainer) problemContainer.style.display = "none";
            } else {
                setTimeout(newProblem, 1000);
            }
        } else {
            feedbackElement.textContent = t("incorrect");
            feedbackElement.className = "incorrect";
            // Hide a random revealed part of the reward image
            hideRandomPart();
            hideRandomPart();

            // Update statistics for incorrect answer
            stats.incorrect++;
            stats.currentStreak = 0;

            // Update statistics display
            updateStatsDisplay();

            if (submitButton) submitButton.disabled = true;
            if (answerInput) answerInput.disabled = true;

            // For incorrect answers, allow retry after a short delay
            setTimeout(() => {
                resetState();
            }, 2000);
        }
    }

    // Function to reset the input field and feedback
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

    // Function to start a new round
    function startNextRound() {
        if (nextRoundBtn) nextRoundBtn.style.display = "none";
        if (answerSection) answerSection.style.display = "flex";
        if (feedbackElement) feedbackElement.style.display = "flex";
        if (problemContainer) problemContainer.style.display = "block";

        // Reset grid
        gridParts.forEach((part) => part.classList.remove("revealed"));

        // Choose new image
        chooseRandomRewardImage();

        // Start new problem
        newProblem();
    }

    // Event Listeners
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (submitButton) {
        submitButton.addEventListener("click", checkAnswer);
    }

    // Allow pressing 'Enter' to check the answer
    if (answerInput) {
        answerInput.addEventListener("keyup", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                checkAnswer();
            }
        });
    }

    if (nextRoundBtn) {
        nextRoundBtn.addEventListener("click", startNextRound);
    }

    // Generate the first problem
    newProblem();
});
