import { translations } from "./translations.ts";
import { Category } from "./common.ts";

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
    const translated = (translations[lang] as any)[key];
    if (!translated) {
        console.error(`Missing translation for language ${lang} and key: ${key}`);
    }
    return translated || key;
}

export function getCategoryDisplayName(category: Category): string {
    const lang = getCurrentLanguage();
    const translated = (translations[lang] as any)[category];
    if (!translated) {
        console.error(`Missing translation for language ${lang} and category: ${category}`);
    }
    return translated || category;
}
