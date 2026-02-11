import { Application, Assets, Sprite } from "pixi.js";
import { getCategories, getYearGroupsSl } from "../app.ts";
import { getRandomProblem } from "../problem.ts";
import { getCurrentLanguage, setLanguage, t, getCategoryDisplayName, Language } from "../i18n.ts";
import { Category } from "../common.ts";
import { getWizardLevel } from "./Wizard.ts";

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
    el.textContent = t(key);
  });
  document.title = t("rpg_title");

  // Grouping toggle (only visible for Slovenian)
  const groupingToggle = document.getElementById("grouping-toggle");
  let currentGrouping: "type" | "year" = "type";

  if (currentLang === "sl" && groupingToggle) {
    groupingToggle.style.display = "flex";

    document.querySelectorAll(".grouping-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const grouping = btn.getAttribute("data-grouping") as "type" | "year";
        if (grouping && grouping !== currentGrouping) {
          currentGrouping = grouping;
          document.querySelectorAll(".grouping-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          populateCategories();
          updateSelectedDisplay();
        }
      });
    });
  }

  // DOM Elements
  const categoryGroupsEl = document.getElementById("category-groups");
  const startBattleBtn = document.getElementById("start-battle-btn");
  const selectedTagsContainer = document.getElementById("selected-tags");
  const selectedCategoriesContainer = document.getElementById("selected-categories-container");

  let selectedCategories: string[] = [];

  function updateSelectedDisplay() {
    if (!selectedTagsContainer || !selectedCategoriesContainer) return;

    selectedCategories = getSelectedCategories();

    // Save to local storage
    localStorage.setItem("selected_categories", JSON.stringify(selectedCategories));

    if (selectedCategories.length === 0) {
      selectedCategoriesContainer.style.display = "none";
      return;
    }

    selectedCategoriesContainer.style.display = "flex";
    selectedTagsContainer.innerHTML = "";

    selectedCategories.forEach(cat => {
      const tag = document.createElement("span");
      tag.className = "selected-tag";
      tag.textContent = getCategoryDisplayName(cat as Category);
      selectedTagsContainer.appendChild(tag);
    });
  }

  // Populate category checkboxes
  function populateCategories() {
    if (!categoryGroupsEl) return;
    const categories = currentGrouping === "year" ? getYearGroupsSl() : getCategories();
    categoryGroupsEl.innerHTML = "";

    // Load from local storage
    const savedCategories = JSON.parse(localStorage.getItem("selected_categories") || "[]");

    Object.entries(categories).forEach(([groupName, categoryList]) => {
      if (groupName === "Test") return;

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
          if (target.tagName !== "INPUT" && !target.closest("label")) {
            const cb = checkboxItem.querySelector("input");
            if (cb) {
              cb.checked = !cb.checked;
              updateSelectedDisplay();
            }
          }
        };

        const topDiv = document.createElement("div");
        topDiv.className = "checkbox-top";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = category;
        checkbox.value = category;
        const isChecked = savedCategories.includes(category);
        checkbox.checked = isChecked;
        if (isChecked) {
          groupDetails.open = true;
        }
        checkbox.addEventListener("change", updateSelectedDisplay);

        const label = document.createElement("label");
        label.htmlFor = category;

        // Calculate solved count
        const solved = JSON.parse(localStorage.getItem(category) || "[]");
        const count = (solved as any[]).length;

        const labelText = document.createTextNode(getCategoryDisplayName(category as Category));
        label.appendChild(labelText);

        if (count > 0) {
          const countSpan = document.createElement("span");
          countSpan.textContent = ` (${count} ${t("solved")})`;
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
      categoryGroupsEl.appendChild(groupDetails);
    });
  }

  // Function to get selected categories
  function getSelectedCategories() {
    const checkboxes = document.querySelectorAll(
      '#category-groups input[type="checkbox"]:checked',
    );
    return Array.from(checkboxes).map((checkbox) => (checkbox as HTMLInputElement).value);
  }

  // Function to start battle
  function startBattle() {
    selectedCategories = getSelectedCategories();
    if (selectedCategories.length === 0) {
      alert(t("select_warning"));
      return;
    }

    // Navigate to rpg.html with selected categories as query params
    const encodedCategories = selectedCategories
      .map(encodeURIComponent)
      .join(";");
    window.location.href = `rpg.html?categories=${encodedCategories}`;
  }

  // Event Listeners
  if (startBattleBtn) {
    startBattleBtn.addEventListener("click", startBattle);
  }

  // Initialize categories on page load
  populateCategories();
  updateSelectedDisplay();

  // Initialize wizard canvas
  initWizardCanvas();
});

async function initWizardCanvas() {
  const container = document.getElementById("wizard-canvas-container");
  if (!container) return;

  const canvasWidth = 200;
  const canvasHeight = 250;

  const app = new Application();
  await app.init({
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: 0x1a1a2e,
    antialias: true,
  });
  container.appendChild(app.canvas);

  // Load wizard texture based on current XP
  const xp = parseInt(localStorage.getItem("xp") || "0");
  const level = getWizardLevel(xp);
  const texture = await Assets.load(`assets/wizard${level}.png`);

  const wizard = new Sprite(texture);
  wizard.anchor.set(0.5, 1);
  wizard.scale.set(0.1);
  wizard.x = canvasWidth / 2;
  wizard.y = canvasHeight - 20;
  app.stage.addChild(wizard);

  // Bobbing animation matching Actor.update: Math.sin(time / 500) * 10
  const baseY = canvasHeight - 20;
  app.ticker.add((ticker) => {
    wizard.y = baseY + Math.sin(ticker.lastTime / 500) * 10;
  });
}
