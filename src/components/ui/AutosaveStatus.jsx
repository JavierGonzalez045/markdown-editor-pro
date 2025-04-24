import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Componente de estado de autoguardado
 *
 * Muestro el estado actual del autoguardado con animaciones visuales.
 * Incluyo un tooltip con información detallada y manejo diferentes estados
 * como guardando, guardado y error.
 */
export default function AutosaveStatus({
  isSaving,
  lastSaved,
  error,
  small = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const intervalRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isSaving) {
      setDotCount(1);
      intervalRef.current = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 400);
    } else {
      clearInterval(intervalRef.current);
      setDotCount(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isSaving]);

  const statusVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderIcon = () => {
    if (error) {
      return (
        <AlertTriangle
          className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"} text-red-500`}
        />
      );
    }
    if (isSaving) {
      return (
        <Loader2
          className={`${
            small ? "w-3.5 h-3.5" : "w-4 h-4"
          } text-blue-500 animate-spin`}
        />
      );
    }
    return (
      <div
        className={`${
          small ? "w-3.5 h-3.5" : "w-4 h-4"
        } rounded-full bg-green-500 flex items-center justify-center`}
      >
        <Check className={`${small ? "w-2.5 h-2.5" : "w-3 h-3"} text-white`} />
      </div>
    );
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={statusVariants}
        className={`flex items-center ${
          small ? "space-x-1.5" : "space-x-2"
        } px-3 py-1.5 rounded-full ${
          error
            ? "bg-red-100 dark:bg-red-900/30"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {renderIcon()}
        {!small && isHydrated && (
          <span
            className={`text-sm ${
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {error
              ? t("autosave.error")
              : isSaving
              ? `${t("autosave.saving")}${".".repeat(dotCount)}`
              : t("autosave.saved")}
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {showTooltip && isHydrated && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 flex justify-center"
          >
            <div className="relative">
              <div
                className="px-4 py-2.5 bg-gray-900 dark:bg-gray-800 
                           text-white text-sm rounded-lg shadow-xl whitespace-nowrap 
                           border border-gray-700 dark:border-gray-600"
              >
                {error ? (
                  <span className="text-red-400">{error}</span>
                ) : lastSaved ? (
                  <span>
                    {t("autosave.savedAt")} {formatTime(lastSaved)}
                  </span>
                ) : (
                  <span>{t("autosave.autoSaveInfo")}</span>
                )}
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -top-2 
                           w-0 h-0 border-x-8 border-x-transparent 
                           border-b-8 border-b-gray-900 dark:border-b-gray-800"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
