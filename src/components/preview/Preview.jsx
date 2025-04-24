import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  oneDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Maximize2, X, Loader2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";

/**
 * Componente de vista previa del contenido Markdown
 *
 * Este componente toma el contenido Markdown y lo renderiza como HTML.
 * Incluye resaltado de sintaxis para bloques de código, soporte para tablas GFM
 * y la capacidad de entrar en modo pantalla completa.
 */
const Preview = ({
  content,
  isZen,
  isLoading,
  isFullscreen = false,
  onEnterFullscreen,
  onExitFullscreen,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const syntaxTheme = theme === "dark" ? oneDark : tomorrow;

  if (isZen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`preview-container w-full relative bg-white dark:bg-gray-900 shadow-sm border ${
        isFullscreen
          ? "fixed inset-0 z-50 border-none"
          : "h-full rounded-lg md:rounded-r-lg md:rounded-l-none border-gray-200 dark:border-gray-800"
      }`}
    >
      <div
        className={`${
          isFullscreen ? "h-14" : "h-12 md:h-14"
        } px-3 md:px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10 relative`}
      >
        <div className="flex items-center">
          <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("preview.title")}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {isFullscreen && <ThemeToggle />}
          {isFullscreen ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExitFullscreen}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
              title="Salir de pantalla completa"
            >
              <X className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterFullscreen}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Pantalla completa"
            >
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      <div
        className={`${
          isFullscreen
            ? "h-[calc(100vh-3.5rem)] overflow-auto p-8 md:p-12"
            : "h-[calc(100%-3rem)] md:h-[calc(100%-3.5rem)] overflow-auto p-4 md:p-6"
        }`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              >
                <Loader2 className="w-8 h-8 text-blue-500" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`prose prose-sm md:prose dark:prose-invert ${
                isFullscreen ? "max-w-4xl mx-auto" : "max-w-none"
              } prose-blue prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg overflow-hidden text-sm md:text-base"
                      >
                        <SyntaxHighlighter
                          style={syntaxTheme}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </motion.div>
                    ) : (
                      <code
                        className={`${className} px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTYwIDEyMCI+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBkPSJNNTAgNTBoNjB2MjBINTB6IiBmaWxsPSIjOWNhM2FmIi8+PHBhdGggZD0iTTUwIDQwaDIwdjQwSDUweiIgZmlsbD0iIzljYTNhZiIvPjxwYXRoIGQ9Ik05MCA0MGgyMHY0MEg5MHoiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4=";
                      }}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(Preview);
