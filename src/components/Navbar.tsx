import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Globe, ShieldCheck, RefreshCw, Server } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { HostingerModal } from './HostingerModal';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
  hasActiveSolution: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  onReset,
  hasActiveSolution,
}) => {
  const [showHostingerModal, setShowHostingerModal] = useState(false);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 bg-white/80 dark:bg-[#090d16]/80 border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20 text-white font-bold group-hover:shadow-blue-500/40 transition-shadow">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-30 blur transition duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
                SnapSolve
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                AI Vision
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveSolution && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Upload new screenshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.uploadAnother}</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-slate-500 dark:text-slate-400 hidden xs:block" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                language === 'en'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ur')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                language === 'ur'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                language === 'hi'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Hostinger Deploy Button */}
          <button
            onClick={() => setShowHostingerModal(true)}
            title="Download Hostinger Web Apps deployment package"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition active:scale-95 shadow-sm"
          >
            <Server className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Hostinger Deploy</span>
            <span className="sm:hidden">Deploy</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark/light mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      <HostingerModal
        isOpen={showHostingerModal}
        onClose={() => setShowHostingerModal(false)}
      />
    </header>
  );
};
