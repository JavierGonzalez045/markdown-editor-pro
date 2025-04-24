import { useState, useEffect, useRef } from "react";
import { initialMarkdownExampleES } from "../data/initialExample.es";
import { initialMarkdownExampleEN } from "../data/initialExample.en";
import { useTranslation } from "react-i18next";
import { validateContentSize } from "../utils/sanitizer";

/**
 * Hook personalizado para manejar el contenido Markdown
 *
 * Gestiono todo lo relacionado con el contenido del editor: carga inicial,
 * cambios de idioma, guardado en localStorage y validación de tamaño.
 * Este hook centraliza la lógica del contenido markdown.
 */
export default function useMarkdown(initialValue = "") {
  const [content, setContent] = useState(initialValue);
  const [lineCount, setLineCount] = useState(1);
  const { i18n } = useTranslation();
  const previousLanguage = useRef(i18n.language);
  const isInitialLoad = useRef(true);

  const isInitialContent = (text) => {
    const cleanText = text.trim();
    return (
      cleanText === initialMarkdownExampleES.trim() ||
      cleanText === initialMarkdownExampleEN.trim()
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      const savedContent = localStorage.getItem("markdownContent");
      if (savedContent) {
        if (validateContentSize(savedContent)) {
          setContent(savedContent);
          updateLineCount(savedContent);
        } else {
          console.warn("Contenido guardado excede el tamaño máximo permitido");
          loadInitialExample();
        }
      } else {
        loadInitialExample();
      }
      isInitialLoad.current = false;
    }
  }, []);

  const loadInitialExample = () => {
    const initialExample =
      i18n.language === "es"
        ? initialMarkdownExampleES
        : initialMarkdownExampleEN;
    setContent(initialExample);
    updateLineCount(initialExample);
  };

  useEffect(() => {
    if (isInitialLoad.current) return;

    if (i18n.language !== previousLanguage.current) {
      if (isInitialContent(content)) {
        const newExample =
          i18n.language === "es"
            ? initialMarkdownExampleES
            : initialMarkdownExampleEN;
        setContent(newExample);
        updateLineCount(newExample);
      }
      previousLanguage.current = i18n.language;
    }
  }, [i18n.language, content]);

  const updateLineCount = (text) => {
    const lines = text.split("\n").length;
    setLineCount(lines);
  };

  const handleChange = (newContent) => {
    if (!validateContentSize(newContent)) {
      console.warn("El contenido excede el tamaño máximo permitido");
      return;
    }

    setContent(newContent);
    updateLineCount(newContent);
  };

  const clearContent = () => {
    setContent("");
    setLineCount(1);
    try {
      localStorage.removeItem("markdownContent");
    } catch (error) {
      console.error("Error al limpiar el localStorage:", error);
    }
  };

  const saveContent = (contentToSave) => {
    try {
      if (validateContentSize(contentToSave)) {
        localStorage.setItem("markdownContent", contentToSave);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al guardar el contenido:", error);
      return false;
    }
  };

  return {
    content,
    lineCount,
    handleChange,
    clearContent,
    isInitialContent,
    saveContent,
  };
}
