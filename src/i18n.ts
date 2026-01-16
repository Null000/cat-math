import { translations } from "./translations.js";
import { Category } from "./common.js";

export type Language = "en" | "sl";

const LOCAL_STORAGE_KEY = "math_practice_language";
const DEFAULT_LANGUAGE: Language = "sl"; // Defaulting to Slovenian as per request implication, or could be 'en'

export function getCurrentLanguage(): Language {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored === "en" || stored === "sl") {
        return stored;
    }
    return DEFAULT_LANGUAGE;
}

export function setLanguage(lang: Language): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    location.reload();
}

export function t(key: string): string {
    const lang = getCurrentLanguage();
    return (translations[lang] as any)[key] || key;
}

export function getCategoryDisplayName(category: Category): string {
    const lang = getCurrentLanguage();
    const translated = (translations[lang] as any)[category];
    return translated || category;
}
