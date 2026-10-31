import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  X,
  Sparkles,
  ArrowRight,
  Clipboard,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Camera,
  Plus,
  Trash2,
  RotateCcw,
  Images,
} from 'lucide-react';
import { Language, UploadedScreenshot } from '../types';
import { translations } from '../utils/translations';
import { validateImageFile, optimizeScreenshot } from '../utils/imageUtils';

interface UploadSectionProps {
  language: Language;
  selectedImages: UploadedScreenshot[];
  setSelectedImages: React.Dispatch<React.SetStateAction<UploadedScreenshot[]>>;
  categoryHint: string;
  setCategoryHint: (cat: string) => void;
  userNote: string;
  setUserNote: (note: string) => void;
  onAnalyze: () => void;
  onCancelAnalysis?: () => void;
  isAnalyzing: boolean;
  error: string | null;
  onClearError: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  language,
  selectedImages,
  setSelectedImages,
  categoryHint,
  setCategoryHint,
  userNote,
  setUserNote,
  onAnalyze,
  isAnalyzing,
  error,
  onClearError,
}) => {
  const t = translations[language];
  const [dragActive, setDragActive] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const [localWarning, setLocalWarning] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler: pastes screenshot directly into selection if under 4
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleSingleBlobAdd(blob);
            setPasteNotice(true);
            setTimeout(() => setPasteNotice(false), 3000);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [selectedImages, isAnalyzing]);

  const handleSingleBlobAdd = async (file: File) => {
    if (selectedImages.length >= 4) {
      setLocalWarning(t.maxImagesLimitWarning);
      return;
    }
    await processAndAppendFiles([file]);
  };

  // High performance parallel image optimization using Promise.all
  const processAndAppendFiles = async (fileList: File[]) => {
    onClearError();
    setLocalError(null);
    setLocalWarning(null);

    const availableSlots = 4 - selectedImages.length;
    if (availableSlots <= 0) {
      setLocalWarning(t.maxImagesLimitWarning);
      return;
    }

    if (fileList.length > availableSlots) {
      setLocalWarning(t.maxImagesLimitWarning);
    }

    const filesToProcess = fileList.slice(0, availableSlots);
    setIsProcessingFiles(true);

    try {
      const results = await Promise.all(
        filesToProcess.map(async (file, idx) => {
          const validation = validateImageFile(file);
          if (!validation.valid) {
            return { error: validation.error || 'Invalid file format.' };
          }
          try {
            const { dataUrl } = await optimizeScreenshot(file, 1600);
            return {
              item: {
                id: `img-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
                dataUrl,
                fileName: file.name || `Screenshot_${selectedImages.length + idx + 1}.png`,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              } as UploadedScreenshot,
            };
          } catch (err) {
            console.error('Error optimizing screenshot:', err);
            return { error: 'Failed to process image.' };
          }
        })
      );

      const successfulItems: UploadedScreenshot[] = [];
      let foundError: string | null = null;

      results.forEach((res) => {
        if (res.item) {
          successfulItems.push(res.item);
        } else if (res.error) {
          foundError = res.error;
        }
      });

      if (foundError) {
        setLocalError(foundError);
      }

      if (successfulItems.length > 0) {
        setSelectedImages((prev) => [...prev, ...successfulItems].slice(0, 4));
      }
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const fileArray = Array.from(e.dataTransfer.files);
        processAndAppendFiles(fileArray);
      }
    },
    [selectedImages]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      processAndAppendFiles(fileArray);
      e.target.value = '';
    }
  };

  const removeSingleImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
    setLocalWarning(null);
  };

  const removeAllImages = () => {
    setSelectedImages([]);
    setLocalError(null);
    setLocalWarning(null);
    onClearError();
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (addMoreInputRef.current) addMoreInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedImages.length === 0 || isAnalyzing || isProcessingFiles) return;
    onAnalyze();
  };

  const isRtl = language === 'ur';

  return (
    <div className={`w-full max-w-4xl mx-auto ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Headline and Subtitle */}
      <div className="text-center mb-8 sm:mb-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Screenshot AI Diagnostics • Up to 4 Images</span>
        </div>
        <h1
          className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-4 ${
            isRtl ? 'font-urdu' : ''
          }`}
        >
          {t.headline}
        </h1>
        <p
          className={`text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-2 ${
            isRtl ? 'font-urdu leading-loose' : ''
          }`}
        >
          {t.subtitle}
        </p>

        {/* Global paste notification toast */}
        {pasteNotice && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-bounce shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>Screenshot pasted from clipboard!</span>
          </div>
        )}
      </div>

      {/* Main Upload Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800 transition-all">
        {/* Warning Alert if >4 images attempted */}
        {localWarning && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{localWarning}</span>
            </div>
            <button
              onClick={() => setLocalWarning(null)}
              className="text-amber-500 hover:text-amber-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert with Preserved Screenshot State and Retry button */}
        {(error || localError) && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">{error || localError}</p>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
                  Your selected screenshots are preserved below. Tap Retry Analysis to attempt diagnostic again.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {selectedImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.retryAnalysis}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  onClearError();
                }}
                className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Hidden inputs with multi-select enabled */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={addMoreInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Empty State Dropzone */}
          {selectedImages.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative group border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-900/80'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-400/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {dragActive ? t.dragActiveText : t.uploadAreaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t.uploadAreaSubtitle}
              </p>

              {/* Action Buttons: Browse and Mobile Camera */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer min-h-[44px]"
                >
                  <Images className="w-4 h-4" />
                  <span>{t.browseFiles}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer min-h-[44px]"
                  title="Capture photo with mobile camera"
                >
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span>{t.takePhoto}</span>
                </button>
              </div>

              {/* Format specs */}
              <div className="mt-8 flex flex-col items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Clipboard className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {t.pastePrompt}
                  </span>
                </div>
                <span>{t.maxFileSize}</span>
              </div>
            </div>
          ) : (
            /* Multi-Image Selected Preview State */
            <div className="space-y-6">
              {/* Top status bar: Count & Clear All */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs">
                    {selectedImages.length}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedImages.length}/4 {t.imagesSelectedCount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedImages.length < 4 && (
                    <button
                      type="button"
                      onClick={() => addMoreInputRef.current?.click()}
                      disabled={isAnalyzing || isProcessingFiles}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-800 transition cursor-pointer min-h-[40px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addMoreScreenshots}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={removeAllImages}
                    disabled={isAnalyzing || isProcessingFiles}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-300 dark:hover:border-rose-800 transition cursor-pointer min-h-[40px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Thumbnails Grid (1 to 4 items) */}
              <div
                className={`grid gap-4 ${
                  selectedImages.length === 1
                    ? 'grid-cols-1'
                    : selectedImages.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-4'
                }`}
              >
                {selectedImages.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-950 shadow-md flex flex-col justify-between"
                  >
                    {/* Image Thumbnail Container */}
                    <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-black/40 p-2 overflow-hidden">
                      <img
                        src={img.dataUrl}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg transition duration-200 group-hover:scale-105"
                      />

                      {/* Number Badge (1, 2, 3, 4) */}
                      <div className="absolute top-2 left-2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md">
                        {index + 1}
                      </div>

                      {/* Individual Remove Button */}
                      {!isAnalyzing && (
                        <button
                          type="button"
                          onClick={() => removeSingleImage(img.id)}
                          aria-label={`Remove screenshot ${index + 1}`}
                          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition shadow cursor-pointer min-h-[32px] min-w-[32px]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Footer info */}
                    <div className="p-2 bg-slate-900 text-slate-300 text-[11px] truncate flex items-center justify-between border-t border-slate-800">
                      <span className="truncate max-w-[70%]">{img.fileName}</span>
                      <span className="text-slate-500 text-[10px]">{img.fileSize}</span>
                    </div>
                  </div>
                ))}

                {/* "Add More" Tile if under 4 images */}
                {selectedImages.length < 4 && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={() => addMoreInputRef.current?.click()}
                    className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-900/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer p-4 min-h-[120px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">{t.addMoreScreenshots}</span>
                    <span className="text-[10px] text-slate-400">{4 - selectedImages.length} slots left</span>
                  </button>
                )}
              </div>

              {/* Optional Category & Context Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.categoryLabel}</span>
                  </label>
                  <select
                    value={categoryHint}
                    onChange={(e) => setCategoryHint(e.target.value)}
                    disabled={isAnalyzing}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                  >
                    <option value="">{t.allCategories}</option>
                    <option value="Banking & Finance">{t.categoryBanking}</option>
                    <option value="Mobile App">{t.categoryMobile}</option>
                    <option value="Web & Cloud">{t.categoryWeb}</option>
                    <option value="Software & Code">{t.categoryCode}</option>
                    <option value="Operating System & Hardware">{t.categoryOS}</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.optionalNoteLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    disabled={isAnalyzing}
                    placeholder={t.optionalNotePlaceholder}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Primary Analyze Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing || isProcessingFiles || selectedImages.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 text-white transition-all duration-300 shadow-lg cursor-pointer min-h-[50px] ${
                    isAnalyzing || isProcessingFiles
                      ? 'bg-blue-600/70 cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.99] shadow-blue-500/25 hover:shadow-blue-500/40'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {selectedImages.length > 1
                      ? `Analyze ${selectedImages.length} Screenshots with AI`
                      : t.analyzeButton}
                  </span>
                  <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
