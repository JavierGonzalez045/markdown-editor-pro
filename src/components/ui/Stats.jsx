import { motion } from "framer-motion";
import { FileText, Type, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

/**
 * Componente de estadísticas del contenido
 *
 * Muestro estadísticas en tiempo real del contenido del editor
 * incluyendo número de palabras, caracteres y líneas. Utilizo
 * animaciones suaves para una mejor experiencia visual.
 */
export default function Stats({ content }) {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const characters = content.length;
  const lines = content.split("\n").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 md:space-x-4 text-[10px] md:text-sm text-gray-400 dark:text-gray-500"
    >
      <div className="flex items-center space-x-1">
        <Type className="w-3 h-3 md:w-4 md:h-4" />
        {isHydrated && (
          <span className="hidden sm:inline">{t("stats.words")}</span>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {words}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <FileText className="w-3 h-3 md:w-4 md:h-4" />
        {isHydrated && (
          <span className="hidden sm:inline">{t("stats.characters")}</span>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {characters}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Hash className="w-3 h-3 md:w-4 md:h-4" />
        {isHydrated && (
          <span className="hidden sm:inline">{t("stats.lines")}</span>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {lines}
        </span>
      </div>
    </motion.div>
  );
}
