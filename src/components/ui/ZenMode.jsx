import { motion, AnimatePresence } from "framer-motion";
import { Focus } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Componente para activar/desactivar el modo zen
 *
 * Proporciono un botón para alternar el modo zen, que ofrece una experiencia
 * de escritura sin distracciones. Utilizo animaciones suaves para la transición
 * entre estados.
 */
export default function ZenMode({ isZen, onToggle }) {
  const { t } = useTranslation();

  return (
    <motion.button
      data-testid="zen-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        isZen
          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      } hover:bg-opacity-80 transition-colors`}
      aria-label={isZen ? t("zenMode.exit") : t("zenMode.enter")}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="zen-icon"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center space-x-2"
        >
          <Focus className="h-5 w-5" />
          <span className="hidden md:inline">Zen</span>
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
