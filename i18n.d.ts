import { Category } from "./common.js";
export type Language = "en" | "sl";
export declare function getCurrentLanguage(): Language;
export declare function setLanguage(lang: Language): void;
export declare function t(key: string): string;
export declare function getCategoryDisplayName(category: Category): string;
//# sourceMappingURL=i18n.d.ts.map