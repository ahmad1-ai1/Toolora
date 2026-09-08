import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ImageCompressor: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'compressed' | 'original'>('compressed');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processImage = useCallback((imageFile: File, q: number, format: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setIsProcessing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMessage('Could not read image file. Please ensure it is a valid JPG, PNG, or WebP file.');
      setIsProcessing(false);
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setErrorMessage('The uploaded file is not a valid image or is corrupted. Please try another image.');
        setIsProcessing(false);
      };

      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setErrorMessage('Failed to initialize canvas renderer in your browser.');
          setIsProcessing(false);
          return;
        }

        // Fill background white if converting PNG with transparency to JPEG
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const qualityFactor = q / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              const newUrl = URL.createObjectURL(blob);
              setCompressedBlob(blob);
              setCompressedUrl(newUrl);
              setCompressedSize(blob.size);
            } else {
              setErrorMessage('Failed to compress image. Please try adjusting the quality slider.');
            }
            setIsProcessing(false);
          },
          format,
          format === 'image/png' ? undefined : qualityFactor
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(imageFile);
  }, [compressedUrl]);

  const handleFileSelect = (selectedFile: File) => {
    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('That file type isn\'t supported. Please upload JPG, PNG, or WebP images.');
      return;
    }

    // 50MB browser limit check
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMessage('Your file exceeds the 50 MB in-browser processing limit. Please select a smaller file.');
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setOriginalUrl(url);
    setOriginalSize(selectedFile.size);

    // Default target format matching source
    const targetFormat = selectedFile.type === 'image/png' ? 'image/png' : selectedFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    setOutputFormat(targetFormat);

    processImage(selectedFile, quality, targetFormat);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      processImage(file, newQ, outputFormat);
    }
  };

  const handleFormatChange = (newFormat: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setOutputFormat(newFormat);
    if (file) {
      processImage(file, quality, newFormat);
    }
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedBlob(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setDimensions(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const extension = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const downloadName = `${baseName}-compressed.${extension}`;

    const link = document.createElement('a');
    link.href = compressedUrl || '';
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Upload State or Active Workbench */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : isDark
              ? 'border-[#252b38] bg-[#11141a] hover:border-indigo-500/50 hover:bg-[#141822]'
              : 'border-gray-300 bg-gray-50/70 hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/10 text-indigo-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Drop your image here, or <span className="text-indigo-500 underline decoration-2">browse files</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supports JPG, PNG, and WebP (Up to 50MB). Processed 100% locally.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private: No server upload</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Controls & Stats Grid */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Size metrics */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-sm truncate">{file.name}</span>
                </div>
                {dimensions && (
                  <div className="text-xs text-gray-400">
                    Dimensions: {dimensions.width} × {dimensions.height} px
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border flex-1 ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-[11px] text-gray-400 uppercase font-medium">Original</div>
                    <div className="text-base font-bold mt-0.5 text-gray-900 dark:text-white">
                      {formatFileSize(originalSize)}
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex-1 ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-[11px] text-gray-400 uppercase font-medium">Compressed</div>
                    <div className="text-base font-bold mt-0.5 text-indigo-500">
                      {isProcessing ? 'Calculating...' : formatFileSize(compressedSize)}
                    </div>
                  </div>
                </div>

                {savingsPercent > 0 && !isProcessing && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>Saved {savingsPercent}% ({formatFileSize(originalSize - compressedSize)} reduction)</span>
                  </div>
                )}
              </div>

              {/* Quality & Format Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                      Quality: {quality}%
                    </span>
                    <span className="text-gray-400 font-normal">
                      {quality > 85 ? 'Near Lossless' : quality > 65 ? 'Balanced (Recommended)' : 'Maximum Compression'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => handleQualityChange(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>10% (Smallest)</span>
                    <span>80% (Sweet spot)</span>
                    <span>100% (Highest)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block">Target Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleFormatChange(fmt)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                          outputFormat === fmt
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : isDark
                            ? 'border-[#262c3a] bg-[#171b22] text-gray-300 hover:bg-[#1f242e]'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {fmt.replace('image/', '').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !compressedBlob}
                  className="w-full h-12 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed Image</span>
                </button>

                <button
                  onClick={handleReset}
                  className={`w-full h-10 rounded-xl font-medium text-xs border flex items-center justify-center gap-2 transition-colors ${
                    isDark
                      ? 'border-[#262c3a] bg-[#14171d] text-gray-300 hover:bg-[#1a1f28]'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Compress Another Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas with Tabs */}
          <div className={`p-4 rounded-2xl border overflow-hidden ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#1e232e] mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Eye className="w-4 h-4" />
                <span>Visual Comparison</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewTab('compressed')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    previewTab === 'compressed'
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Compressed ({formatFileSize(compressedSize)})
                </button>
                <button
                  onClick={() => setPreviewTab('original')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    previewTab === 'original'
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Original ({formatFileSize(originalSize)})
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[300px] max-h-[500px] bg-checkerboard rounded-xl p-2 overflow-auto">
              {previewTab === 'compressed' && compressedUrl && (
                <img
                  src={compressedUrl}
                  alt="Compressed preview"
                  className="max-h-[450px] object-contain rounded-lg shadow-sm"
                />
              )}
              {previewTab === 'original' && originalUrl && (
                <img
                  src={originalUrl}
                  alt="Original preview"
                  className="max-h-[450px] object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
