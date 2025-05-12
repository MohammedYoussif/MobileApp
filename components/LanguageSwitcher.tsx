import {
  determineLanguage,
  setAppLanguage,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "@/utils/language"; // adjust path if needed
import { Picker } from "@react-native-picker/picker"; // Install this if not already: `expo install @react-native-picker/picker`
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { I18nManager, Platform, StyleSheet, Text, View } from "react-native";

const languageLabels: Record<SupportedLanguage, string> = {
  en: "English",
  ar: "العربية",
};

export default function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const currentLang = await determineLanguage();
      setSelectedLanguage(currentLang);
    };

    loadLanguage();
  }, []);

  const handleChange = async (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    I18nManager.forceRTL(lang === "ar");
    try {
      await Updates.reloadAsync();
    } catch (error) {
      alert(error);
    }
    await setAppLanguage(lang); // triggers i18n change + AsyncStorage save
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) =>
            handleChange(itemValue as SupportedLanguage)
          }
          mode="dropdown"
          style={styles.picker}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Picker.Item key={lang} label={languageLabels[lang]} value={lang} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
