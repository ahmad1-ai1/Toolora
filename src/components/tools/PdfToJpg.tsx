import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Download,
  RotateCcw,
  FileImage,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertCircle,
  Archive,
  Layers,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { useTheme } from '../../context/ThemeContext';

// Set up pdf.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
  selected: boolean;
}

export const PdfToJpg: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('That file type isn\'t supported. Please upload a PDF file.');
      return;
    }

    if (selectedFile.size > 80 * 1024 * 1024) {
      setErrorMessage('Your PDF exceeds the 80MB client-side limit. Please select a smaller file.');
      return;
    }

    setFile(selectedFile);
    setPages([]);
    setErrorMessage(null);
    setIsRendering(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const total = pdf.numPages;

      setRenderProgress({ current: 0, total });

      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= total; i++) {
        setRenderProgress({ current: i, total });
        const page = await pdf.getPage(i);

        // Render at crisp 1.5x scale
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas 2D context unavailable');

        // Fill white background for PDF page
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render PDF page into canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        // @ts-ignore
        await page.render(renderContext).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        rendered.push({
          pageNum: i,
          dataUrl,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
          selected: true,
        });
      }

      setPages(rendered);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to parse and convert PDF pages.';
      setErrorMessage(
        message.includes('password')
          ? 'This PDF is password-protected. Please remove password protection before converting.'
          : 'Could not extract pages from this PDF. Please check if the file is corrupted.'
      );
    } finally {
      setIsRendering(false);
      setRenderProgress(null);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNum === pageNum ? { ...p, selected: !p.selected } : p))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  const downloadSinglePage = (page: RenderedPage) => {
    const a = document.createElement('a');
    a.href = page.dataUrl;
    const baseName = file ? file.name.replace(/\.pdf$/i, '') : 'document';
    a.download = `${baseName}-page-${page.pageNum}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadZip = async () => {
    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const baseName = file ? file.name.replace(/\.pdf$/i, '') : 'document';

      selectedPages.forEach((page) => {
        const base64Data = page.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
        zip.file(`${baseName}-page-${page.pageNum}.jpg`, base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-jpg-pages.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage('Failed to build ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handlePdfUpload(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDark
              ? 'border-[#252b38] bg-[#11141a] hover:border-indigo-500/50 hover:bg-[#141822]'
              : 'border-gray-300 bg-gray-50/70 hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]);
            }}
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/10 text-indigo-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Drop your PDF file here, or <span className="text-indigo-500 underline decoration-2">browse files</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Converts each page into high-resolution JPG images. Download singly or as ZIP.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>
        </div>
      ) : isRendering ? (
        <div className={`p-12 rounded-3xl border text-center space-y-4 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Converting PDF Pages to High-Resolution JPGs...
          </h3>
          {renderProgress && (
            <p className="text-xs text-gray-400 font-medium">
              Rendering page {renderProgress.current} of {renderProgress.total}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-base text-gray-900 dark:text-white truncate max-w-sm">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{pages.length} total pages rendered</span>
                  <span>•</span>
                  <span>{selectedCount} selected for download</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleSelectAll(selectedCount !== pages.length)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  {selectedCount === pages.length ? 'Deselect All' : 'Select All'}
                </button>

                <button
                  onClick={downloadZip}
                  disabled={selectedCount === 0 || isZipping}
                  className="px-4 py-2 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Creating ZIP...' : `Download ${selectedCount} Pages as ZIP`}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                  title="Upload another PDF"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Pages Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pages.map((page) => (
              <div
                key={page.pageNum}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                  page.selected
                    ? isDark ? 'bg-[#141720] border-indigo-500/40' : 'bg-indigo-50/40 border-indigo-300'
                    : isDark ? 'bg-[#12151c] border-[#222733] opacity-60' : 'bg-white border-gray-200 opacity-60'
                }`}
              >
                <div
                  onClick={() => togglePageSelection(page.pageNum)}
                  className="relative cursor-pointer aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200 dark:border-transparent flex items-center justify-center mb-3 group"
                >
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNum}`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1 rounded bg-black/60 text-white backdrop-blur-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePageSelection(page.pageNum);
                      }}
                    >
                      {page.selected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      Page {page.pageNum}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-gray-400">
                    {page.width} × {page.height} px
                  </span>
                  <button
                    onClick={() => downloadSinglePage(page)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-500 hover:bg-indigo-500/10 flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download JPG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
