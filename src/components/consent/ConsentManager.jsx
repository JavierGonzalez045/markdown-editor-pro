import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Gestor de consentimiento de cookies
 *
 * Implemento un gestor de consentimiento GDPR compliant para manejar las
 * preferencias de cookies del usuario. Detecto automáticamente si el usuario
 * está en un país sujeto a GDPR y muestro el banner de consentimiento.
 */
export default function ConsentManager() {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functionality: false,
    analytics: false,
    advertising: false,
  });

  // Verifico la ubicación del usuario para determinar si necesita consentimiento GDPR
  const checkUserLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const gdprCountries = [
        "AT",
        "BE",
        "BG",
        "HR",
        "CY",
        "CZ",
        "DK",
        "EE",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IE",
        "IT",
        "LV",
        "LT",
        "LU",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SK",
        "SI",
        "ES",
        "SE",
        "GB",
        "CH",
      ];
      return gdprCountries.includes(data.country_code);
    } catch (error) {
      console.error("Error verificando ubicación:", error);
      return true;
    }
  };

  useEffect(() => {
    const initConsent = async () => {
      const storedConsent = localStorage.getItem("gdpr_consent");
      const isGDPRCountry =
        process.env.NODE_ENV === "development"
          ? true
          : await checkUserLocation();

      if (!storedConsent && isGDPRCountry) {
        setShowConsent(true);
      } else if (storedConsent) {
        setConsentStatus(JSON.parse(storedConsent));
        applyConsent(JSON.parse(storedConsent));
      }
      setLoading(false);
    };

    initConsent();
  }, []);

  // En desarrollo, permito reabrir el banner con Ctrl+Shift+C
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const handleKeyPress = (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "C") {
          setShowConsent(true);
        }
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, []);

  const applyConsent = (consent) => {
    if (window.__tcfapi) {
      window.__tcfapi("addEventListener", 2, (tcData, success) => {
        if (success && tcData.eventStatus === "tcloaded") {
          console.log("TCF cargado:", tcData);
        }
      });
    }
  };

  const handleConsent = (type) => {
    let consent = {};

    switch (type) {
      case "accept":
        consent = {
          necessary: true,
          functionality: true,
          analytics: true,
          advertising: true,
          timestamp: new Date().toISOString(),
        };
        break;
      case "reject":
        consent = {
          necessary: true,
          functionality: false,
          analytics: false,
          advertising: false,
          timestamp: new Date().toISOString(),
        };
        break;
      case "custom":
        consent = {
          ...preferences,
          timestamp: new Date().toISOString(),
        };
        break;
    }

    localStorage.setItem("gdpr_consent", JSON.stringify(consent));
    setConsentStatus(consent);
    applyConsent(consent);
    setShowConsent(false);
  };

  if (loading) return null;

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl sm:px-6 lg:px-8"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 hidden sm:block mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:hidden mb-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold dark:text-white">
                    {t("consent.title")}
                  </h3>
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white hidden sm:block">
                  {t("consent.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {t("consent.description")}
                </p>

                <motion.div
                  initial={false}
                  animate={{ height: showDetails ? "auto" : 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {t("consent.necessary")}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {t("consent.necessaryDesc")}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 self-end sm:self-auto"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {t("consent.functionality")}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {t("consent.functionalityDesc")}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.functionality}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            functionality: e.target.checked,
                          })
                        }
                        className="h-4 w-4 self-end sm:self-auto"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {t("consent.analytics")}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {t("consent.analyticsDesc")}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            analytics: e.target.checked,
                          })
                        }
                        className="h-4 w-4 self-end sm:self-auto"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {t("consent.advertising")}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {t("consent.advertisingDesc")}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.advertising}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            advertising: e.target.checked,
                          })
                        }
                        className="h-4 w-4 self-end sm:self-auto"
                      />
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConsent("reject")}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base"
                  >
                    {t("consent.rejectAll")}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Settings className="w-4 h-4" />
                    {t("consent.manageOptions")}
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </motion.button>

                  {showDetails && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleConsent("custom")}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base"
                    >
                      {t("consent.savePreferences")}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConsent("accept")}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                  >
                    {t("consent.acceptAll")}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
