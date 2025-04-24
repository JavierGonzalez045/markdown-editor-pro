/**
 * Configuración de Seguridad
 *
 * Defino todas las configuraciones de seguridad
 * para la aplicación en un solo lugar.
 *
 * @author Johan Javier Gonzalez Perez
 */

export const securityConfig = {
  // Límites de tamaño
  maxContentSize: 5 * 1024 * 1024, // 5MB
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilenameLength: 255,

  // Rate limiting
  rateLimit: {
    interval: 60 * 1000, // 1 minuto
    maxRequests: 30, // 30 requests por minuto
    uniqueTokenPerInterval: 500,
  },

  // CSP (Content Security Policy)
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      "https://cdn.jsdelivr.net",
    ],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "https://api.github.com"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
  },

  // Headers de seguridad
  securityHeaders: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  },

  // Configuración de CORS
  cors: {
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // Lista de extensiones permitidas
  allowedExtensions: [".md", ".markdown", ".txt"],

  // Lista de protocolos seguros para URLs
  safeProtocols: ["http:", "https:", "mailto:"],

  // Configuración de sanitización
  sanitization: {
    // Tags HTML permitidos en el markdown
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "strong",
      "em",
      "code",
      "pre",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
      "br",
      "div",
      "span",
    ],

    // Atributos HTML permitidos
    allowedAttributes: {
      "*": ["class", "id"],
      a: ["href", "title", "target"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
    },

    // Patrones a remover
    dangerousPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /onclick/gi,
      /onerror/gi,
      /onload/gi,
    ],
  },

  // Configuración de cookies (si se usan)
  cookies: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  },

  // Configuración de sesiones
  session: {
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    secure: process.env.NODE_ENV === "production",
  },
};

/**
 * Genero el string CSP a partir de la configuración
 * @returns {string} - CSP string
 */
export function generateCSP() {
  return Object.entries(securityConfig.csp)
    .map(([key, values]) => {
      const directive = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${directive} ${values.join(" ")}`;
    })
    .join("; ");
}

/**
 * Verifico si un archivo tiene una extensión permitida
 * @param {string} filename - Nombre del archivo
 * @returns {boolean} - True si la extensión está permitida
 */
export function isAllowedFileExtension(filename) {
  const ext = "." + filename.split(".").pop().toLowerCase();
  return securityConfig.allowedExtensions.includes(ext);
}

/**
 * Verifico si un protocolo es seguro
 * @param {string} protocol - Protocolo a verificar
 * @returns {boolean} - True si el protocolo es seguro
 */
export function isSafeProtocol(protocol) {
  return securityConfig.safeProtocols.includes(protocol.toLowerCase());
}
