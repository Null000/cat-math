import { Application, Container, Graphics } from 'pixi.js';
import { standardHeight, standardWidth } from './constants.ts';
import { initWizard, Wizard } from './Wizard.ts';
import { getCategories, getYearGroupsSl } from '../app.ts';
import { getCurrentLanguage, setLanguage, t, getCategoryDisplayName, Language } from '../i18n.ts';
import { Category } from '../common.ts';

declare function gtag(...args: any[]): void;

async function init() {
    const app = new Application();

    // Initialize PixiJS
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1a1a2e,
        antialias: true
    });
    document.body.appendChild(app.canvas);

    // Send canvas to back via CSS
    app.canvas.style.position = 'absolute';
    app.canvas.style.zIndex = '0';

    const gameStage = new Container();
    app.stage.addChild(gameStage);

    // Background - maybe just a color or simple pattern?
    // For now, just the wizard in the center

    const xp = parseInt(localStorage.getItem('xp') || '0');
    await initWizard(xp);

    const wizard = new Wizard(xp);
    wizard.x = standardWidth / 2;
    wizard.y = standardHeight / 2 + 50;
    wizard.scale.set(2.5); // Make him bigger
    gameStage.addChild(wizard);

    // Animation Loop
    app.ticker.add((time) => {
        wizard.update(time.lastTime, true);
    });

    // Resize Handling
    function resize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const scaleX = screenWidth / standardWidth;
        const scaleY = screenHeight / standardHeight;
        const scale = Math.max(scaleX, scaleY); // Cover logic

        gameStage.x = screenWidth / 2;
        gameStage.y = screenHeight / 2;

        // Center the wizard container logic
        wizard.x = 0;
        wizard.y = 100; // Offset downwards a bit

        // Scale the wizard to fit/fill nicely
        const wizardScale = Math.min(screenWidth, screenHeight) / 800 * 2.5;
        wizard.scale.set(wizardScale);
    }

    window.addEventListener('resize', resize);
    resize();

    // UI Logic
    initUI();
}

function initUI() {
    // Language Initialization
    const currentLang = getCurrentLanguage();
    document.documentElement.lang = currentLang;

    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.getAttribute("data-lang") === currentLang) {
            btn.classList.add("active");
            // Remove active class from others
            document.querySelectorAll(".lang-btn").forEach(b => {
                if (b !== btn) b.classList.remove("active");
            });
        }
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang") as Language;
            if (lang) {
                setLanguage(lang);
            }
        });
    });

    // Translations
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
    });

    // Category Logic
    const categoryContainer = document.getElementById("category-container");
    const groupingToggleContainer = document.getElementById("grouping-toggle-container");
    let currentGrouping: "type" | "year" = "type";

    // Show grouping toggle only for SL
    if (currentLang === "sl" && groupingToggleContainer) {
        groupingToggleContainer.style.display = "flex";

        document.querySelectorAll(".grouping-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const grouping = btn.getAttribute("data-grouping") as "type" | "year";
                if (grouping && grouping !== currentGrouping) {
                    currentGrouping = grouping;
                    document.querySelectorAll(".grouping-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    renderCategories();
                }
            });
        });
    }

    function renderCategories() {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = "";

        const categories = currentGrouping === "year" ? getYearGroupsSl() : getCategories();

        // Load saved selection
        const savedCategories = JSON.parse(localStorage.getItem("rpg_selected_categories") || "[]");

        Object.entries(categories).forEach(([groupName, categoryList]) => {
            if (groupName === "Test") return;

            const groupDiv = document.createElement("div");
            groupDiv.className = "category-group";

            const title = document.createElement("h3");
            title.textContent = t(`group_${groupName}`);
            groupDiv.appendChild(title);

            const grid = document.createElement("div");
            grid.className = "checkbox-grid";

            categoryList.forEach(category => {
                const item = document.createElement("div");
                item.className = "checkbox-item";
                if (savedCategories.includes(category)) {
                    item.classList.add("checked");
                }

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = category;
                checkbox.value = category;
                checkbox.checked = savedCategories.includes(category);

                const label = document.createElement("label");
                label.htmlFor = category;
                label.textContent = getCategoryDisplayName(category as Category);

                // Add stats if any
                const solved = JSON.parse(localStorage.getItem(category) || "[]");
                if (solved.length > 0) {
                    const stat = document.createElement("span");
                    stat.textContent = ` (${solved.length})`;
                    stat.style.opacity = "0.6";
                    stat.style.fontSize = "0.8em";
                    stat.style.marginLeft = "5px";
                    label.appendChild(stat);
                }

                item.appendChild(checkbox);
                item.appendChild(label);

                // Click handler for the whole item
                item.addEventListener("click", (e) => {
                    if (e.target !== checkbox && e.target !== label) {
                        checkbox.checked = !checkbox.checked;
                    }
                    if (checkbox.checked) {
                        item.classList.add("checked");
                    } else {
                        item.classList.remove("checked");
                    }
                    saveSelection();
                });

                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        item.classList.add("checked");
                    } else {
                        item.classList.remove("checked");
                    }
                    saveSelection();
                });

                grid.appendChild(item);
            });

            groupDiv.appendChild(grid);
            categoryContainer.appendChild(groupDiv);
        });
    }

    function saveSelection() {
        const selected = Array.from(document.querySelectorAll('#category-container input[type="checkbox"]:checked'))
            .map(cb => (cb as HTMLInputElement).value);
        localStorage.setItem("rpg_selected_categories", JSON.stringify(selected));
    }

    renderCategories();

    // Buttons
    document.getElementById("back-btn")?.addEventListener("click", () => {
        window.location.href = "../index.html"; // Go back to main index
    });

    document.getElementById("start-btn")?.addEventListener("click", () => {
        const selected = Array.from(document.querySelectorAll('#category-container input[type="checkbox"]:checked'))
            .map(cb => (cb as HTMLInputElement).value);

        if (selected.length === 0) {
            alert(t("select_warning"));
            return;
        }

        const encodedCategories = selected.map(encodeURIComponent).join(";");
        window.location.href = `rpg.html?categories=${encodedCategories}`;
    });
}

init();
