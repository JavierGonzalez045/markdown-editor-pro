import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Eye, Wrench } from "lucide-react";
import Editor from "../editor/Editor";
import Preview from "../preview/Preview";
import ToolbarBottomSheet from "./ToolbarBottomSheet";
import { useTranslation } from "react-i18next";

/**
 * Componente de tabs para dispositivos móviles
 *
 * En dispositivos móviles, divido la experiencia entre editor y vista previa
 * usando tabs. También incluyo un botón flotante para acceder rápidamente
 * a las herramientas de formato.
 */
export default function MobileEditorTabs({
  content,
  onChange,
  lineCount,
  isPreviewLoading,
  onEnterFullscreen,
}) {
  const [activeTab, setActiveTab] = useState("editor");
  const [showToolbar, setShowToolbar] = useState(false);
  const { t } = useTranslation();

  const tabAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const tabs = [
    {
      id: "editor",
      label: t("editor.title"),
      icon: Edit3,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "preview",
      label: t("preview.title"),
      icon: Eye,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-1 p-1">
          {tabs.map(({ id, label, icon: Icon, color }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  activeTab === id
                    ? `bg-gradient-to-r ${color} text-white shadow-lg`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
              {activeTab === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "editor" ? (
            <motion.div
              key="editor"
              variants={tabAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Editor
                value={content}
                onChange={onChange}
                lineCount={lineCount}
                isZen={false}
                isMobile={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              variants={tabAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Preview
                content={content}
                isLoading={isPreviewLoading}
                onEnterFullscreen={onEnterFullscreen}
                isMobile={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeTab === "editor" && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowToolbar(true)}
          className="fixed bottom-6 right-6 z-30 
                     bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                     p-4 rounded-full shadow-lg shadow-blue-500/25 
                     flex items-center justify-center"
        >
          <Wrench className="h-6 w-6" />
        </motion.button>
      )}

      <ToolbarBottomSheet
        isOpen={showToolbar}
        onClose={() => setShowToolbar(false)}
        onInsertText={(before, after) => {
          const textarea = document.querySelector("textarea");
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = content.substring(start, end);
            const newText =
              content.substring(0, start) +
              before +
              selectedText +
              after +
              content.substring(end);
            onChange(newText);
            setTimeout(() => {
              textarea.focus();
              if (selectedText) {
                textarea.setSelectionRange(
                  start + before.length,
                  end + before.length
                );
              } else {
                textarea.setSelectionRange(
                  start + before.length,
                  start + before.length
                );
              }
            }, 0);
          }
          setShowToolbar(false);
        }}
      />
    </div>
  );
}
