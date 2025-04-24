import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Image,
  Strikethrough,
  CheckSquare,
  Minus,
} from "lucide-react";

/**
 * Panel inferior deslizante con herramientas de formato
 *
 * Creo un bottom sheet que aparece desde la parte inferior de la pantalla
 * en dispositivos móviles. Contiene herramientas de formato markdown
 * organizadas por categorías para una mejor experiencia de usuario.
 */
export default function ToolbarBottomSheet({ isOpen, onClose, onInsertText }) {
  // Manejo el gesto de deslizar hacia abajo para cerrar
  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const toolGroups = [
    {
      name: "Headings",
      tools: [
        { icon: Heading1, action: () => onInsertText("# ", ""), label: "H1" },
        { icon: Heading2, action: () => onInsertText("## ", ""), label: "H2" },
        { icon: Heading3, action: () => onInsertText("### ", ""), label: "H3" },
      ],
    },
    {
      name: "Formato",
      tools: [
        {
          icon: Bold,
          action: () => onInsertText("**", "**"),
          label: "Negrita",
        },
        {
          icon: Italic,
          action: () => onInsertText("*", "*"),
          label: "Cursiva",
        },
        {
          icon: Strikethrough,
          action: () => onInsertText("~~", "~~"),
          label: "Tachado",
        },
        { icon: Code, action: () => onInsertText("`", "`"), label: "Código" },
      ],
    },
    {
      name: "Enlaces",
      tools: [
        {
          icon: Link,
          action: () => onInsertText("[", "](url)"),
          label: "Enlace",
        },
        {
          icon: Image,
          action: () => onInsertText("![", "](url)"),
          label: "Imagen",
        },
      ],
    },
    {
      name: "Listas",
      tools: [
        { icon: List, action: () => onInsertText("- ", ""), label: "Lista" },
        {
          icon: ListOrdered,
          action: () => onInsertText("1. ", ""),
          label: "Numerada",
        },
        {
          icon: CheckSquare,
          action: () => onInsertText("- [ ] ", ""),
          label: "Tareas",
        },
      ],
    },
    {
      name: "Otros",
      tools: [
        { icon: Quote, action: () => onInsertText("> ", ""), label: "Cita" },
        {
          icon: Table,
          action: () =>
            onInsertText("| Col1 | Col2 |\n|------|------|\n| ", " | |\n"),
          label: "Tabla",
        },
        {
          icon: Minus,
          action: () => onInsertText("\n---\n", ""),
          label: "Línea",
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 
                     rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Handle para arrastrar */}
            <div className="flex justify-center p-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Herramientas de Formato
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* Contenido scrollable */}
            <div className="overflow-y-auto p-4 pb-8">
              {toolGroups.map((group, groupIndex) => (
                <div key={group.name} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">
                    {group.name}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {group.tools.map(({ icon: Icon, action, label }) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action}
                        className="flex flex-col items-center justify-center p-4 rounded-xl 
                                 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                                 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.05 }}
                      >
                        <Icon className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Información */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Presiona la herramienta para insertar el formato en el editor
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
