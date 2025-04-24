import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Code2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Stats from "../ui/Stats";

/**
 * Componente de pie de página
 *
 * Muestro información del desarrollador, estadísticas del contenido
 * y enlaces a mis redes sociales. Este componente se oculta en modo zen
 * para proporcionar una experiencia sin distracciones.
 */
export default function Footer({ content, isZen }) {
  const { t } = useTranslation();

  if (isZen) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <div className="flex justify-center md:order-2">
            <Stats content={content} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left md:order-1"
          >
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {t("footer.developedBy")}
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">
                Johan Javier Gonzalez Perez
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {currentYear} MarkEditor Pro • {t("footer.rights")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center space-x-4 md:order-3"
          >
            {[
              {
                icon: Github,
                label: "GitHub",
                href: "https://github.com/JavierGonzalez045",
              },
              {
                icon: Linkedin,
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/johanjaviergonzalezperez/",
              },
              {
                icon: Instagram,
                label: "Instagram",
                href: "https://www.instagram.com/javiergonzalez045/",
              },
            ].map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label={label}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
