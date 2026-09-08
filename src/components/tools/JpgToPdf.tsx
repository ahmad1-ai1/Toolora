import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Download,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  Plus,
  ShieldCheck,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useTheme } from '../../context/ThemeContext';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export const JpgToPdf: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'standard'>('small');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    setErrorMessage(null);
    setGeneratedPdfBlob(null);

    const newItems: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith('image/')) {
        setErrorMessage('Only image files (JPG, PNG, WebP) are supported.');
        continue;
      }
      const url = URL.createObjectURL(f);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: f,
        previewUrl: url,
        name: f.name,
        size: f.size,
      });
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setImages(copy);
    setGeneratedPdfBlob(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
    setGeneratedPdfBlob(null);
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setGeneratedPdfBlob(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (addMoreInputRef.current) addMoreInputRef.current.value = '';
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const pdfDoc = await PDFDocument.create();

      // Page dimensions in points (72 points = 1 inch)
      // A4 = 595.28 x 841.89
      // Letter = 612 x 792
      let standardWidth = 595.28;
      let standardHeight = 841.89;

      if (pageSize === 'letter') {
        standardWidth = 612;
        standardHeight = 792;
      }

      if (orientation === 'landscape' && pageSize !== 'fit') {
        const temp = standardWidth;
        standardWidth = standardHeight;
        standardHeight = temp;
      }

      const marginPoints = margin === 'none' ? 0 : margin === 'small' ? 20 : 40;

      for (const item of images) {
        // Read image bytes
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;

        // Convert PNG or convert WebP/other formats to PNG via canvas if needed
        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          try {
            pdfImage = await pdfDoc.embedJpg(arrayBuffer);
          } catch {
            // fallback canvas conversion
            pdfImage = await convertViaCanvasAndEmbed(pdfDoc, item.file);
          }
        } else if (item.file.type === 'image/png') {
          try {
            pdfImage = await pdfDoc.embedPng(arrayBuffer);
          } catch {
            pdfImage = await convertViaCanvasAndEmbed(pdfDoc, item.file);
          }
        } else {
          // WebP or other image formats: convert to PNG
          pdfImage = await convertViaCanvasAndEmbed(pdfDoc, item.file);
        }

        let pageWidth = standardWidth;
        let pageHeight = standardHeight;

        if (pageSize === 'fit') {
          pageWidth = pdfImage.width + marginPoints * 2;
          pageHeight = pdfImage.height + marginPoints * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const printableWidth = pageWidth - marginPoints * 2;
        const printableHeight = pageHeight - marginPoints * 2;

        // Calculate aspect ratio preserving scale
        const imgRatio = pdfImage.width / pdfImage.height;
        const pageRatio = printableWidth / printableHeight;

        let drawWidth = printableWidth;
        let drawHeight = printableHeight;

        if (imgRatio > pageRatio) {
          drawHeight = printableWidth / imgRatio;
        } else {
          drawWidth = printableHeight * imgRatio;
        }

        const x = marginPoints + (printableWidth - drawWidth) / 2;
        const y = marginPoints + (printableHeight - drawHeight) / 2;

        page.drawImage(pdfImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setGeneratedPdfBlob(blob);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate PDF.';
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const convertViaCanvasAndEmbed = async (pdfDoc: PDFDocument, file: File) => {
    return new Promise<any>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (!blob) return reject(new Error('Blob conversion failed'));
          const buffer = await blob.arrayBuffer();
          const embedded = await pdfDoc.embedPng(buffer);
          resolve(embedded);
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Could not load image: ${file.name}`));
      };
      img.src = url;
    });
  };

  const handleDownload = () => {
    if (!generatedPdfBlob) return;
    const url = URL.createObjectURL(generatedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combined-images-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {images.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
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
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/10 text-indigo-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Drop your images here, or <span className="text-indigo-500 underline decoration-2">browse files</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select single or multiple JPG, PNG, and WebP photos. Reorder anytime.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Options Bar */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {/* Page Size */}
              <div>
                <label className="text-xs font-semibold block mb-1.5 text-gray-700 dark:text-gray-300">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['a4', 'letter', 'fit'] as const).map((ps) => (
                    <button
                      key={ps}
                      onClick={() => { setPageSize(ps); setGeneratedPdfBlob(null); }}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        pageSize === ps
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isDark
                          ? 'border-[#262c3a] bg-[#161a22] text-gray-300'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      {ps.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="text-xs font-semibold block mb-1.5 text-gray-700 dark:text-gray-300">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['portrait', 'landscape'] as const).map((ori) => (
                    <button
                      key={ori}
                      disabled={pageSize === 'fit'}
                      onClick={() => { setOrientation(ori); setGeneratedPdfBlob(null); }}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-40 ${
                        orientation === ori && pageSize !== 'fit'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isDark
                          ? 'border-[#262c3a] bg-[#161a22] text-gray-300'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      {ori.charAt(0).toUpperCase() + ori.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div>
                <label className="text-xs font-semibold block mb-1.5 text-gray-700 dark:text-gray-300">
                  Margin
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['none', 'small', 'standard'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMargin(m); setGeneratedPdfBlob(null); }}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        margin === m
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isDark
                          ? 'border-[#262c3a] bg-[#161a22] text-gray-300'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-[#1e232e]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addMoreInputRef.current?.click()}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#202532]'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Add More Images</span>
                </button>
                <input
                  ref={addMoreInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                  }}
                />

                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="flex items-center gap-3">
                {!generatedPdfBlob ? (
                  <button
                    onClick={generatePdf}
                    disabled={isGenerating}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isGenerating ? 'Assembling PDF...' : `Generate PDF (${images.length} pages)`}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Finished PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reorderable Image Gallery Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Arrange order (top to bottom becomes first to last page)</span>
              <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative p-3 rounded-2xl border flex flex-col justify-between group transition-all ${
                    isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/10 mb-2 flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                      Page {index + 1}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-medium truncate text-gray-800 dark:text-gray-200">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(item.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        title="Move Page Up"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        title="Move Page Down"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(item.id)}
                        title="Delete image"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
