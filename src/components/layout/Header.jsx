import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Download, Trash2, Menu, Languages } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import ZenMode from "../ui/ZenMode";
import AutosaveStatus from "../ui/AutosaveStatus";
import MobileSidebar from "./MobileSidebar";
import { useTranslation } from "react-i18next";

/**
 * Componente de encabezado de la aplicación
 *
 * Gestiono la barra de navegación principal con acciones como cambiar idioma,
 * alternar tema, modo zen, descargar y limpiar contenido. En dispositivos móviles
 * muestro un menú hamburguesa que abre un sidebar.
 */
export default function Header({
  onClear,
  onDownload,
  isZen,
  onZenToggle,
  hasContent,
  isSaving,
  lastSaved,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Defino estilos reutilizables para los botones
  const buttonStyles = {
    primary:
      "px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md",
    primaryDisabled:
      "px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed",
    secondary:
      "px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200",
    danger:
      "px-4 py-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200",
    icon: "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.div
              onHoverStart={() => setHoverLogo(true)}
              onHoverEnd={() => setHoverLogo(false)}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div
                animate={hoverLogo ? { rotate: 360, scale: 1.1 } : {}}
                transition={{ duration: 0.7 }}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30"
              >
                <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("header.title")}
              </h1>
            </motion.div>

            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
              <AutosaveStatus isSaving={isSaving} lastSaved={lastSaved} />
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <ZenMode isZen={isZen} onToggle={onZenToggle} />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className={buttonStyles.secondary}
              >
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5" />
                  <span className="font-medium">
                    {i18n.language.toUpperCase()}
                  </span>
                </div>
              </motion.button>

              <ThemeToggle />

              {hasContent && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClear}
                  className={buttonStyles.danger}
                >
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-5 w-5" />
                    <span>{t("header.clear")}</span>
                  </div>
                </motion.button>
              )}

              <motion.button
                whileHover={hasContent ? { scale: 1.05 } : {}}
                whileTap={hasContent ? { scale: 0.95 } : {}}
                onClick={hasContent ? onDownload : undefined}
                className={
                  hasContent
                    ? buttonStyles.primary
                    : buttonStyles.primaryDisabled
                }
                disabled={!hasContent}
              >
                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>{t("header.download")}</span>
                </div>
              </motion.button>
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <div className="mr-2">
                <AutosaveStatus
                  isSaving={isSaving}
                  lastSaved={lastSaved}
                  small
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(true)}
                className={buttonStyles.icon}
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onZenToggle={onZenToggle}
        onClear={onClear}
        onDownload={onDownload}
        isZen={isZen}
        hasContent={hasContent}
      />
    </>
  );
}
