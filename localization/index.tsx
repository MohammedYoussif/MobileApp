/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./langs/ar.json";
import en from "./langs/en.json";

const resources: any = {
  en,
  ar,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  fallbackLng: "en",
  resources,
  supportedLngs: ["en", "ar"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
