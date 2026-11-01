import React, { useState } from 'react';
import { Download, Server, Check, Copy, ExternalLink, X, ShieldCheck, Box, Sparkles, Layers, FileCode } from 'lucide-react';

interface HostingerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerModal: React.FC<HostingerModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  Hostinger Web Apps Package
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-compiled, standalone production package ready for Hostinger hPanel Node.js
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Download Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-500" />
                <span>snapsolve-hostinger-production.zip</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Contains pre-compiled <code className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">dist/</code> assets, standalone <code className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">server.js</code>, and lightweight production configs.
              </p>
            </div>
            <a
              href="/api/download-hostinger-zip"
              download="snapsolve-hostinger-production.zip"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition active:scale-95 whitespace-nowrap text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              Download Zip (~191 KB)
            </a>
          </div>

          {/* Quick Setup Checklist */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Hostinger hPanel Setup Settings (5 Steps)
            </h4>
            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Upload & Extract</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload <code className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">snapsolve-hostinger-production.zip</code> to your Hostinger File Manager in <code className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">public_html</code> and extract it.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Application Startup File</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Set in Hostinger Node.js manager to: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">server.js</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('server.js', 'startup')}
                  className="px-2 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition"
                >
                  {copiedKey === 'startup' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'startup' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Node.js Version</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select <span className="font-semibold text-slate-900 dark:text-white">Node 20.x</span> or <span className="font-semibold text-slate-900 dark:text-white">Node 18.x</span> in Hostinger hPanel.
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Run NPM Install</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Click <span className="font-semibold text-slate-900 dark:text-white">Run NPM Install</span> in hPanel (installs only express, @google/genai, dotenv in seconds).
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    5
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Environment Variable</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Add key: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">GEMINI_API_KEY</span> with your API key from Google AI Studio.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('GEMINI_API_KEY', 'env')}
                  className="px-2 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition"
                >
                  {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'env' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Package Architecture */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Production Package Architecture</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">dist/</div>
                <div className="text-slate-500 dark:text-slate-400">Compiled React SPA</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">server.js</div>
                <div className="text-slate-500 dark:text-slate-400">Express + Vision API</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">package.json</div>
                <div className="text-slate-500 dark:text-slate-400">Production deps only</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">.htaccess</div>
                <div className="text-slate-500 dark:text-slate-400">Hostinger routing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero build tools required on Hostinger</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
