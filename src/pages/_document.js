import { Html, Head, Main, NextScript } from "next/document";

/**
 * Documento HTML base para la aplicación
 *
 * Configuro el documento base de la aplicación con las etiquetas meta necesarias,
 * favicon y estilos iniciales. También implemento la detección de tema
 * para evitar el flash de contenido sin estilo al cargar la página.
 */
export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.style.backgroundColor =
                    theme === 'dark' ? '#111827' : '#f9fafb';
                  
                  // Verifico el consentimiento existente y aplico configuraciones
                  var consent = localStorage.getItem('gdpr_consent');
                  if (consent) {
                    window.__consent = JSON.parse(consent);
                  }
                } catch (e) {
                  console.error('Error de inicialización:', e);
                }
              })();
            `,
          }}
        />
      </Head>

      <body className="transition-colors duration-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
