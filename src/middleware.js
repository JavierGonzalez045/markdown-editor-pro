import { NextResponse } from "next/server";
import rateLimit from "./utils/rateLimit";

/**
 * Middleware de seguridad
 *
 * Implemento medidas de seguridad a nivel de middleware para proteger
 * la aplicación. Incluyo rate limiting, headers de seguridad, CSP y
 * protección contra ataques comunes.
 */
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 500,
});

export async function middleware(request) {
  try {
    await limiter.check(request, 30, "CACHE_TOKEN");
  } catch {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: http: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.github.com https://ipapi.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_ORIGIN || "*"
  );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
