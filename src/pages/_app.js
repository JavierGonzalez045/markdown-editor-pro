import "../styles/globals.css";
import "../lib/i18n";
import { ThemeProvider } from "../contexts/ThemeContext";
import Script from "next/script";
import ConsentManager from "../components/consent/ConsentManager";
import { useEffect, useState } from "react";
import i18n from "../lib/i18n";

/**
 * Componente principal de la aplicación
 *
 * Este es el punto de entrada de nuestra aplicación Next.js. Aquí configuro
 * el contexto global para el tema y manejo el consentimiento de cookies.
 * También me aseguro de que el idioma se cargue correctamente después
 * de que la aplicación se monte en el cliente.
 */
function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Cambio el idioma solo después de que el componente se monte
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage && savedLanguage !== "es") {
        setTimeout(() => {
          i18n.changeLanguage(savedLanguage);
        }, 100);
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <Script
        id="tcf-stub"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // IAB TCF API Stub
            var __tcfapi = function(command, version, callback, parameter) {
              if (command === "addEventListener") {
                callback({eventStatus: "tcloaded", gdprApplies: true}, true);
              }
            };
          `,
        }}
      />
      <Component {...pageProps} />
      {mounted && <ConsentManager />}
    </ThemeProvider>
  );
}

export default MyApp;
