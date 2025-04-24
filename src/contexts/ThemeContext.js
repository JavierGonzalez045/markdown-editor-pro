import { createContext, useContext, useEffect, useState } from "react";

/**
 * Contexto para el manejo del tema de la aplicación
 *
 * Gestiono el tema (claro/oscuro) de manera global usando Context API.
 * Persisto la preferencia del usuario en localStorage y actualizo
 * las clases del DOM para aplicar el tema correspondiente.
 */
const ThemeContext = createContext();

/**
 * Proveedor del contexto de tema
 *
 * Envuelvo la aplicación con este proveedor para que todos los componentes
 * puedan acceder al tema actual y cambiarlo cuando sea necesario.
 */
export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Cargo el tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Actualizo el tema en el DOM y localStorage
  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#111827";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#f9fafb";
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de tema
 *
 * Proporciono una forma sencilla de acceder al contexto del tema
 * desde cualquier componente. Incluyo validación para asegurar
 * que se use dentro del proveedor correcto.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider");
  }
  return context;
}
