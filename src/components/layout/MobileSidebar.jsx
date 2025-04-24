import { motion, AnimatePresence } from "framer-motion";
import { X, Focus, Languages, Download, Trash2, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";

/**
 * Sidebar para dispositivos móviles
 *
 * Implemento un menú lateral deslizante para dispositivos móviles que
 * contiene todas las opciones disponibles en el header desktop.
 * Utilizo grupos organizados y animaciones fluidas para una mejor experiencia.
 */
export default function MobileSidebar({
  isOpen,
  onClose,
  onZenToggle,
  onClear,
  onDownload,
  isZen,
  hasContent,
}) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const sidebarAnimation = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Organizo las opciones en grupos
  const menuGroups = [
    {
      title: i18n.language === "es" ? "Modo de Escritura" : "Writing Mode",
      items: [
        {
          icon: Focus,
          label: isZen
            ? i18n.language === "es"
              ? "Salir del modo Zen"
              : "Exit Zen mode"
            : i18n.language === "es"
            ? "Modo Zen"
            : "Zen Mode",
          onClick: () => {
            onZenToggle();
            onClose();
          },
          className: isZen
            ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
            : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30",
        },
      ],
    },
    {
      title: i18n.language === "es" ? "Preferencias" : "Preferences",
      items: [
        {
          icon: Languages,
          label:
            i18n.language === "es" ? "Cambiar a English" : "Switch to Español",
          onClick: () => {
            toggleLanguage();
            onClose();
          },
          className:
            "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30",
        },
      ],
    },
    {
      title: i18n.language === "es" ? "Acciones" : "Actions",
      items: [
        ...(hasContent
          ? [
              {
                icon: Trash2,
                label: t("header.clear"),
                onClick: () => {
                  onClear();
                  onClose();
                },
                className:
                  "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
              },
            ]
          : []),
        {
          icon: Download,
          label: t("header.download"),
          onClick: hasContent
            ? () => {
                onDownload();
                onClose();
              }
            : undefined,
          className: hasContent
            ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            : "text-gray-400 dark:text-gray-500 cursor-not-allowed",
          disabled: !hasContent,
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          <motion.div
            variants={sidebarAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 md:hidden border-l border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MarkEditor Pro
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    {i18n.language === "es"
                      ? "Tema de la Aplicación"
                      : "Application Theme"}
                  </h3>
                  <div className="flex justify-start px-1">
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {menuGroups.map((group, groupIndex) => (
                  <div key={group.title} className="mb-6">
                    <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </h3>
                    <div className="px-4 space-y-1">
                      {group.items.map(
                        (
                          { icon: Icon, label, onClick, className, disabled },
                          index
                        ) => (
                          <motion.button
                            key={label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: groupIndex * 0.1 + index * 0.05,
                            }}
                            onClick={onClick}
                            disabled={disabled}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${className}`}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{label}</span>
                          </motion.button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>© {new Date().getFullYear()}</span>
                    <span>•</span>
                    <span className="font-medium">
                      Johan Javier Gonzalez Perez
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {i18n.language === "es"
                      ? "Creando herramientas que mejoran tu productividad"
                      : "Creating tools that improve your productivity"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
