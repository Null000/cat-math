import { getCategories } from "./app.js";
import { getRandomProblem } from "./problem.js";
import { getCurrentLanguage, setLanguage, t, getCategoryDisplayName, Language } from "./i18n.js";
import { Category } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Language
    const currentLang = getCurrentLanguage();
    document.documentElement.lang = currentLang;

    // Setup Language Switcher
    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.getAttribute("data-lang") === currentLang) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang") as Language;
            if (lang) {
                setLanguage(lang);
            }
        });
    });

    // Translate static elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;

        if (el instanceof HTMLInputElement && el.getAttribute("placeholder")) {
            el.placeholder = t(key);
        } else {
            // Handle emoji in title if it exists, simple replacement otherwise
            if (key === "title") {
                el.innerHTML = `${t(key)} <span class="brain-emoji">🐈</span>`;
            } else {
                el.textContent = t(key);
            }
        }
    });
    document.title = t("title");

    // DOM Elements
    const categoryGroups = document.getElementById("category-groups");
    const startPracticeBtn = document.getElementById("start-practice-btn");

    let selectedCategories: string[] = [];

    // Populate category checkboxes
    function populateCategories() {
        if (!categoryGroups) return;
        const categories = getCategories();
        categoryGroups.innerHTML = "";

        Object.entries(categories).forEach(([groupName, categoryList]) => {
            const groupDetails = document.createElement("details");
            groupDetails.className = "category-group";

            const groupSummary = document.createElement("summary");
            groupSummary.textContent = t(`group_${groupName}`);
            groupDetails.appendChild(groupSummary);

            const checkboxGrid = document.createElement("div");
            checkboxGrid.className = "checkbox-grid";

            categoryList.forEach((category) => {
                const checkboxItem = document.createElement("div");
                checkboxItem.className = "checkbox-item";
                checkboxItem.onclick = (e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName !== "INPUT") {
                        const cb = checkboxItem.querySelector('input');
                        if (cb) {
                            cb.checked = !cb.checked;
                        }
                    }
                };

                const topDiv = document.createElement("div");
                topDiv.className = "checkbox-top";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = category;
                checkbox.value = category;

                const label = document.createElement("label");
                label.htmlFor = category;

                // Calculate solved count
                const solved = JSON.parse(localStorage.getItem(category) || "[]");
                const count = (solved as any[]).length;

                const labelText = document.createTextNode(getCategoryDisplayName(category as Category));
                label.appendChild(labelText);

                if (count > 0) {
                    const countSpan = document.createElement("span");
                    countSpan.textContent = ` (${count})`;
                    countSpan.style.fontSize = "0.8em";
                    countSpan.style.color = "#718096";
                    countSpan.style.fontWeight = "normal";
                    countSpan.style.marginLeft = "3px";
                    label.appendChild(countSpan);
                }

                topDiv.appendChild(checkbox);
                topDiv.appendChild(label);
                checkboxItem.appendChild(topDiv);

                // Add examples for this category
                const examplesDiv = document.createElement("div");
                examplesDiv.className = "category-examples";

                const examplesList = document.createElement("div");
                examplesList.className = "examples-list";

                // Generate 3 example problems
                for (let i = 0; i < 3; i++) {
                    const exampleProblem = getRandomProblem(category as Category);
                    const exampleDiv = document.createElement("div");
                    exampleDiv.className = "example-problem";
                    exampleDiv.textContent = exampleProblem.text;
                    examplesList.appendChild(exampleDiv);
                }

                examplesDiv.appendChild(examplesList);
                checkboxItem.appendChild(examplesDiv);

                checkboxGrid.appendChild(checkboxItem);
            });

            groupDetails.appendChild(checkboxGrid);
            categoryGroups.appendChild(groupDetails);
        });
    }

    // Function to get selected categories
    function getSelectedCategories() {
        const checkboxes = document.querySelectorAll(
            '#category-groups input[type="checkbox"]:checked',
        );
        return Array.from(checkboxes).map((checkbox) => (checkbox as HTMLInputElement).value);
    }

    // Function to start practice
    function startPractice() {
        selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            alert(t("select_warning"));
            return;
        }

        // Navigate to practice.html with selected categories as query params
        const encodedCategories = selectedCategories
            .map(encodeURIComponent)
            .join(";");
        window.location.href = `practice.html?categories=${encodedCategories}`;
    }

    // Event Listeners
    if (startPracticeBtn) {
        startPracticeBtn.addEventListener("click", startPractice);
    }

    // Initialize categories on page load
    populateCategories();
});
