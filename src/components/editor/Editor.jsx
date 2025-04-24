import { useRef, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Image,
  Strikethrough,
  CheckSquare,
  Minus,
  HelpCircle,
  X,
} from "lucide-react";
import LineNumbers from "./LineNumbers";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";
import AutosaveStatus from "../ui/AutosaveStatus";

/**
 * Componente principal del editor
 *
 * Este es el corazón del editor donde los usuarios escriben su contenido Markdown.
 * Incluye una barra de herramientas con accesos rápidos para formateo,
 * números de línea y soporte para atajos de teclado.
 */
const Editor = ({
  value,
  onChange,
  lineCount,
  isZen,
  onExitZen,
  isSaving,
  lastSaved,
}) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const { t } = useTranslation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Sincronizo el scroll entre el textarea y los números de línea
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const insertText = (before, after = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(
          start + before.length,
          start + before.length
        );
      }
    }, 0);
  };

  // Defino los botones de la barra de herramientas
  const toolbarButtons = [
    {
      icon: Heading1,
      action: () => insertText("# ", ""),
      title: "Encabezado 1 (Ctrl+Alt+1)",
    },
    {
      icon: Heading2,
      action: () => insertText("## ", ""),
      title: "Encabezado 2 (Ctrl+Alt+2)",
    },
    {
      icon: Heading3,
      action: () => insertText("### ", ""),
      title: "Encabezado 3 (Ctrl+Alt+3)",
    },
    {
      icon: Bold,
      action: () => insertText("**", "**"),
      title: "Negrita (Ctrl+B)",
    },
    {
      icon: Italic,
      action: () => insertText("*", "*"),
      title: "Cursiva (Ctrl+I)",
    },
    {
      icon: Strikethrough,
      action: () => insertText("~~", "~~"),
      title: "Tachado (Ctrl+Shift+X)",
    },
    {
      icon: Link,
      action: () => insertText("[", "](url)"),
      title: "Enlace (Ctrl+K)",
    },
    {
      icon: Image,
      action: () => insertText("![alt text](", ")"),
      title: "Imagen (Ctrl+Shift+I)",
    },
    {
      icon: Code,
      action: () => insertText("`", "`"),
      title: "Código en línea (Ctrl+`)",
    },
    {
      icon: CodeSquare,
      action: () => insertText("```\n", "\n```"),
      title: "Bloque de código (Ctrl+Shift+`)",
    },
    { icon: List, action: () => insertText("- ", ""), title: "Lista" },
    {
      icon: ListOrdered,
      action: () => insertText("1. ", ""),
      title: "Lista numerada",
    },
    {
      icon: CheckSquare,
      action: () => insertText("- [ ] ", ""),
      title: "Lista de tareas",
    },
    { icon: Quote, action: () => insertText("> ", ""), title: "Cita" },
    {
      icon: Table,
      action: () =>
        insertText(
          "| Columna 1 | Columna 2 |\n| --------- | --------- |\n| ",
          " | |\n"
        ),
      title: "Tabla",
    },
    {
      icon: Minus,
      action: () => insertText("\n---\n", ""),
      title: "Línea horizontal",
    },
  ];

  // Manejo los atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            insertText("**", "**");
            break;
          case "i":
            e.preventDefault();
            insertText("*", "*");
            break;
          case "k":
            e.preventDefault();
            insertText("[", "](url)");
            break;
          case "`":
            e.preventDefault();
            if (e.shiftKey) {
              insertText("```\n", "\n```");
            } else {
              insertText("`", "`");
            }
            break;
          case "x":
            if (e.shiftKey) {
              e.preventDefault();
              insertText("~~", "~~");
            }
            break;
        }

        if (e.altKey) {
          switch (e.key) {
            case "1":
              e.preventDefault();
              insertText("# ", "");
              break;
            case "2":
              e.preventDefault();
              insertText("## ", "");
              break;
            case "3":
              e.preventDefault();
              insertText("### ", "");
              break;
          }
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
      if (!isZen) {
        setTimeout(() => textarea.focus(), 500);
      }
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [value, isZen]);

  // Defino los atajos de teclado para mostrar en el panel de ayuda
  const shortcuts = [
    { keys: "Ctrl + B", action: "Negrita" },
    { keys: "Ctrl + I", action: "Cursiva" },
    { keys: "Ctrl + K", action: "Enlace" },
    { keys: "Ctrl + `", action: "Código en línea" },
    { keys: "Ctrl + Shift + `", action: "Bloque de código" },
    { keys: "Ctrl + Shift + X", action: "Tachado" },
    { keys: "Ctrl + Alt + 1", action: "Encabezado 1" },
    { keys: "Ctrl + Alt + 2", action: "Encabezado 2" },
    { keys: "Ctrl + Alt + 3", action: "Encabezado 3" },
    { keys: "Ctrl + S", action: "Guardar/Descargar" },
    { keys: "Esc", action: "Salir del modo Zen" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`editor-container w-full h-full relative ${
        isZen
          ? "bg-white dark:bg-gray-900"
          : "bg-white dark:bg-gray-900 rounded-lg md:rounded-l-lg md:rounded-r-none shadow-sm border border-gray-200 dark:border-gray-800"
      }`}
    >
      {isZen ? (
        <div className="h-14 px-3 md:px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10 relative">
          <div className="flex items-center">
            <Edit3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("editor.title")} - Modo Zen
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <AutosaveStatus isSaving={isSaving} lastSaved={lastSaved} />
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                {toolbarButtons.map(({ icon: Icon, action, title }) => (
                  <motion.button
                    key={title}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={action}
                    className="p-1 md:p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    title={title}
                  >
                    <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  title="Atajos de teclado"
                >
                  <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
                </motion.button>
              </div>
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExitZen}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
                title="Salir del modo Zen"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
      ) : (
        <div className="h-12 md:h-14 px-3 md:px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10 rounded-t-lg md:rounded-tl-lg md:rounded-tr-none relative">
          <div className="flex items-center">
            <Edit3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("editor.title")}
            </span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {toolbarButtons.map(({ icon: Icon, action, title }) => (
              <motion.button
                key={title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={action}
                className="p-1 md:p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                title={title}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4" />
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="p-1 md:p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Atajos de teclado"
            >
              <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
            </motion.button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
      )}

      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute ${
            isZen ? "top-16" : "top-14"
          } right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-20`}
        >
          <h3 className="text-sm font-semibold mb-2">Atajos de teclado</h3>
          <div className="grid gap-2">
            {shortcuts.map(({ keys, action }) => (
              <div key={keys} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">{keys}</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div
        className={`flex ${
          isZen
            ? "h-[calc(100%-3.5rem)]"
            : "h-[calc(100%-3rem)] md:h-[calc(100%-3.5rem)]"
        }`}
      >
        <div
          ref={lineNumbersRef}
          className={`overflow-hidden border-r border-gray-200 dark:border-gray-700 w-10 md:w-12 bg-gray-50 dark:bg-gray-800/50`}
        >
          <LineNumbers count={lineCount} />
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className={`flex-1 p-4 md:p-6 focus:outline-none resize-none font-mono leading-6 bg-transparent dark:text-gray-200 ${
            isZen
              ? "text-lg md:text-xl focus:ring-0"
              : "text-sm md:text-base focus:ring-2 focus:ring-blue-500/20"
          }`}
          placeholder={t("editor.placeholder")}
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </motion.div>
  );
};

export default memo(Editor);
