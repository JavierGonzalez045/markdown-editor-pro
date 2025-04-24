import React from "react";
import { motion } from "framer-motion";

/**
 * Componente de números de línea
 *
 * Renderizo los números de línea para el editor de código.
 * Utilizo animaciones para una aparición suave de cada número
 * cuando se añaden nuevas líneas al editor.
 */
export default function LineNumbers({ count }) {
  return (
    <div className="h-full overflow-hidden">
      <div className="select-none text-right pr-4 pt-6 text-gray-400 dark:text-gray-600 font-mono text-sm leading-6">
        {Array.from({ length: count }, (_, i) => (
          <motion.div
            key={i + 1}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.01 }}
            className="h-6 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
