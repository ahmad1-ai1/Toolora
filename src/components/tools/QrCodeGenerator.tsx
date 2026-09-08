import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Link as LinkIcon,
  AlignLeft,
  Mail,
  Phone,
  Wifi,
  Sliders,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type QrType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export const QrCodeGenerator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [qrType, setQrType] = useState<QrType>('url');
  // Inputs
  const [urlInput, setUrlInput] = useState('https://google.com');
  const [textInput, setTextInput] = useState('Hello world');
  const [emailInput, setEmailInput] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('');
  const [phoneInput, setPhoneInput] = useState('+1234567890');
  const [wifiSsid, setWifiSsid] = useState('Office-Network');
  const [wifiPassword, setWifiPassword] = useState('SecretKey123');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Settings
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrSize, setQrSize] = useState<number>(400);

  // Generated Outputs
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Derive payload string from form inputs
  const payloadString = (() => {
    switch (qrType) {
      case 'url':
        return urlInput.startsWith('http://') || urlInput.startsWith('https://')
          ? urlInput
          : `https://${urlInput}`;
      case 'text':
        return textInput;
      case 'email':
        return emailSubject
          ? `mailto:${emailInput}?subject=${encodeURIComponent(emailSubject)}`
          : `mailto:${emailInput}`;
      case 'phone':
        return `tel:${phoneInput.replace(/\s+/g, '')}`;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      default:
        return urlInput;
    }
  })();

  // Render QR Code whenever parameters change
  useEffect(() => {
    if (!payloadString.trim()) return;

    // Generate raster PNG Data URL
    QRCode.toDataURL(payloadString, {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: errorCorrection,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => console.error(err));

    // Generate vector SVG String
    QRCode.toString(payloadString, {
      type: 'svg',
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: errorCorrection,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => console.error(err));
  }, [payloadString, fgColor, bgColor, errorCorrection, qrSize]);

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${qrType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${qrType}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'url', label: 'URL / Link', icon: LinkIcon },
          { id: 'text', label: 'Text', icon: AlignLeft },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone', icon: Phone },
          { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = qrType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setQrType(tab.id as QrType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                  : isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs on Left, QR Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Styling Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Content Details
            </h3>

            {qrType === 'url' && (
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Target Website URL</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Plain Text Message</label>
                <textarea
                  rows={3}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter message or note..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 resize-none ${
                    isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            )}

            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Subject (Optional)</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Inquiry or feedback..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {qrType === 'phone' && (
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Phone Number (with country code)</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHomeWifi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Network password"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Security</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as any)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium outline-none ${
                        isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                      <span>Hidden Network</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color & Precision Settings */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Design &amp; Error Correction</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color selectors */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#262c3a]">
                <span className="text-xs font-medium">QR Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-400">{fgColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#262c3a]">
                <span className="text-xs font-medium">Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-400">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Error correction levels */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-400 mb-1.5">
                <span>Error Correction</span>
                <span>
                  {errorCorrection === 'L' ? 'Low (7%)' : errorCorrection === 'M' ? 'Medium (15%)' : errorCorrection === 'Q' ? 'Quartile (25%)' : 'High (30%)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setErrorCorrection(lvl)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      errorCorrection === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDark
                        ? 'border-[#262c3a] bg-[#161a22] text-gray-300'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-400 mb-1.5">
                <span>Export Resolution</span>
                <span>{qrSize} × {qrSize} px</span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right QR Preview & Download Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-between ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 self-start">
              Live Preview
            </span>

            <div
              className="p-4 rounded-2xl shadow-lg inline-block my-2 transition-transform hover:scale-105"
              style={{ backgroundColor: bgColor }}
            >
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Live generated QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs text-gray-400">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400 mt-2 line-clamp-1 max-w-xs font-mono">
              {payloadString}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 mt-6">
              <button
                onClick={downloadPng}
                className="w-full h-11 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG ({qrSize}px)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadSvg}
                  className={`h-10 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-colors ${
                    isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Vector SVG</span>
                </button>

                <button
                  onClick={copyPayload}
                  className={`h-10 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-colors ${
                    isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1e2430]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Link' : 'Copy Content'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
