import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Componente de modal reutilizable
 *
 * Creo un modal genérico que se puede utilizar para confirmaciones,
 * advertencias y mensajes de error. Utilizo animaciones Framer Motion
 * para transiciones suaves y una interfaz visualmente atractiva.
 */
export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between p-6 bg-gradient-to-r from-amber-500/10 to-red-500/10 dark:from-amber-500/5 dark:to-red-500/5">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  type === "warning"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </div>

          <div className="flex justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-800/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t("modal.cancel")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                type === "warning"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {t("modal.confirm")}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
