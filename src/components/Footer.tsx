import React from 'react';
import { Sparkles, Shield, Cpu, Zap, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b13] transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                SnapSolve AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              SnapSolve AI helps people solve problems by uploading screenshots of errors from mobile apps, websites, banking applications, software, and devices.
            </p>
          </div>

          {/* Core Strengths */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span>Instant Vision OCR & Diagnostics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure Banking & Payment Analysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span>Multimodal Gemini 3.8 Flash Engine</span>
              </li>
            </ul>
          </div>

          {/* Languages Supported */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Languages
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">English (Global)</span>
              <span className="font-urdu">اردو (پاکستانی اور بین الاقوامی)</span>
              <span className="font-hindi">हिन्दी (सम्पूर्ण भारत)</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.footerRights}</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for real-world problem solving</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
