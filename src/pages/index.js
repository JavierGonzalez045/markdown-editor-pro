import { useEffect, useState, useRef, memo } from "react";
import Split from "react-split";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

import Header from "../components/layout/Header";
import Editor from "../components/editor/Editor";
import Preview from "../components/preview/Preview";
import Footer from "../components/layout/Footer";
import Modal from "../components/ui/Modal";
import MobileEditorTabs from "../components/layout/MobileEditorTabs";
import DownloadAnimation from "../components/ui/DownloadAnimation";
import useMarkdown from "../hooks/useMarkdown";
import { useTranslation } from "react-i18next";
import { sanitizeFilename } from "../utils/sanitizer";

/**
 * Página principal de MarkEditor Pro
 *
 * Este es el corazón de mi aplicación. Aquí manejo toda la lógica del editor,
 * la vista previa, el modo zen, y la descarga de archivos. Utilizo memoización
 * para optimizar el rendimiento y evitar renderizados innecesarios.
 */
const MemoizedEditor = memo(Editor);
const MemoizedPreview = memo(Preview);
const MemoizedMobileEditorTabs = memo(MobileEditorTabs);

export default function Home() {
  const { t } = useTranslation();

  const {
    content,
    lineCount,
    handleChange,
    clearContent,
    isInitialContent,
    saveContent,
  } = useMarkdown("");

  const [mounted, setMounted] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isZen, setIsZen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const splitRef = useRef(null);
  const [splitSizes, setSplitSizes] = useState([50, 50]);

  const saveTimeoutRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const previousContent = useRef("");

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isInitialMount.current) {
      saveContent(content);
      isInitialMount.current = false;
      previousContent.current = content;
      return;
    }
    if (content === previousContent.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);

    saveTimeoutRef.current = setTimeout(() => {
      const saved = saveContent(content);
      if (saved) {
        setIsSaving(false);
        setLastSaved(new Date());
        previousContent.current = content;
      } else {
        console.error("No se pudo guardar el contenido");
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [content, mounted, saveContent]);

  useEffect(() => {
    if (!mounted) return;

    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    if (content !== previousContent.current) setIsPreviewLoading(true);

    previewTimeoutRef.current = setTimeout(
      () => setIsPreviewLoading(false),
      200
    );
    return () => clearTimeout(previewTimeoutRef.current);
  }, [content, mounted]);

  const handleDownload = () => {
    if (!content.trim()) return;
    setIsDownloading(true);

    setTimeout(() => {
      try {
        const date = new Date().toISOString().slice(0, 10);
        const filename = sanitizeFilename(`markdown-${date}.md`);
        const element = document.createElement("a");
        const file = new Blob([content], { type: "text/markdown" });

        if (file.size > 10 * 1024 * 1024) {
          setDownloadError("El archivo es demasiado grande para descargar");
          setIsDownloading(false);
          return;
        }
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
      } catch (e) {
        console.error("Error al descargar:", e);
        setDownloadError("No se pudo descargar el archivo");
      } finally {
        setIsDownloading(false);
      }
    }, 1500);
  };

  const handleClear = () => content.trim() && setShowClearModal(true);

  const confirmClear = () => {
    clearContent();
    setShowClearModal(false);
    setLastSaved(null);
    setIsSaving(false);
    previousContent.current = "";
  };

  const toggleZen = () => setIsZen(!isZen);
  const togglePreviewFullscreen = () =>
    setIsPreviewFullscreen(!isPreviewFullscreen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        isPreviewFullscreen && setIsPreviewFullscreen(false);
        isZen && setIsZen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        content.trim() && handleDownload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZen, isPreviewFullscreen, content]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <Head>
        <title>MarkEditor Pro</title>
        <meta
          name="description"
          content="Editor Markdown profesional con preview en tiempo real, autoguardado y exportación."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://markdown-editor-jgp.vercel.app/"
        />
        <meta
          property="og:title"
          content="MarkEditor Pro – Editor Markdown Profesional"
        />
        <meta
          property="og:description"
          content="Escribe y visualiza Markdown en tiempo real, con autoguardado y exportación de archivos."
        />
        <meta
          property="og:image"
          content="https://markdown-editor-jgp.vercel.app/og-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://markdown-editor-jgp.vercel.app/"
        />
        <meta
          name="twitter:title"
          content="MarkEditor Pro – Editor Markdown Profesional"
        />
        <meta
          name="twitter:description"
          content="Escribe y visualiza Markdown en tiempo real, con autoguardado y exportación de archivos."
        />
        <meta
          name="twitter:image"
          content="https://markdown-editor-jgp.vercel.app/og-image.png"
        />
      </Head>

      {!isPreviewFullscreen && !isZen && (
        <Header
          onClear={handleClear}
          onDownload={handleDownload}
          isZen={isZen}
          onZenToggle={toggleZen}
          hasContent={!!content.trim()}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      )}

      <main
        className={`flex-1 overflow-hidden ${
          isZen || isPreviewFullscreen ? "p-0" : "p-2 md:p-4"
        }`}
      >
        <AnimatePresence mode="wait">
          {mounted ? (
            isZen ? (
              <motion.div
                key="zen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
              >
                <MemoizedEditor
                  value={content}
                  onChange={handleChange}
                  lineCount={lineCount}
                  isZen
                  onExitZen={toggleZen}
                  isSaving={isSaving}
                  lastSaved={lastSaved}
                />
              </motion.div>
            ) : isPreviewFullscreen ? (
              <motion.div
                key="preview-fullscreen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <MemoizedPreview
                  content={content}
                  isLoading={isPreviewLoading}
                  isFullscreen
                  onExitFullscreen={togglePreviewFullscreen}
                />
              </motion.div>
            ) : isMobile ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <MemoizedMobileEditorTabs
                  content={content}
                  onChange={handleChange}
                  lineCount={lineCount}
                  isPreviewLoading={isPreviewLoading}
                  onEnterFullscreen={togglePreviewFullscreen}
                />
              </motion.div>
            ) : (
              <motion.div
                key="desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Split
                  ref={splitRef}
                  sizes={splitSizes}
                  minSize={300}
                  gutterSize={6}
                  snapOffset={30}
                  dragInterval={1}
                  cursor="col-resize"
                  className="split h-full rounded-lg overflow-hidden"
                  direction="horizontal"
                  onDragEnd={(sizes) => setSplitSizes(sizes)}
                  gutter={(index, direction) => {
                    const gutter = document.createElement("div");
                    gutter.className = `gutter gutter-${direction}`;
                    return gutter;
                  }}
                >
                  <MemoizedEditor
                    value={content}
                    onChange={handleChange}
                    lineCount={lineCount}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                  />
                  <MemoizedPreview
                    content={content}
                    isLoading={isPreviewLoading}
                    onEnterFullscreen={togglePreviewFullscreen}
                  />
                </Split>
              </motion.div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {!isPreviewFullscreen && !isZen && (
        <Footer content={content} isZen={isZen} />
      )}

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClear}
        title={t("header.clear")}
        message={t("header.clearConfirm")}
        type="warning"
      />

      {downloadError && (
        <Modal
          isOpen
          onClose={() => setDownloadError(null)}
          onConfirm={() => setDownloadError(null)}
          title="Error de Descarga"
          message={downloadError}
          type="error"
        />
      )}

      <DownloadAnimation
        isAnimating={isDownloading}
        onComplete={() => setIsDownloading(false)}
      />
    </div>
  );
}
