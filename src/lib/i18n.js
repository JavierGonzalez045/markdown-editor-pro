import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationES from "../translations/es.json";
import translationEN from "../translations/en.json";

/**
 * Configuración de internacionalización
 *
 * Configuro i18next para manejar múltiples idiomas en la aplicación.
 * Por defecto inicio en español y proporciono soporte para inglés.
 * Desactivo el suspense para evitar problemas de renderizado.
 */
const resources = {
  es: {
    translation: translationES,
  },
  en: {
    translation: translationEN,
  },
};

// Configuro i18next para iniciar siempre en español
i18n.use(initReactI18next).init({
  resources,
  lng: "es", // Idioma por defecto: español
  fallbackLng: "es",

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
