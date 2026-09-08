import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  Maximize2,
  FileImage,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Preset {
  name: string;
  width: number;
  height: number;
  platform: string;
}

const PRESETS: Preset[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, platform: 'Instagram' },
  { name: 'Instagram Story', width: 1080, height: 1920, platform: 'Instagram' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube' },
  { name: 'X / Twitter Banner', width: 1500, height: 500, platform: 'Twitter' },
  { name: 'LinkedIn Banner', width: 1584, height: 396, platform: 'LinkedIn' },
  { name: 'Facebook Cover', width: 820, height: 312, platform: 'Facebook' },
];

export const ImageResizer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<number>(1080);
  const [targetHeight, setTargetHeight] = useState<number>(1080);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);
  const [fitMode, setFitMode] = useState<'stretch' | 'fit-pad' | 'crop'>('stretch');

  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    setErrorMessage(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatio(ratio);
      setFile(selectedFile);
      setOriginalUrl(url);
    };
    img.onerror = () => {
      setErrorMessage('Could not decode the selected image.');
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.min(10000, val));
    setTargetWidth(w);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.min(10000, val));
    setTargetHeight(h);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(h * aspectRatio));
    }
  };

  const applyPreset = (preset: Preset) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setLockAspectRatio(false);
  };

  // Perform canvas resize
  const renderResized = () => {
    if (!file || !originalUrl) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setErrorMessage('Failed to initialize canvas renderer.');
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (fitMode === 'fit-pad') {
        // Pad with white or transparent
        ctx.fillStyle = outputFormat === 'image/jpeg' ? '#ffffff' : 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = targetWidth / targetHeight;

        let drawW = targetWidth;
        let drawH = targetHeight;
        if (imgRatio > targetRatio) {
          drawH = targetWidth / imgRatio;
        } else {
          drawW = targetHeight * imgRatio;
        }
        const dx = (targetWidth - drawW) / 2;
        const dy = (targetHeight - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
      } else if (fitMode === 'crop') {
        // Center crop
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = targetWidth / targetHeight;
        let sx = 0;
        let sy = 0;
        let sWidth = img.naturalWidth;
        let sHeight = img.naturalHeight;

        if (imgRatio > targetRatio) {
          sWidth = img.naturalHeight * targetRatio;
          sx = (img.naturalWidth - sWidth) / 2;
        } else {
          sHeight = img.naturalWidth / targetRatio;
          sy = (img.naturalHeight - sHeight) / 2;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
      } else {
        // Exact stretch to dimensions
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }

      const q = quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            setResizedSize(blob.size);
          } else {
            setErrorMessage('Could not generate resized image.');
          }
          setIsProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : q
      );
    };

    img.onerror = () => {
      setErrorMessage('Failed to load image for resizing.');
      setIsProcessing(false);
    };

    img.src = originalUrl;
  };

  useEffect(() => {
    if (file && originalUrl) {
      const timer = setTimeout(() => {
        renderResized();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [file, targetWidth, targetHeight, outputFormat, quality, fitMode]);

  const handleDownload = () => {
    if (!resizedUrl || !file) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const downloadName = `${base}-${targetWidth}x${targetHeight}.${ext}`;

    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setOriginalUrl(null);
    setResizedUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
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
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/10 text-indigo-500">
              <Maximize2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Drop your image here, or <span className="text-indigo-500 underline decoration-2">browse files</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Resize to exact pixels or presets for Instagram, YouTube, and LinkedIn.
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
          {/* Main Control Panel */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            {/* Dimensions & Presets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Dimension Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Custom Dimensions
                  </span>
                  <span className="text-xs text-gray-400">
                    Original: {originalWidth} × {originalHeight} px
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold outline-none focus:border-indigo-500 transition-colors ${
                        isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    title={lockAspectRatio ? 'Lock aspect ratio enabled' : 'Aspect ratio unlocked'}
                    className={`p-2.5 rounded-xl border mt-5 transition-colors ${
                      lockAspectRatio
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDark ? 'border-[#262c3a] bg-[#181c24] text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Height (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold outline-none focus:border-indigo-500 transition-colors ${
                        isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Resize Fit Strategy */}
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Fit Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['stretch', 'fit-pad', 'crop'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setFitMode(m)}
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          fitMode === m
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : isDark ? 'border-[#262c3a] bg-[#181c24] text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                      >
                        {m === 'stretch' ? 'Stretch' : m === 'fit-pad' ? 'Fit & Pad' : 'Center Crop'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Quick Social Presets */}
              <div className="lg:col-span-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Social Media Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className={`p-2 rounded-xl border text-left transition-colors ${
                        targetWidth === p.width && targetHeight === p.height
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : isDark
                          ? 'border-[#262c3a] bg-[#181c24] hover:bg-[#1e232d] text-gray-300'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-xs truncate">{p.name}</div>
                      <div className="text-[10px] text-gray-400">{p.width} × {p.height} px</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Format & Download Controls */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#1e232e] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1.5">Output Format</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        outputFormat === fmt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isDark ? 'border-[#262c3a] bg-[#181c24] text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      {fmt.replace('image/', '').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <div>Output Size: <span className="font-bold text-gray-900 dark:text-white">{targetWidth} × {targetHeight} px</span></div>
                <div>Estimated Size: <span className="font-bold text-indigo-500">{isProcessing ? 'Calculating...' : formatBytes(resizedSize)}</span></div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!resizedUrl || isProcessing}
                  className="flex-1 h-11 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resized Image</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl border border-gray-200 dark:border-[#262c3a] text-gray-400 hover:text-white"
                  title="Upload another"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Resized Preview */}
          {resizedUrl && (
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-left">
                Preview ({targetWidth} × {targetHeight} px)
              </div>
              <div className="flex items-center justify-center bg-checkerboard rounded-xl p-4 min-h-[250px] max-h-[450px] overflow-hidden">
                <img
                  src={resizedUrl}
                  alt="Resized preview"
                  className="max-h-[400px] object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
