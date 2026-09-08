import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Minimize,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  FileCode,
  Braces,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const JsonFormatter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [inputJson, setInputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [errorMessage, setErrorMessage] = useState<{ message: string; line?: number; col?: number } | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');
  const [parsedObject, setParsedObject] = useState<any>(null);

  const sampleJson = {
    name: "OmniTools API",
    version: "2.5.0",
    features: ["Image Compression", "PDF Conversion", "Developer Tools"],
    settings: {
      clientSide: true,
      maxPayloadMb: 50,
      privacyPolicyCompliant: true
    },
    metrics: {
      latencyMs: 0,
      activeUsers: 14200
    }
  };

  const handleLoadSample = () => {
    const formatted = JSON.stringify(sampleJson, null, 2);
    setInputJson(formatted);
    setParsedObject(sampleJson);
    setIsValid(true);
    setErrorMessage(null);
  };

  const formatJson = (indent: number | 'tab') => {
    if (!inputJson.trim()) {
      setErrorMessage({ message: 'Please enter or paste JSON to format.' });
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const indentation = indent === 'tab' ? '\t' : indent;
      const formatted = JSON.stringify(parsed, null, indentation);
      setInputJson(formatted);
      setParsedObject(parsed);
      setIsValid(true);
      setErrorMessage(null);
    } catch (err: unknown) {
      setIsValid(false);
      parseJsonError(err, inputJson);
    }
  };

  const minifyJson = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
      setParsedObject(parsed);
      setIsValid(true);
      setErrorMessage(null);
    } catch (err: unknown) {
      setIsValid(false);
      parseJsonError(err, inputJson);
    }
  };

  const validateJson = () => {
    if (!inputJson.trim()) {
      setErrorMessage({ message: 'Empty input. Please paste JSON content.' });
      setIsValid(false);
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      setParsedObject(parsed);
      setIsValid(true);
      setErrorMessage(null);
    } catch (err: unknown) {
      setIsValid(false);
      parseJsonError(err, inputJson);
    }
  };

  // Convert browser JSON.parse error into friendly readable explanation with line number
  const parseJsonError = (err: any, raw: string) => {
    const rawMsg = err?.message || 'Invalid JSON format.';
    let line = 1;
    let col = 1;

    // Detect "at position X" in standard V8 error
    const match = rawMsg.match(/at position (\d+)/i);
    if (match) {
      const position = parseInt(match[1], 10);
      const lines = raw.slice(0, position).split('\n');
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }

    let friendly = rawMsg;
    if (rawMsg.includes('Unexpected token')) {
      friendly = `Unexpected character found. Check for missing quotes, trailing commas, or misplaced brackets around line ${line}, column ${col}.`;
    } else if (rawMsg.includes('Unexpected end of JSON')) {
      friendly = 'Incomplete JSON. Check for unclosed braces { }, brackets [ ], or unclosed strings.';
    }

    setErrorMessage({ message: friendly, line, col });
  };

  const handleCopy = () => {
    if (!inputJson) return;
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputJson('');
    setParsedObject(null);
    setIsValid(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action & Indentation Controls */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
          >
            <Braces className="w-3.5 h-3.5" />
            <span>Format (2 spaces)</span>
          </button>

          <button
            onClick={() => formatJson(4)}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors ${
              isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            4 spaces
          </button>

          <button
            onClick={minifyJson}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs border flex items-center gap-1 transition-colors ${
              isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Minimize className="w-3 h-3" />
            <span>Minify</span>
          </button>

          <button
            onClick={validateJson}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors ${
              isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Validate
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!inputJson && (
            <button
              onClick={handleLoadSample}
              className="text-xs text-indigo-500 font-semibold hover:underline px-2"
            >
              Load Sample JSON
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!inputJson}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs border flex items-center gap-1.5 transition-colors disabled:opacity-40 ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            disabled={!inputJson}
            title="Clear all"
            className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 disabled:opacity-30"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation Status Notice */}
      {isValid === true && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Valid JSON structure. Ready for use in APIs or configuration files.</span>
        </div>
      )}

      {isValid === false && errorMessage && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div>{errorMessage.message}</div>
            {errorMessage.line && (
              <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                Error located near line {errorMessage.line}, column {errorMessage.col}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main JSON Editor */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="px-4 py-2 border-b text-xs text-gray-400 flex items-center justify-between border-gray-100 dark:border-[#1e232e]">
          <span className="font-mono">JSON Document</span>
          <span>{inputJson ? `${inputJson.length} characters` : '0 characters'}</span>
        </div>

        <textarea
          rows={16}
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            setIsValid(null);
            setErrorMessage(null);
          }}
          placeholder='{"key": "Paste raw JSON here and click Format..."}'
          spellCheck={false}
          className="w-full p-4 font-mono text-xs sm:text-sm leading-relaxed bg-transparent outline-none resize-y min-h-[300px] placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};
