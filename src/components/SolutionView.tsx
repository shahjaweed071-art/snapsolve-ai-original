import React, { useState } from 'react';
import {
  CheckCircle2 as CheckIcon,
  AlertTriangle as AlertIcon,
  Copy as CopyIcon,
  Check as CheckSimpleIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshIcon,
  Lightbulb as LightbulbIcon,
  ShieldAlert as ShieldAlertIcon,
  Terminal as TerminalIcon,
  Zap as ZapIcon,
  Info as InfoIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Maximize2 as MaximizeIcon,
  Minimize2 as MinimizeIcon,
  Layers as LayersIcon,
  ImageIcon,
  Sparkles as SparklesIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Star as StarIcon,
  ChevronsUpDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisResult, DetailedSolution, Language } from '../types';
import { translations } from '../utils/translations';
import { FollowUpChat } from './FollowUpChat';

interface SolutionViewProps {
  result: AnalysisResult;
  screenshotImages?: string[];
  screenshotImage?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  onReAnalyze: () => void;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  result,
  screenshotImages,
  screenshotImage,
  language,
  onReset,
  onReAnalyze,
}) => {
  const t = translations[language];
  const isRtl = language === 'ur';

  // Normalize images array (at least 1 image)
  const images: string[] =
    screenshotImages && screenshotImages.length > 0
      ? screenshotImages
      : screenshotImage
      ? [screenshotImage]
      : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  // Completed steps tracking per solution (keyed by "solIndex-stepNumber")
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Expandable cards state: map of solutionNumber -> boolean (Solution 1 open by default)
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const [copiedSolution, setCopiedSolution] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const totalAnalyzed = result.screenshotsAnalyzedCount || images.length || 1;

  // Ensure fourSolutions has 4 structured solutions even if model provided fewer
  const getFourSolutions = (): DetailedSolution[] => {
    if (result.fourSolutions && result.fourSolutions.length >= 4) {
      return result.fourSolutions.slice(0, 4);
    }

    const baseList: DetailedSolution[] = result.fourSolutions ? [...result.fourSolutions] : [];

    // Solution 1: Fastest Quick Fix / Immediate Action
    if (!baseList.some((s) => s.solutionNumber === 1)) {
      baseList.push({
        solutionNumber: 1,
        title:
          language === 'ur'
            ? 'تیز ترین فوری حل'
            : language === 'hi'
            ? 'सबसे तेज़ त्वरित समाधान'
            : 'Fastest Quick Fix',
        strategy:
          language === 'ur'
            ? 'براہ راست اور فوری حل جو زیادہ تر مسائل کو چند لمحوں میں حل کرتا ہے۔'
            : language === 'hi'
            ? 'सीधा और त्वरित समाधान जो तुरंत काम करता है।'
            : 'Immediate direct intervention to restore baseline functionality in under a minute.',
        steps: result.steps && result.steps.length > 0 ? result.steps.slice(0, 2) : [
          {
            stepNumber: 1,
            title: language === 'ur' ? 'فوری عمل' : language === 'hi' ? 'त्वरित कार्रवाई' : 'Direct Action',
            instruction: result.quickFix || 'Restart the application and retry the action.',
          }
        ],
        expectedOutcome:
          language === 'ur'
            ? 'مسئلہ فوری طور پر حل ہو جائے گا۔'
            : language === 'hi'
            ? 'समस्या तुरंत ठीक हो जाएगी।'
            : 'Immediate restoration of the interrupted process.',
      });
    }

    // Solution 2: Cache, Session & State Reset
    if (!baseList.some((s) => s.solutionNumber === 2)) {
      baseList.push({
        solutionNumber: 2,
        title:
          language === 'ur'
            ? 'کیشے اور سیشن ری سیٹ'
            : language === 'hi'
            ? 'कैश और सत्र रीसेट'
            : 'Cache, Session & State Reset',
        strategy:
          language === 'ur'
            ? 'خراب عارضی فائلیں اور پرانا کیشے صاف کر کے دوبارہ شروع کریں۔'
            : language === 'hi'
            ? 'दूषित डेटा और अस्थायी फ़ाइलों को साफ़ करें।'
            : 'Purge corrupted temporary state, expired authentication tokens, and cached storage.',
        steps: [
          {
            stepNumber: 1,
            title:
              language === 'ur'
                ? 'ایپ یا براؤزر کیشے صاف کریں'
                : language === 'hi'
                ? 'ऐप या ब्राउज़र कैश साफ़ करें'
                : 'Clear App / Browser Cache & Storage',
            instruction:
              language === 'ur'
                ? 'ڈیوائس سیٹنگز یا براؤزر ہسٹری میں جا کر کیشے کو صاف کریں۔'
                : language === 'hi'
                ? 'डिवाइस सेटिंग्स में जाकर कैश साफ़ करें।'
                : 'Navigate to device App Info or browser settings and perform a full cache clearance.',
            commandOrPath: 'Settings > Apps > Storage > Clear Cache',
          },
          {
            stepNumber: 2,
            title:
              language === 'ur'
                ? 'سیشن لاگ آؤٹ اور دوبارہ سائن ان'
                : language === 'hi'
                ? 'लॉगआउट और पुनः लॉगिन'
                : 'Session Re-authentication',
            instruction:
              language === 'ur'
                ? 'اکاؤنٹ سے لاگ آؤٹ کر کے دوبارہ لاگ ان کریں تاکہ نیا سیشن حاصل ہو۔'
                : language === 'hi'
                ? 'लॉगआउट करें और नए टोकन के साथ पुनः लॉगिन करें।'
                : 'Log out completely and re-authenticate to refresh security headers and tokens.',
          },
        ],
        expectedOutcome:
          language === 'ur'
            ? 'پرانا کیشے اور سیشن ٹکراؤ ختم ہو جائے گا۔'
            : language === 'hi'
            ? 'अस्थायी त्रुटियाँ समाप्त हो जाएंगी।'
            : 'Elimination of stale session conflicts and temporary data corruptions.',
      });
    }

    // Solution 3: Network, Configuration & Permissions
    if (!baseList.some((s) => s.solutionNumber === 3)) {
      baseList.push({
        solutionNumber: 3,
        title:
          language === 'ur'
            ? 'نیٹ ورک اور ترتیبات کی تصدیق'
            : language === 'hi'
            ? 'नेटवर्क और अनुमतियाँ सत्यापन'
            : 'Network, Permissions & System Configuration',
        strategy:
          language === 'ur'
            ? 'نیٹ ورک کنکشن، ڈی این ایس، اور ایپ کی اجازتوں کی درستی کریں۔'
            : language === 'hi'
            ? 'नेटवर्क कनेक्शन और अनुमतियों की जांच करें।'
            : 'Audit network route, DNS latency, proxy/VPN interference, and OS-level permissions.',
        steps: [
          {
            stepNumber: 1,
            title:
              language === 'ur'
                ? 'نیٹ ورک یا VPN سوئچ کریں'
                : language === 'hi'
                ? 'नेटवर्क या वीपीएन स्विच करें'
                : 'Toggle Connection & VPN Disconnection',
            instruction:
              language === 'ur'
                ? 'اگر VPN چالو ہے تو بند کریں، یا Wi-Fi سے موبائل ڈیٹا پر سوئچ کریں۔'
                : language === 'hi'
                ? 'वीपीएन बंद करें या मोबाइल डेटा पर स्विच करें।'
                : 'Temporarily disable active VPN/proxy tunnels or switch from Wi-Fi to cellular data.',
          },
          {
            stepNumber: 2,
            title:
              language === 'ur'
                ? 'ایپ کی ضروری اجازتیں چیک کریں'
                : language === 'hi'
                ? 'ऐप अनुमतियों की जांच करें'
                : 'Verify Essential App Permissions',
            instruction:
              language === 'ur'
                ? 'یقینی بنائیں کہ ایپ کے پاس انٹرنیٹ اور اسٹوریج کی درکار اجازت موجود ہے۔'
                : language === 'hi'
                ? 'सुनिश्चित करें कि आवश्यक अनुमतियाँ चालू हैं।'
                : 'Open OS Settings and confirm that network, storage, and background permissions are granted.',
            commandOrPath: 'Settings > Apps > Permissions',
          },
        ],
        expectedOutcome:
          language === 'ur'
            ? 'نیٹ ورک اور کنفیگریشن کی رکاوٹیں دور ہو جائیں گی۔'
            : language === 'hi'
            ? 'नेटवर्क अवरोध समाप्त होंगे।'
            : 'Resolves firewall filters, blocked IP ranges, and unauthorized system access.',
      });
    }

    // Solution 4: Fallback Recovery & Clean Reinstallation
    if (!baseList.some((s) => s.solutionNumber === 4)) {
      baseList.push({
        solutionNumber: 4,
        title:
          language === 'ur'
            ? 'متبادل ریکوری اور دوبارہ تنصیب'
            : language === 'hi'
            ? 'वैकल्पिक रिकवरी और पुनर्स्थापना'
            : 'Alternative Fallback & Clean Reinstall',
        strategy:
          language === 'ur'
            ? 'اگر تمام اقدامات ناکام رہیں تو ایپ اپ ڈیٹ یا مکمل دوبارہ تنصیب کریں۔'
            : language === 'hi'
            ? 'यदि सब विफल रहे तो ऐप अपडेट या सहायता से संपर्क करें।'
            : 'Exhaustive fallback recovery, application update/reinstallation, or official support escalation.',
        steps: [
          {
            stepNumber: 1,
            title:
              language === 'ur'
                ? 'ایپ اپ ڈیٹ یا دوبارہ انسٹال کریں'
                : language === 'hi'
                ? 'ऐप अपडेट या पुनः इंस्टॉल करें'
                : 'Update or Clean Reinstallation',
            instruction:
              language === 'ur'
                ? 'ایپ کو تازہ ترین ورژن میں اپ ڈیٹ کریں یا ان انسٹال کر کے دوبارہ انسٹال کریں۔'
                : language === 'hi'
                ? 'ऐप को नवीनतम संस्करण में अपडेट करें।'
                : 'Check Play Store / App Store for pending updates or perform a clean reinstall to restore missing binary files.',
          },
          {
            stepNumber: 2,
            title:
              language === 'ur'
                ? 'متبادل ویب پورٹل یا سپورٹ ٹکٹ'
                : language === 'hi'
                ? 'वैकल्पिक पोर्टल या ग्राहक सेवा'
                : 'Cross-Platform Web Portal or Support Ticket',
            instruction:
              result.alternativeSolution ||
              (language === 'ur'
                ? 'اسی سروس کو ویب براؤزر پر کھولیں یا سپورٹ ٹیم کو اسکرین شاٹ بھیجیں۔'
                : language === 'hi'
                ? 'वेब ब्राउज़र का उपयोग करें या सहायता से संपर्क करें।'
                : 'Access the service via its official web portal or provide the generated diagnosis report to technical support.'),
          },
        ],
        expectedOutcome:
          language === 'ur'
            ? 'مسئلے کا مستقل سدباب۔'
            : language === 'hi'
            ? 'समस्या का स्थायी समाधान।'
            : 'Guaranteed resolution via fresh binaries or verified support escalation.',
      });
    }

    return baseList.sort((a, b) => a.solutionNumber - b.solutionNumber).slice(0, 4);
  };

  const fourSolutions = getFourSolutions();

  const toggleCard = (solNumber: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [solNumber]: !prev[solNumber],
    }));
  };

  const handleExpandAll = () => {
    setExpandedCards({ 1: true, 2: true, 3: true, 4: true });
  };

  const handleCollapseAll = () => {
    setExpandedCards({ 1: false, 2: false, 3: false, 4: false });
  };

  const toggleStep = (solIndex: number, stepNumber: number) => {
    const key = `${solIndex}-${stepNumber}`;
    setCompletedSteps((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const currentSol = fourSolutions[solIndex];
      if (currentSol) {
        const allDone = currentSol.steps.every((s) =>
          s.stepNumber === stepNumber ? next[key] : next[`${solIndex}-${s.stepNumber}`]
        );
        if (allDone) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch {
            // ignore
          }
        }
      }
      return next;
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          label: 'Critical Error',
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
          label: 'High Severity',
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          label: 'Medium Severity',
        };
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          label: 'Standard',
        };
    }
  };

  const severityStyle = getSeverityBadge(result.severity);

  // Formatted full diagnostic report for "Copy Full Solution" and "Download Solution"
  const generateFormattedSolution = () => {
    let content = `=================================================\n`;
    content += `SNAPSOLVE AI - DIAGNOSTIC REPORT & RESOLUTION\n`;
    content += `=================================================\n\n`;
    content += `PRIMARY ISSUE: ${result.errorTitle}\n`;
    content += `CATEGORY: ${result.category}\n`;
    content += `SEVERITY: ${result.severity.toUpperCase()}\n`;
    content += `AI CONFIDENCE: ${result.confidenceScore}%\n`;
    content += `TOTAL SCREENSHOTS ANALYZED: ${totalAnalyzed}\n`;
    if (result.detectedErrorText) {
      content += `DETECTED ERROR CODES / TEXT: ${result.detectedErrorText}\n`;
    }
    content += `\n-------------------------------------------------\n`;
    content += `COMBINED PROBLEM EXPLANATION:\n`;
    content += `${result.combinedProblemExplanation || result.rootCause}\n`;

    content += `\n-------------------------------------------------\n`;
    content += `FASTEST 30-SECOND QUICK FIX:\n`;
    content += `${result.quickFix}\n`;

    content += `\n-------------------------------------------------\n`;
    content += `ROOT CAUSE (WHY THIS OCCURRED):\n`;
    content += `${result.rootCause}\n`;

    if (result.confirmedFacts && result.confirmedFacts.length > 0) {
      content += `\nCONFIRMED FACTS OBSERVED IN SCREENSHOTS:\n`;
      result.confirmedFacts.forEach((fact) => {
        content += `  • ${fact}\n`;
      });
    }

    if (result.possibleCauses && result.possibleCauses.length > 0) {
      content += `\nPROBABLE CONTRIBUTING CAUSES:\n`;
      result.possibleCauses.forEach((cause) => {
        content += `  • ${cause}\n`;
      });
    }

    content += `\n=================================================\n`;
    content += `4 TARGETED PRACTICAL SOLUTIONS:\n`;
    content += `=================================================\n\n`;

    fourSolutions.forEach((sol) => {
      content += `[SOLUTION ${sol.solutionNumber}]: ${sol.title}${
        sol.solutionNumber === 1 ? ' (RECOMMENDED PRIMARY)' : ''
      }\n`;
      content += `Strategy: ${sol.strategy}\n`;
      if (sol.expectedOutcome) {
        content += `Expected Outcome: ${sol.expectedOutcome}\n`;
      }
      content += `Steps:\n`;
      sol.steps.forEach((step) => {
        content += `  ${step.stepNumber}. ${step.title}\n`;
        content += `     Instruction: ${step.instruction}\n`;
        if (step.commandOrPath) {
          content += `     Command/Path: ${step.commandOrPath}\n`;
        }
        if (step.actionableTip) {
          content += `     ${step.isCaution ? '[CAUTION] ' : 'Tip: '}${step.actionableTip}\n`;
        }
      });
      content += `\n`;
    });

    if (result.preventionTips && result.preventionTips.length > 0) {
      content += `-------------------------------------------------\n`;
      content += `PREVENTION TIPS:\n`;
      result.preventionTips.forEach((tip, idx) => {
        content += `  ${idx + 1}. ${tip}\n`;
      });
      content += `\n`;
    }

    if (result.alternativeSolution) {
      content += `-------------------------------------------------\n`;
      content += `ALTERNATIVE FALLBACK:\n`;
      content += `${result.alternativeSolution}\n\n`;
    }

    if (result.technicalDetails) {
      content += `-------------------------------------------------\n`;
      content += `TECHNICAL PROTOCOL DETAILS:\n`;
      content += `${result.technicalDetails}\n\n`;
    }

    content += `=================================================\n`;
    content += `Generated by SnapSolve AI (Gemini Vision Multi-Screenshot Engine)\n`;
    content += `Analyzed ${totalAnalyzed} Screenshot(s) | Generated: ${new Date().toLocaleString()}\n`;
    return content;
  };

  // Concise text for "Copy Answer"
  const generateConciseAnswer = () => {
    let text = `${result.errorTitle}\n`;
    text += `Category: ${result.category} | Analyzed: ${totalAnalyzed} Screenshot(s)\n\n`;
    text += `Summary: ${result.combinedProblemExplanation || result.rootCause}\n\n`;
    text += `Quick Fix: ${result.quickFix}\n\n`;
    text += `4 Solutions:\n`;
    fourSolutions.forEach((sol) => {
      text += `• Solution ${sol.solutionNumber} (${sol.title})${
        sol.solutionNumber === 1 ? ' [Recommended]' : ''
      }: ${sol.strategy}\n`;
    });
    return text;
  };

  const handleCopySolution = async () => {
    try {
      const text = generateFormattedSolution();
      await navigator.clipboard.writeText(text);
      setCopiedSolution(true);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {
        // ignore
      }
      setTimeout(() => setCopiedSolution(false), 3000);
    } catch (err) {
      console.error('Failed to copy solution:', err);
    }
  };

  const handleCopyAnswer = async () => {
    try {
      const text = generateConciseAnswer();
      await navigator.clipboard.writeText(text);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2500);
    } catch (err) {
      console.error('Failed to copy answer:', err);
    }
  };

  const handleDownloadSolution = () => {
    const text = generateFormattedSolution();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const sanitizedTitle = (result.errorTitle || 'SnapSolve-Solution')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    a.href = url;
    a.download = `SnapSolve_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopySnippet = async (snippet: string) => {
    await navigator.clipboard.writeText(snippet);
    setCopiedCommand(snippet);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const openZoomModal = (index: number) => {
    setZoomImageIndex(index);
    setIsZoomModalOpen(true);
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 ${
        isRtl ? 'dir-rtl' : ''
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Upload Another / Start Fresh */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <RefreshIcon className="w-4 h-4 text-blue-500" />
            <span>{t.uploadAnother}</span>
          </button>

          {/* Re-Analyze Button */}
          <button
            onClick={onReAnalyze}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <SparklesIcon className="w-4 h-4 text-blue-500" />
            <span>{t.retryButton}</span>
          </button>

          {/* Screenshots Analyzed Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
            <LayersIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {totalAnalyzed}{' '}
              {totalAnalyzed === 1
                ? 'Screenshot Analyzed'
                : `${t.screenshotsAnalyzedBadge || 'Screenshots Analyzed'}`}
            </span>
          </div>
        </div>

        {/* Copy & Download Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Concise Answer */}
          <button
            onClick={handleCopyAnswer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95 transition cursor-pointer min-h-[44px]"
            title="Copy concise summary of error & solutions"
          >
            {copiedAnswer ? (
              <CheckSimpleIcon className="w-4 h-4 text-emerald-500" />
            ) : (
              <CopyIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
            <span>{copiedAnswer ? 'Copied Answer!' : t.copyAnswer}</span>
          </button>

          {/* Copy Full Solution */}
          <button
            onClick={handleCopySolution}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer min-h-[44px] shadow-sm ${
              copiedSolution
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedSolution ? (
              <CheckSimpleIcon className="w-4 h-4" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
            <span>{copiedSolution ? t.solutionCopied : t.copySolution}</span>
          </button>

          {/* Download Solution Button */}
          <button
            onClick={handleDownloadSolution}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition border cursor-pointer min-h-[44px] ${
              downloadSuccess
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/40'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <DownloadIcon className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">
              {downloadSuccess ? t.downloadStarted : t.downloadSolution}
            </span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>
      </div>

      {/* Main Diagnosis Summary Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                {result.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${severityStyle.bg}`}
              >
                {severityStyle.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckIcon className="w-3.5 h-3.5" />
                <span>
                  {result.confidenceScore}% {t.confidence}
                </span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                <LayersIcon className="w-3 h-3 text-indigo-500" />
                <span>
                  {totalAnalyzed} {totalAnalyzed === 1 ? 'Screenshot' : 'Screenshots'}
                </span>
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight ${
                isRtl ? 'font-urdu' : ''
              }`}
            >
              {result.errorTitle}
            </h1>

            {result.detectedErrorText && (
              <div
                className="p-3 rounded-xl bg-slate-900 text-rose-400 border border-slate-800 font-mono text-xs overflow-x-auto flex items-center justify-between gap-3"
                dir="ltr"
              >
                <div className="flex items-center gap-2 truncate">
                  <TerminalIcon className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{result.detectedErrorText}</span>
                </div>
                <button
                  onClick={() => handleCopySnippet(result.detectedErrorText)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex-shrink-0 cursor-pointer min-h-[30px]"
                >
                  {copiedCommand === result.detectedErrorText ? 'Copied' : 'Copy Code'}
                </button>
              </div>
            )}

            {/* Quick 30-Second Fix Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/30 text-slate-800 dark:text-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
                <ZapIcon className="w-4 h-4 text-blue-500" />
                <span>{t.quickFixBanner}</span>
              </div>
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  isRtl ? 'font-urdu' : ''
                }`}
              >
                {result.quickFix}
              </p>
            </div>
          </div>

          {/* Right: Multi-Screenshot Gallery & Preview */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            {images.length > 0 && (
              <div className="w-full space-y-3">
                {/* Active Main Preview Image */}
                <div
                  onClick={() => openZoomModal(activeImageIndex)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 group shadow-md w-full aspect-[4/3] flex items-center justify-center"
                  title="Click to zoom screenshot"
                >
                  <img
                    src={images[activeImageIndex] || images[0]}
                    alt={`Diagnosed Screenshot ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain transition duration-200 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Screenshot #{activeImageIndex + 1}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                    <MaximizeIcon className="w-4 h-4" />
                    <span>Zoom Screenshot</span>
                  </div>
                </div>

                {/* Thumbnails Strip if multiple screenshots */}
                {images.length > 1 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 font-semibold">
                      <span>All Analyzed Screenshots ({images.length})</span>
                      <span>Click to preview</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative rounded-xl overflow-hidden aspect-video border-2 transition cursor-pointer bg-slate-950 min-h-[44px] ${
                            activeImageIndex === idx
                              ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/80 text-[10px] text-white font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  {images.length > 1
                    ? `Click any thumbnail to preview. All ${images.length} screenshots contributed to this diagnosis.`
                    : 'Click image to expand full-screen.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Combined Problem Explanation Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <LayersIcon className="w-5 h-5 text-indigo-500" />
              <span>{t.combinedProblemTitle || 'Combined Problem Explanation'}</span>
            </h3>
            <p
              className={`text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed ${
                isRtl ? 'font-urdu leading-loose' : ''
              }`}
            >
              {result.combinedProblemExplanation || result.rootCause}
            </p>
          </div>

          {/* Root Cause & Facts Grid */}
          <div className="mt-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <LightbulbIcon className="w-4 h-4 text-amber-500" />
                <span>{t.rootCauseTitle}</span>
              </h4>
              <p
                className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${
                  isRtl ? 'font-urdu leading-loose' : ''
                }`}
              >
                {result.rootCause}
              </p>
            </div>

            {/* Separation of Confirmed Facts vs Probable Causes */}
            {((result.confirmedFacts && result.confirmedFacts.length > 0) ||
              (result.possibleCauses && result.possibleCauses.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {result.confirmedFacts && result.confirmedFacts.length > 0 && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t.confirmedFactsTitle}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {result.confirmedFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.possibleCauses && result.possibleCauses.length > 0 && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <InfoIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.possibleCausesTitle}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {result.possibleCauses.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPGRADED 4 EXPANDABLE SOLUTION CARDS */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <SparklesIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>{t.fourSolutionsHeading || '4 Targeted Practical Solutions'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Expand any solution below to follow step-by-step resolution instructions.
            </p>
          </div>

          {/* Expand All / Collapse All controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer min-h-[36px]"
            >
              {t.expandAll || 'Expand All'}
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer min-h-[36px]"
            >
              {t.collapseAll || 'Collapse All'}
            </button>
          </div>
        </div>

        {/* 4 Clean Expandable Solution Cards */}
        <div className="space-y-4">
          {fourSolutions.map((sol, solIdx) => {
            const isExpanded = expandedCards[sol.solutionNumber] ?? (sol.solutionNumber === 1);
            const isRecommended = sol.solutionNumber === 1;

            return (
              <div
                key={sol.solutionNumber}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isRecommended
                    ? 'bg-white dark:bg-[#0f172a] border-blue-500/50 dark:border-blue-500/50 shadow-xl shadow-blue-500/10'
                    : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Header Toggle Row */}
                <button
                  type="button"
                  onClick={() => toggleCard(sol.solutionNumber)}
                  className="w-full p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 min-h-[56px]"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    {/* Solution Badge Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-sm ${
                        isRecommended
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      #{sol.solutionNumber}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <StarIcon className="w-3 h-3 fill-amber-500" />
                            <span>{t.recommendedBadge || 'Recommended Primary Solution'}</span>
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-slate-400">
                          {sol.steps.length} {sol.steps.length === 1 ? 'Step' : 'Steps'}
                        </span>
                      </div>

                      <h3
                        className={`text-base sm:text-lg font-bold text-slate-900 dark:text-white ${
                          isRtl ? 'font-urdu' : ''
                        }`}
                      >
                        {sol.title}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 ${
                          isRtl ? 'font-urdu' : ''
                        }`}
                      >
                        {sol.strategy}
                      </p>
                    </div>
                  </div>

                  {/* Expand / Collapse Icon */}
                  <div className="flex-shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Card Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Strategy & Outcome Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                      <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Strategy Overview:
                        </span>
                        <p
                          className={`text-sm text-slate-700 dark:text-slate-200 leading-relaxed ${
                            isRtl ? 'font-urdu leading-loose' : ''
                          }`}
                        >
                          {sol.strategy}
                        </p>
                      </div>

                      {sol.expectedOutcome && (
                        <div className="sm:col-span-1 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                            Expected Outcome:
                          </span>
                          <p
                            className={`text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed ${
                              isRtl ? 'font-urdu' : ''
                            }`}
                          >
                            {sol.expectedOutcome}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Step-by-Step Execution Plan:
                      </h4>

                      <div className="space-y-3">
                        {sol.steps.map((step) => {
                          const stepKey = `${solIdx}-${step.stepNumber}`;
                          const isDone = completedSteps[stepKey] || false;

                          return (
                            <div
                              key={step.stepNumber}
                              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                                isDone
                                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-90'
                                  : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-500/60'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <button
                                  type="button"
                                  onClick={() => toggleStep(solIdx, step.stepNumber)}
                                  className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition cursor-pointer min-h-[40px] min-w-[40px] ${
                                    isDone
                                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 border border-blue-200 dark:border-blue-700/50'
                                  }`}
                                  title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                                >
                                  {isDone ? <CheckSimpleIcon className="w-4 h-4" /> : step.stepNumber}
                                </button>

                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <h5
                                      className={`font-bold text-sm sm:text-base text-slate-900 dark:text-white ${
                                        isDone
                                          ? 'line-through text-slate-400 dark:text-slate-500'
                                          : ''
                                      } ${isRtl ? 'font-urdu' : ''}`}
                                    >
                                      {step.title}
                                    </h5>
                                    <button
                                      type="button"
                                      onClick={() => toggleStep(solIdx, step.stepNumber)}
                                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer min-h-[36px] ${
                                        isDone
                                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40'
                                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      {isDone ? t.stepCompleted : t.stepPending}
                                    </button>
                                  </div>

                                  <p
                                    className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${
                                      isRtl ? 'font-urdu leading-loose' : ''
                                    }`}
                                  >
                                    {step.instruction}
                                  </p>

                                  {step.commandOrPath && (
                                    <div
                                      className="mt-2.5 p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs flex items-center justify-between gap-3 border border-slate-800"
                                      dir="ltr"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <TerminalIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                        <code className="text-blue-300 truncate">
                                          {step.commandOrPath}
                                        </code>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleCopySnippet(step.commandOrPath!)}
                                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer min-h-[36px]"
                                      >
                                        {copiedCommand === step.commandOrPath ? (
                                          <>
                                            <CheckSimpleIcon className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <CopyIcon className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}

                                  {step.actionableTip && (
                                    <div
                                      className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                                        step.isCaution
                                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                                      }`}
                                    >
                                      {step.isCaution ? (
                                        <ShieldAlertIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      ) : (
                                        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      )}
                                      <span className={isRtl ? 'font-urdu' : ''}>
                                        {step.isCaution ? `${t.caution}: ` : ''}
                                        {step.actionableTip}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prevention & Fallback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Prevention Tips */}
        {result.preventionTips && result.preventionTips.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              <span>{t.preventionTitle}</span>
            </h3>
            <ul className="space-y-2.5">
              {result.preventionTips.map((tip, idx) => (
                <li
                  key={idx}
                  className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 ${
                    isRtl ? 'font-urdu leading-loose' : ''
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternative Solution */}
        {result.alternativeSolution && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertIcon className="w-4 h-4 text-amber-500" />
              <span>{t.alternativeTitle}</span>
            </h3>
            <p
              className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${
                isRtl ? 'font-urdu leading-loose' : ''
              }`}
            >
              {result.alternativeSolution}
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Technical Details */}
      {result.technicalDetails && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t.techDetailsTitle}
              </span>
            </div>
            {showTechDetails ? (
              <ChevronUpIcon className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {showTechDetails && (
            <div
              className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono bg-slate-50/50 dark:bg-slate-900/30"
              dir="ltr"
            >
              <p className="whitespace-pre-line leading-relaxed">{result.technicalDetails}</p>
            </div>
          )}
        </div>
      )}

      {/* AI Follow-Up Chat Component */}
      <FollowUpChat analysisResult={result} language={language} />

      {/* Full-Screen Zoom Modal View for any analyzed screenshot */}
      {isZoomModalOpen && images[zoomImageIndex] && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            className="relative max-h-[92vh] max-w-[92vw] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-2 text-white px-2">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                Screenshot {zoomImageIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Close"
              >
                <MinimizeIcon className="w-5 h-5" />
              </button>
            </div>

            <img
              src={images[zoomImageIndex]}
              alt={`Expanded Screenshot ${zoomImageIndex + 1}`}
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-white/10"
            />

            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setZoomImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                  }
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Prev Image</span>
                </button>
                <span className="text-white/80 text-xs font-mono">
                  {zoomImageIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                  }
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                >
                  <span>Next Image</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
