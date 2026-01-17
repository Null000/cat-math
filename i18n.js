import { translations } from "./translations.js";
const LOCAL_STORAGE_KEY = "math_practice_language";
const DEFAULT_LANGUAGE = "sl"; // Defaulting to Slovenian as per request implication, or could be 'en'
export function getCurrentLanguage() {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored === "en" || stored === "sl") {
        return stored;
    }
    return DEFAULT_LANGUAGE;
}
export function setLanguage(lang) {
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    location.reload();
}
export function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || key;
}
export function getCategoryDisplayName(category) {
    const lang = getCurrentLanguage();
    const translated = translations[lang][category];
    return translated || category;
}
//# sourceMappingURL=i18n.js.map