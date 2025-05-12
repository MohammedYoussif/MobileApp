import i18n from "@/localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

// Constants
export const LANGUAGE_STORAGE_KEY = "@app_language";
export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Gets the current device language
 * @returns The device language code if supported, otherwise "en"
 */
export const getDeviceLanguage = (): SupportedLanguage => {
    const deviceLocale = getLocales()?.[0]?.languageCode ?? "en";

    // Check if device language is supported, otherwise default to English
    return SUPPORTED_LANGUAGES.includes(deviceLocale as SupportedLanguage)
        ? (deviceLocale as SupportedLanguage)
        : "en";
};

/**
 * Gets the saved language from AsyncStorage
 * @returns The saved language or null if not found
 */
export const getSavedLanguage = async (): Promise<SupportedLanguage | null> => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)) {
            return savedLanguage as SupportedLanguage;
        }
        return null;
    } catch (error) {
        console.error("Error retrieving saved language:", error);
        return null;
    }
};

/**
 * Determines the language to use based on saved preference or device setting
 * @returns The language to use
 */
export const determineLanguage = async (): Promise<SupportedLanguage> => {
    const savedLanguage = await getSavedLanguage();
    return savedLanguage || getDeviceLanguage();
};

/**
 * Sets the app's language
 * @param language The language code to set
 */
export const setAppLanguage = async (language: SupportedLanguage): Promise<void> => {
    try {
        // Save to AsyncStorage
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);

        // Set in i18n
        i18n.changeLanguage(language);
    } catch (error) {
        console.error("Error setting app language:", error);
    }
};