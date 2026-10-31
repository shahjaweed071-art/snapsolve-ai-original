import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { LoadingScreen } from './components/LoadingScreen';
import { SampleErrorsSection } from './components/SampleErrorsSection';
import { SolutionView } from './components/SolutionView';
import { Footer } from './components/Footer';
import { AnalysisResult, Language, SampleError, UploadedScreenshot } from './types';
import { translations } from './utils/translations';
import { svgToPngDataUrl } from './utils/imageUtils';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('snapsolve_lang');
    return (saved as Language) || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('snapsolve_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true; // Default to sleek dark navy theme
  });

  // Preserved uploaded screenshots state (persists across errors & retries)
  const [selectedImages, setSelectedImages] = useState<UploadedScreenshot[]>([]);
  const [categoryHint, setCategoryHint] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isCancelledByUser = useRef<boolean>(false);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('snapsolve_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('snapsolve_theme', 'light');
    }
  }, [isDark]);

  // Sync language with document direction & storage
  useEffect(() => {
    localStorage.setItem('snapsolve_lang', language);
    if (language === 'ur') {
      document.documentElement.setAttribute('lang', 'ur');
      document.documentElement.setAttribute('dir', 'rtl');
    } else if (language === 'hi') {
      document.documentElement.setAttribute('lang', 'hi');
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // If we have active screenshots and already diagnosed, re-analyze in this language
    if (selectedImages.length > 0 && analysisResult && !isAnalyzing) {
      executeAnalysis(
        selectedImages.map((img) => img.dataUrl),
        newLang,
        analysisResult.category,
        userNote
      );
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      isCancelledByUser.current = true;
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsAnalyzing(false);
    setError(translations[language].analysisCancelled);
  };

  const executeAnalysis = async (
    imageDataUrls?: string[],
    langToUse: Language = language,
    catHint: string = categoryHint,
    note: string = userNote
  ) => {
    if (isAnalyzing) return;

    const imagesToAnalyze = imageDataUrls || selectedImages.map((img) => img.dataUrl);
    if (!imagesToAnalyze || imagesToAnalyze.length === 0) return;

    // Check internet connection
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('You appear to be offline. Please verify your internet connection and tap Retry.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    isCancelledByUser.current = false;

    // Create AbortController with 60s timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesToAnalyze,
          image: imagesToAnalyze[0],
          language: langToUse,
          categoryHint: catHint,
          userNote: note,
        }),
        signal: controller.signal,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || translations[langToUse].generalError);
      }

      setAnalysisResult(resData.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        if (isCancelledByUser.current) {
          setError(translations[langToUse].analysisCancelled);
        } else {
          setError(translations[langToUse].analysisTimeout);
        }
      } else {
        console.error('Analysis failed:', err);
        setError(err?.message || translations[langToUse].generalError);
      }
      setAnalysisResult(null);
    } finally {
      clearTimeout(timeoutId);
      abortControllerRef.current = null;
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = async (sample: SampleError) => {
    try {
      const pngData = await svgToPngDataUrl(sample.dataUrl);
      const sampleItem: UploadedScreenshot = {
        id: `sample-${Date.now()}`,
        dataUrl: pngData,
        fileName: `${sample.title}.png`,
        fileSize: '180 KB',
      };
      setSelectedImages([sampleItem]);
      setCategoryHint(sample.category);
      setUserNote(sample.contextNote);
      executeAnalysis([pngData], language, sample.category, sample.contextNote);
    } catch {
      const sampleItem: UploadedScreenshot = {
        id: `sample-${Date.now()}`,
        dataUrl: sample.dataUrl,
        fileName: `${sample.title}.svg`,
        fileSize: '24 KB',
      };
      setSelectedImages([sampleItem]);
      setCategoryHint(sample.category);
      setUserNote(sample.contextNote);
      executeAnalysis([sample.dataUrl], language, sample.category, sample.contextNote);
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAnalysisResult(null);
    setSelectedImages([]);
    setCategoryHint('');
    setUserNote('');
    setError(null);
    setIsAnalyzing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[130px] animate-subtle-glow" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-2/3 -left-40 w-[450px] h-[450px] bg-cyan-600/10 dark:bg-cyan-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onReset={handleReset}
        hasActiveSolution={Boolean(analysisResult)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {isAnalyzing ? (
          /* Professional Animated Loading Screen with 5 Status Messages */
          <LoadingScreen
            language={language}
            screenshotImages={selectedImages.map((img) => img.dataUrl)}
            onCancel={handleCancelAnalysis}
          />
        ) : analysisResult && selectedImages.length > 0 ? (
          /* Upgraded Results View with 4 Expandable Solution Cards */
          <SolutionView
            result={analysisResult}
            screenshotImages={selectedImages.map((img) => img.dataUrl)}
            screenshotImage={selectedImages[0]?.dataUrl}
            language={language}
            onLanguageChange={handleLanguageChange}
            onReset={handleReset}
            onReAnalyze={() =>
              selectedImages.length > 0 &&
              executeAnalysis(
                selectedImages.map((img) => img.dataUrl),
                language,
                analysisResult?.category,
                userNote
              )
            }
          />
        ) : (
          /* Multi-Screenshot Upload & Common Problem Samples */
          <>
            <UploadSection
              language={language}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              categoryHint={categoryHint}
              setCategoryHint={setCategoryHint}
              userNote={userNote}
              setUserNote={setUserNote}
              onAnalyze={() => executeAnalysis()}
              onCancelAnalysis={handleCancelAnalysis}
              isAnalyzing={isAnalyzing}
              error={error}
              onClearError={() => setError(null)}
            />

            <SampleErrorsSection
              language={language}
              onSelectSample={handleSelectSample}
              isAnalyzing={isAnalyzing}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
