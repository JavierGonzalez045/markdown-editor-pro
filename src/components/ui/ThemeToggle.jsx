import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Componente para alternar entre temas claro y oscuro
 *
 * Implemento un toggle switch animado que permite cambiar entre los temas
 * de la aplicación. Incluye animaciones para un cambio suave y visualmente
 * atractivo entre los estados.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      data-testid="theme-toggle"
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDark ? "bg-gray-800" : "bg-blue-100"
      }`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {/* Animación de estrellas para el modo oscuro */}
      {isDark && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Animación de nubes para el modo claro */}
      {!isDark && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-2 bg-white/50 rounded-full blur-sm"
              style={{
                left: `${10 + i * 30}%`,
                top: `${40 + i * 20}%`,
              }}
              animate={{
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Interruptor circular */}
      <motion.div
        className="relative z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 32 : 0,
          rotate: isDark ? 360 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-gray-800" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
