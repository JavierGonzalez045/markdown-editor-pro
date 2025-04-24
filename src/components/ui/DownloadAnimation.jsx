import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Componente de animación para descargas
 *
 * Creo una animación visual atractiva cuando el usuario descarga un archivo.
 * Incluyo un efecto de portal con partículas que convergen hacia el centro
 * y un mensaje de éxito al finalizar la descarga.
 */
export default function DownloadAnimation({ isAnimating, onComplete }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (isAnimating) {
      setShowPortal(true);
      setTimeout(() => {
        setShowPortal(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onComplete();
        }, 1500);
      }, 1500);
    }
  }, [isAnimating, onComplete]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <>
          <div className="fixed inset-0 z-40 pointer-events-auto cursor-wait" />

          {/* Animación del portal */}
          {showPortal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-hidden"
            >
              {/* Capa de desenfoque */}
              <div
                className={`absolute inset-0 ${
                  isDark ? "bg-black/50" : "bg-white/50"
                } backdrop-blur-sm`}
              />

              {/* Contenido centrado */}
              <div className="fixed inset-0 flex items-center justify-center">
                {/* Vórtice */}
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 0] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div
                    className={`w-96 h-96 rounded-full border-4 ${
                      isDark ? "border-blue-400/50" : "border-blue-500/30"
                    } border-dashed`}
                  />
                </motion.div>

                {/* Icono central */}
                <motion.div
                  className={`absolute ${
                    isDark ? "bg-blue-500" : "bg-blue-600"
                  } rounded-full p-6 shadow-lg ${
                    isDark ? "shadow-blue-400/50" : "shadow-blue-500/50"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <FileDown className="w-12 h-12 text-white" />
                </motion.div>

                {/* Ondas de energía */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className={`absolute border-2 ${
                      isDark ? "border-blue-300" : "border-blue-400"
                    } rounded-full`}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{
                      width: [0, 200, 400],
                      height: [0, 200, 400],
                      opacity: [0.8, 0.4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Partículas */}
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 300 + Math.random() * 200;
                const initialX =
                  window.innerWidth / 2 + Math.cos(angle) * radius;
                const initialY =
                  window.innerHeight / 2 + Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={i}
                    className={`fixed w-4 h-4 ${
                      isDark ? "bg-blue-400" : "bg-blue-500"
                    } rounded-full`}
                    initial={{
                      x: initialX,
                      y: initialY,
                      scale: 1,
                      opacity: 1,
                    }}
                    animate={{
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.05,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </motion.div>
          )}

          {/* Mensaje de éxito */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none"
            >
              <div
                className={`${
                  isDark
                    ? "bg-green-600 shadow-green-500/30"
                    : "bg-green-500 shadow-green-500/50"
                } text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2`}
              >
                <Check className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">
                  {t("download.success")}
                </span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
