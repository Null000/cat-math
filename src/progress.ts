import {
	getCurrentLanguage,
	setLanguage,
	t,
	getCategoryDisplayName,
	Language,
} from "./i18n.ts";
import { Category, categoryGroups } from "./common.ts";
import * as addition from "./addition.ts";
import * as subtraction from "./subtraction.ts";
import * as multiplication from "./multiplication.ts";
import * as division from "./division.ts";
import * as comparison from "./comparison.ts";

const generateFnPerGroup: Record<string, (category: Category) => number> = {
	Addition: (category) => addition.generate(category).length,
	Subtraction: (category) => subtraction.generate(category).length,
	Multiplication: (category) => multiplication.generate(category).length,
	Division: (category) => division.generate(category).length,
	Comparison: (category) => comparison.generate(category).length,
};

function getTotalProblems(category: Category, group: string): number {
	const fn = generateFnPerGroup[group];
	if (!fn) return 0;
	return fn(category);
}

function getSolvedCount(category: Category): number {
	const solved = JSON.parse(localStorage.getItem(category) || "[]");
	return (solved as string[]).length;
}

document.addEventListener("DOMContentLoaded", () => {
	const currentLang = getCurrentLanguage();
	document.documentElement.lang = currentLang;

	// Translate static elements
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		if (!key) return;

		if (key === "title") {
			el.innerHTML = `${t(key)} <span class="brain-emoji">&#x1F408;&#x200D;&#x2B1B;</span>`;
		} else {
			el.textContent = t(key);
		}
	});
	document.title = t("title");

	// Back button
	const backBtn = document.getElementById("back-btn");
	if (backBtn) {
		backBtn.addEventListener("click", () => {
			window.location.href = "index.html";
		});
	}

	// Build progress data
	const progressGroupsEl = document.getElementById("progress-groups");
	if (!progressGroupsEl) return;

	let grandTotalSolved = 0;
	let grandTotalAvailable = 0;
	let categoriesMastered = 0;

	for (const [groupName, categories] of Object.entries(categoryGroups)) {
		if (groupName === "Test") continue;

		const groupDetails = document.createElement("details");
		groupDetails.className = "progress-group";
		groupDetails.open = true;

		const groupSummary = document.createElement("summary");

		let groupSolved = 0;
		let groupTotal = 0;

		const itemsContainer = document.createElement("div");
		itemsContainer.className = "progress-items";

		for (const category of categories) {
			const total = getTotalProblems(category, groupName);
			const solved = getSolvedCount(category);

			groupSolved += solved;
			groupTotal += total;

			if (total > 0 && solved >= total) {
				categoriesMastered++;
			}

			const item = document.createElement("div");
			item.className = "progress-item";

			const label = document.createElement("div");
			label.className = "progress-label";

			const nameSpan = document.createElement("span");
			nameSpan.className = "category-name";
			nameSpan.textContent = getCategoryDisplayName(category);

			const countSpan = document.createElement("span");
			countSpan.className = "progress-count";
			countSpan.textContent = `${solved} / ${total}`;

			label.appendChild(nameSpan);
			label.appendChild(countSpan);

			const barBg = document.createElement("div");
			barBg.className = "progress-bar-bg";

			const barFill = document.createElement("div");
			barFill.className = "progress-bar-fill";

			const percent = total > 0 ? (solved / total) * 100 : 0;
			barFill.style.width = `${Math.min(percent, 100)}%`;

			if (percent >= 100) {
				barFill.classList.add("complete");
			} else if (percent >= 60) {
				barFill.classList.add("high");
			} else if (percent >= 30) {
				barFill.classList.add("medium");
			} else {
				barFill.classList.add("low");
			}

			barBg.appendChild(barFill);
			item.appendChild(label);
			item.appendChild(barBg);
			itemsContainer.appendChild(item);
		}

		grandTotalSolved += groupSolved;
		grandTotalAvailable += groupTotal;

		const groupSummarySpan = document.createElement("span");
		groupSummarySpan.className = "group-summary";
		groupSummarySpan.textContent = `${groupSolved} / ${groupTotal}`;

		const groupNameSpan = document.createTextNode(t(`group_${groupName}`));
		groupSummary.appendChild(groupNameSpan);
		groupSummary.appendChild(groupSummarySpan);

		groupDetails.appendChild(groupSummary);
		groupDetails.appendChild(itemsContainer);
		progressGroupsEl.appendChild(groupDetails);
	}

	// Update overall summary
	const totalSolvedEl = document.getElementById("total-solved");
	const totalAvailableEl = document.getElementById("total-available");
	const overallPercentEl = document.getElementById("overall-percent");
	const categoriesMasteredEl = document.getElementById("categories-mastered");

	if (totalSolvedEl) totalSolvedEl.textContent = grandTotalSolved.toString();
	if (totalAvailableEl)
		totalAvailableEl.textContent = grandTotalAvailable.toString();
	if (overallPercentEl) {
		const pct =
			grandTotalAvailable > 0
				? ((grandTotalSolved / grandTotalAvailable) * 100).toFixed(1)
				: "0.0";
		overallPercentEl.textContent = `${pct}%`;
	}
	if (categoriesMasteredEl)
		categoriesMasteredEl.textContent = categoriesMastered.toString();
});
