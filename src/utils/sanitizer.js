/**
 * Utilidades de sanitización
 *
 * Implemento funciones para limpiar y validar el contenido
 * protegiendo la aplicación contra ataques XSS y otras vulnerabilidades.
 */

/**
 * Sanitizo el contenido markdown
 *
 * Elimino scripts peligrosos y atributos maliciosos del contenido
 * para prevenir ataques XSS. Solo elimino lo estrictamente necesario
 * para mantener la funcionalidad del markdown.
 */
export function sanitizeMarkdown(content) {
  if (!content) return "";

  let sanitized = content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, "");
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, "");
  sanitized = sanitized.replace(/javascript:/gi, "");
  return sanitized;
}

/**
 * Valido el tamaño del contenido
 *
 * Verifico que el contenido no exceda un tamaño máximo para
 * prevenir ataques de denegación de servicio por consumo de memoria.
 */
export function validateContentSize(content, maxSize = 5 * 1024 * 1024) {
  const encoder = new TextEncoder();
  const contentSize = encoder.encode(content).length;
  return contentSize <= maxSize;
}

/**
 * Sanitizo nombres de archivo
 *
 * Limpio los nombres de archivo para prevenir ataques de
 * path traversal y otros problemas de seguridad.
 */
export function sanitizeFilename(filename) {
  let sanitized = filename.replace(/[^a-zA-Z0-9-_.]/g, "");

  sanitized = sanitized.replace(/\.\./g, "");

  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized;
}

/**
 * Verifico si una URL es segura
 *
 * Valido que las URLs solo usen protocolos seguros
 * para prevenir ataques mediante URLs maliciosas.
 */
export function isSafeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Limpio el contenido antes de guardarlo
 *
 * Normalizo el formato del contenido para mantener
 * consistencia y evitar problemas de formato.
 */
export function cleanContent(content) {
  let cleaned = content.replace(/\r\n/g, "\n");

  cleaned = cleaned.replace(/[ \t]+$/gm, "");

  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned;
}
