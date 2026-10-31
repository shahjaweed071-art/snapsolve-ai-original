import React from 'react';
import { Sparkles, ArrowRight, CreditCard, Smartphone, Code2, Globe2, Monitor } from 'lucide-react';
import { Language, SampleError } from '../types';
import { sampleErrors } from '../utils/sampleErrors';
import { translations } from '../utils/translations';

interface SampleErrorsSectionProps {
  language: Language;
  onSelectSample: (sample: SampleError) => void;
  isAnalyzing: boolean;
}

export const SampleErrorsSection: React.FC<SampleErrorsSectionProps> = ({
  language,
  onSelectSample,
  isAnalyzing,
}) => {
  const t = translations[language];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Banking & Finance':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'Mobile App':
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'Software & Code':
        return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'Web & Cloud':
        return <Globe2 className="w-4 h-4 text-cyan-500" />;
      case 'Operating System & Hardware':
        return <Monitor className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const getDisplayTitle = (sample: SampleError) => {
    if (language === 'ur') return sample.titleUrdu;
    if (language === 'hi') return sample.titleHindi;
    return sample.title;
  };

  return (
    <section className="w-full max-w-6xl mx-auto mt-14 sm:mt-20">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          {t.sampleCategoriesTitle}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.sampleCategoriesSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleErrors.map((sample) => (
          <div
            key={sample.id}
            onClick={() => !isAnalyzing && onSelectSample(sample)}
            className="group relative cursor-pointer flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0f172a] p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              {/* Category Badge & Icon */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                  {getCategoryIcon(sample.category)}
                  <span>{sample.category}</span>
                </span>
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                  <span>{t.clickToTry}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Thumbnail Representation */}
              <div className="relative mb-3.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-slate-950 aspect-[16/10] flex items-center justify-center group-hover:border-blue-500/40 transition">
                <img
                  src={sample.thumbnailSvg}
                  alt={sample.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Title & Description */}
              <h3
                className={`font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1.5 line-clamp-2 ${
                  language === 'ur' ? 'font-urdu' : ''
                }`}
              >
                {getDisplayTitle(sample)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {sample.description}
              </p>
            </div>

            {/* Bottom action button */}
            <button
              disabled={isAnalyzing}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 group-hover:bg-blue-600 group-hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition duration-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.clickToTry}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
