import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  StopCircle,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Search,
  Wand2,
  FileCheck,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LoadingScreenProps {
  language: Language;
  screenshotImages: string[];
  onCancel?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  language,
  screenshotImages,
  onCancel,
}) => {
  const t = translations[language];
  const isRtl = language === 'ur';

  // 5 exact status stages requested:
  // 1. Uploading screenshots
  // 2. Processing images
  // 3. Detecting problems
  // 4. Generating solutions
  // 5. Preparing results
  const stages = [
    {
      id: 1,
      title: t.loadingStage1,
      icon: Layers,
      minProgress: 18,
      durationMs: 1400,
    },
    {
      id: 2,
      title: t.loadingStage2,
      icon: Cpu,
      minProgress: 38,
      durationMs: 1800,
    },
    {
      id: 3,
      title: t.loadingStage3,
      icon: Search,
      minProgress: 62,
      durationMs: 2200,
    },
    {
      id: 4,
      title: t.loadingStage4,
      icon: Wand2,
      minProgress: 84,
      durationMs: 2500,
    },
    {
      id: 5,
      title: t.loadingStage5,
      icon: FileCheck,
      minProgress: 96,
      durationMs: 3000,
    },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer for elapsed time
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 100) / 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Progression through stages
  useEffect(() => {
    const stage = stages[currentStageIndex];
    if (!stage) return;

    // Smoothly bump progress
    setProgressPercent(stage.minProgress);

    if (currentStageIndex < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, stage.durationMs);
      return () => clearTimeout(timer);
    }
  }, [currentStageIndex]);

  const activeStage = stages[currentStageIndex];

  return (
    <div
      className={`w-full max-w-4xl mx-auto py-8 px-4 ${isRtl ? 'dir-rtl' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative rounded-3xl bg-white dark:bg-[#0f172a] border border-blue-500/30 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10 overflow-hidden p-6 sm:p-10 text-center">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

        {/* Pulse Orb */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 relative">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-slow" />
          <div className="absolute -inset-1 rounded-2xl bg-blue-500/30 animate-ping -z-10" />
        </div>

        {/* Header */}
        <h2
          className={`text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 ${
            isRtl ? 'font-urdu' : ''
          }`}
        >
          {t.analyzingHeadline}
        </h2>
        <p
          className={`text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 ${
            isRtl ? 'font-urdu leading-loose' : ''
          }`}
        >
          {t.analyzingSubtext}
        </p>

        {/* Progress Bar Container */}
        <div className="max-w-xl mx-auto mb-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {activeStage.title}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {elapsedSeconds.toFixed(1)}s
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Thumbnails with Scanner Beams */}
        {screenshotImages.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Analyzing {screenshotImages.length}{' '}
                {screenshotImages.length === 1 ? 'Screenshot' : 'Screenshots'} Simultaneously
              </span>
            </div>

            <div
              className={`grid gap-3 max-w-xl mx-auto ${
                screenshotImages.length === 1
                  ? 'grid-cols-1'
                  : screenshotImages.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-4'
              }`}
            >
              {screenshotImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border-2 border-blue-500/40 bg-slate-950 shadow-md flex items-center justify-center group"
                >
                  <img
                    src={src}
                    alt={`Analyzing ${idx + 1}`}
                    className="w-full h-full object-cover opacity-80"
                  />

                  {/* Number Badge */}
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow">
                    {idx + 1}
                  </div>

                  {/* Scanning Laser Beam */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan" />
                    <div className="absolute inset-0 bg-blue-500/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stepper with the 5 Required Status Messages */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-2 text-left mb-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/60 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? 'text-blue-500'
                        : isCompleted
                        ? 'text-emerald-500'
                        : 'text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-blue-700 dark:text-blue-300'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    } ${isRtl ? 'font-urdu' : ''}`}
                  >
                    {stage.title}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {isCompleted ? 'Completed' : isCurrent ? 'In progress...' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition cursor-pointer min-h-[44px]"
            >
              <StopCircle className="w-4 h-4 text-rose-500" />
              <span>{t.cancelAnalysis}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
