import { Language } from '../types';

export interface TranslationStrings {
  appName: string;
  appTagline: string;
  headline: string;
  subtitle: string;
  uploadAreaTitle: string;
  uploadAreaSubtitle: string;
  dragActiveText: string;
  pastePrompt: string;
  browseFiles: string;
  takePhoto: string;
  removeImage: string;
  uploadAnotherImage: string;
  addMoreScreenshots: string;
  maxImagesLimitWarning: string;
  imagesSelectedCount: string;
  maxFileSize: string;
  supportedFormats: string;
  categoryLabel: string;
  allCategories: string;
  categoryBanking: string;
  categoryMobile: string;
  categoryWeb: string;
  categoryCode: string;
  categoryOS: string;
  optionalNoteLabel: string;
  optionalNotePlaceholder: string;
  analyzeButton: string;
  analyzingButton: string;
  cancelAnalysis: string;
  analysisCancelled: string;
  analysisTimeout: string;
  retryAnalysis: string;
  scanningOverlay: string;
  trySampleNotice: string;
  sampleCategoriesTitle: string;
  sampleCategoriesSubtitle: string;
  clickToTry: string;
  analyzingHeadline: string;
  analyzingSubtext: string;
  analyzingStep1: string;
  analyzingStep2: string;
  analyzingStep3: string;
  solutionHeading: string;
  errorDetected: string;
  confidence: string;
  severity: string;
  quickFixBanner: string;
  rootCauseTitle: string;
  confirmedFactsTitle: string;
  possibleCausesTitle: string;
  combinedProblemTitle: string;
  screenshotsAnalyzedBadge: string;
  fourSolutionsHeading: string;
  solutionNumberLabel: string;
  stepsTitle: string;
  stepCompleted: string;
  stepPending: string;
  caution: string;
  preventionTitle: string;
  alternativeTitle: string;
  techDetailsTitle: string;
  copySolution: string;
  copyAnswer: string;
  tryAgain: string;
  solutionCopied: string;
  downloadSolution: string;
  downloadStarted: string;
  uploadAnother: string;
  chatHeading: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatThinking: string;
  clearChat: string;
  chatCleared: string;
  chatSuggestedPrompt1: string;
  chatSuggestedPrompt2: string;
  chatSuggestedPrompt3: string;
  noApiKeyError: string;
  generalError: string;
  retryButton: string;
  loadingStage1: string;
  loadingStage2: string;
  loadingStage3: string;
  loadingStage4: string;
  loadingStage5: string;
  recommendedBadge: string;
  expandAll: string;
  collapseAll: string;
  footerRights: string;
  lightMode: string;
  darkMode: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: 'SnapSolve AI',
    appTagline: 'Intelligent Screenshot Diagnostics',
    headline: 'Your Problems. Solved by AI.',
    subtitle: 'Upload up to 4 screenshots and get instant AI-powered solutions.',
    uploadAreaTitle: 'Drop up to 4 screenshots here',
    uploadAreaSubtitle: 'or click to browse from device / phone gallery',
    dragActiveText: 'Release to upload screenshots',
    pastePrompt: 'Tip: Press Ctrl+V / Cmd+V anywhere to paste screenshots directly (up to 4)',
    browseFiles: 'Select Screenshots',
    takePhoto: 'Take Photo',
    removeImage: 'Remove',
    uploadAnotherImage: 'Upload New',
    addMoreScreenshots: 'Add More Screenshots',
    maxImagesLimitWarning: 'Maximum 4 screenshots allowed. You can analyze up to 4 images at once.',
    imagesSelectedCount: 'Screenshots Selected',
    maxFileSize: 'Supports up to 4 screenshots (JPG, JPEG, PNG, WEBP)',
    supportedFormats: 'JPG, JPEG, PNG, WEBP',
    categoryLabel: 'Problem Category',
    allCategories: 'Auto-detect Category',
    categoryBanking: 'Banking & UPI Payment',
    categoryMobile: 'Mobile App (Android/iOS)',
    categoryWeb: 'Web & Cloud',
    categoryCode: 'Code & Terminal',
    categoryOS: 'OS & Device (Windows/Mac/Android)',
    optionalNoteLabel: 'Context / What were you doing? (Optional)',
    optionalNotePlaceholder: 'e.g. Occurred when confirming transaction, then showed this second error screen...',
    analyzeButton: 'Analyze All Screenshots with AI',
    analyzingButton: 'Correlating & Diagnosing Images...',
    cancelAnalysis: 'Cancel Analysis',
    analysisCancelled: 'Analysis was cancelled.',
    analysisTimeout: 'Analysis request timed out. Please verify your connection and tap Retry.',
    retryAnalysis: 'Retry Analysis',
    scanningOverlay: 'AI Vision Scanner Analyzing Images...',
    trySampleNotice: 'Or test instantly with a real-world error sample below',
    sampleCategoriesTitle: 'Common Problem Categories',
    sampleCategoriesSubtitle: 'Select any sample below to see SnapSolve AI in action immediately',
    clickToTry: 'Diagnose this error',
    analyzingHeadline: 'Gemini Vision AI is analyzing all screenshots',
    analyzingSubtext: 'Connecting evidence across images, diagnosing root cause, and building 4 targeted solutions...',
    analyzingStep1: 'Scanning all image pixels & extracting text/codes in parallel',
    analyzingStep2: 'Correlating errors, sequence of events & technical logs',
    analyzingStep3: 'Formulating 4 actionable step-by-step resolution plans',
    solutionHeading: 'Diagnostic Report & Resolution',
    errorDetected: 'Detected Problem',
    confidence: 'AI Confidence',
    severity: 'Severity',
    quickFixBanner: 'Fastest 30-Second Quick Fix',
    rootCauseTitle: 'Why This Happened (Root Cause)',
    confirmedFactsTitle: 'Confirmed Facts from Screenshots',
    possibleCausesTitle: 'Probable Contributing Factors',
    combinedProblemTitle: 'Combined Problem Explanation',
    screenshotsAnalyzedBadge: 'Screenshots Analyzed Together',
    fourSolutionsHeading: '4 Targeted Practical Solutions',
    solutionNumberLabel: 'Solution',
    stepsTitle: 'Step-by-Step Instructions',
    stepCompleted: 'Completed',
    stepPending: 'Mark Done',
    caution: 'Caution Note',
    preventionTitle: 'How to Prevent This in the Future',
    alternativeTitle: 'Alternative Fallback Solution',
    techDetailsTitle: 'Technical Diagnostics & Protocol Details',
    copySolution: 'Copy Full Solution',
    copyAnswer: 'Copy Answer',
    tryAgain: 'Try Again',
    solutionCopied: 'Copied to Clipboard!',
    downloadSolution: 'Download Solution (.txt)',
    downloadStarted: 'Solution Downloaded!',
    uploadAnother: 'Diagnose Other Screenshots',
    chatHeading: 'AI Follow-Up Assistant',
    chatSubtitle: 'Have questions about these screenshots or need tailored help? Ask below.',
    chatPlaceholder: 'Ask a follow-up question about these screenshots...',
    chatSend: 'Send',
    chatThinking: 'SnapSolve AI is formulating an answer...',
    clearChat: 'Clear Chat',
    chatCleared: 'Chat history cleared.',
    chatSuggestedPrompt1: 'Which of the 4 solutions should I try first?',
    chatSuggestedPrompt2: 'Will doing these steps delete my personal data?',
    chatSuggestedPrompt3: 'What if all solutions fail?',
    noApiKeyError: 'API key not configured on server. Please ensure GEMINI_API_KEY is available in Secrets.',
    generalError: 'Failed to analyze screenshots. Please verify the images and try again.',
    retryButton: 'Try Again',
    loadingStage1: 'Uploading screenshots',
    loadingStage2: 'Processing images',
    loadingStage3: 'Detecting problems',
    loadingStage4: 'Generating solutions',
    loadingStage5: 'Preparing results',
    recommendedBadge: 'Recommended Primary Solution',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    footerRights: 'SnapSolve AI • Real-time multi-image error diagnosis powered by Gemini Vision AI',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
  },
  ur: {
    appName: 'سنیپ سالو اے آئی',
    appTagline: 'ایک ساتھ 4 اسکرین شاٹس کی مدد سے خرابیوں کا فوری حل',
    headline: 'آپ کے مسائل۔ اے آئی کا حل۔',
    subtitle: 'ایک ساتھ 4 تک اسکرین شاٹس اپ لوڈ کریں اور فوری مشترکہ حل حاصل کریں۔',
    uploadAreaTitle: 'یہاں 4 تک خرابی کے اسکرین شاٹس ڈراپ کریں',
    uploadAreaSubtitle: 'یا فون کی گیلری یا کمپیوٹر سے ایک یا زیادہ فائلیں منتخب کریں',
    dragActiveText: 'اسکرین شاٹس اپ لوڈ کرنے کے لیے چھوڑیں',
    pastePrompt: 'مشورہ: آپ کی بورڈ پر Ctrl+V دبا کر بھی 4 تک اسکرین شاٹس براہ راست پیسٹ کر سکتے ہیں',
    browseFiles: 'اسکرین شاٹس منتخب کریں',
    takePhoto: 'کیمرہ کھولیں',
    removeImage: 'ہٹائیں',
    uploadAnotherImage: 'نئے منتخب کریں',
    addMoreScreenshots: 'مزید اسکرین شاٹ شامل کریں',
    maxImagesLimitWarning: 'آپ ایک وقت میں زیادہ سے زیادہ 4 اسکرین شاٹس منتخب کر سکتے ہیں۔',
    imagesSelectedCount: 'اسکرین شاٹس منتخب شدہ',
    maxFileSize: '4 تک تصاویر (JPG, JPEG, PNG, WEBP)',
    supportedFormats: 'JPG, JPEG, PNG, WEBP',
    categoryLabel: 'مسئلے کی قسم',
    allCategories: 'خودکار تشخیص (سب اقسام)',
    categoryBanking: 'بینکنگ اور یو پی آئی ادائیگی',
    categoryMobile: 'موبائل ایپ (اینڈرائیڈ / آئی فون)',
    categoryWeb: 'ویب سائٹ اور براؤزر',
    categoryCode: 'کوڈنگ اور سوفٹ ویئر',
    categoryOS: 'آپریٹنگ سسٹم اور ڈیوائس',
    optionalNoteLabel: 'اضافی معلومات (اختیاری)',
    optionalNotePlaceholder: 'مثال کے طور پر: پہلی اسکرین پر رقم کٹی اور دوسری پر ایرر کوڈ آیا...',
    analyzeButton: 'تمام اسکرین شاٹس کا اے آئی تجزیہ کریں',
    analyzingButton: 'تصاویر کا مشترکہ جائزہ لیا جا رہا ہے...',
    cancelAnalysis: 'تجزیہ منسوخ کریں',
    analysisCancelled: 'تجزیہ منسوخ کر دیا گیا۔',
    analysisTimeout: 'تجزیہ میں زیادہ وقت لگ رہا ہے۔ برائے مہربانی انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
    retryAnalysis: 'دوبارہ کوشش کریں',
    scanningOverlay: 'اے آئی وژن اسکینر تصاویر کا جائزہ لے رہا ہے...',
    trySampleNotice: 'یا نیچے دیے گئے عام مسائل کے نمونے آزما کر دیکھیں',
    sampleCategoriesTitle: 'عام مسائل کے نمونے',
    sampleCategoriesSubtitle: 'فوری طور پر اے آئی کی کارکردگی دیکھنے کے لیے کسی ایک کو منتخب کریں',
    clickToTry: 'اس خرابی کا حل دیکھیں',
    analyzingHeadline: 'جیمینائی وژن اے آئی تمام اسکرین شاٹس کا معائنہ کر رہا ہے',
    analyzingSubtext: 'تمام تصاویر کے شواہد کو جوڑ کر 4 جامع حل تیار کیے جا رہے ہیں...',
    analyzingStep1: 'تمام تصاویر سے لکھائی اور ایرر کوڈز کا جائزہ',
    analyzingStep2: 'خرابیوں کا باہمی تعلق اور اصل وجہ کی نشاندہی',
    analyzingStep3: '4 آسان مرحلہ وار حل کی تیاری',
    solutionHeading: 'تشخیصی رپورٹ اور مشترکہ حل',
    errorDetected: 'تشخیص شدہ مسئلہ',
    confidence: 'اے آئی کا اعتماد',
    severity: 'شدت',
    quickFixBanner: 'فوری 30 سیکنڈ کا حل',
    rootCauseTitle: 'خرابی کی اصل وجہ (کیوں ہوا؟)',
    confirmedFactsTitle: 'اسکرین شاٹس سے تصدیق شدہ حقائق',
    possibleCausesTitle: 'ممکنہ معاون وجوہات',
    combinedProblemTitle: 'تمام اسکرین شاٹس کا مشترکہ خلاصہ',
    screenshotsAnalyzedBadge: 'اسکرین شاٹس کا باہمی تجزیہ',
    fourSolutionsHeading: 'مشترکہ شواہد پر مبنی 4 جامع حل',
    solutionNumberLabel: 'حل نمبر',
    stepsTitle: 'مرحلہ وار حل کا طریقہ کار',
    stepCompleted: 'مکمل ہو گیا',
    stepPending: 'مکمل نشان زد کریں',
    caution: 'احتیاطی ہدایت',
    preventionTitle: 'مستقبل میں اس مسئلے سے بچنے کے طریقے',
    alternativeTitle: 'متبادل حل (اگر مسئلہ برقرار رہے)',
    techDetailsTitle: 'تکنیکی تفصیلات',
    copySolution: 'مکمل حل کاپی کریں',
    copyAnswer: 'جواب کاپی کریں',
    tryAgain: 'دوبارہ کوشش کریں',
    solutionCopied: 'حل کاپی ہو گیا!',
    downloadSolution: 'حل ڈاؤن لوڈ کریں (.txt)',
    downloadStarted: 'فائل ڈاؤن لوڈ ہو گئی!',
    uploadAnother: 'دیگر اسکرین شاٹس چیک کریں',
    chatHeading: 'اے آئی فالو اپ چیٹ',
    chatSubtitle: 'کیا آپ کو ان اسکرین شاٹس کے بارے میں مزید رہنمائی درکار ہے؟',
    chatPlaceholder: 'ان اسکرین شاٹس سے متعلق کوئی بھی سوال پوچھیں...',
    chatSend: 'بھیجیں',
    chatThinking: 'جواب تیار کیا جا رہا ہے...',
    clearChat: 'چیٹ صاف کریں',
    chatCleared: 'چیٹ کی تاریخ صاف کر دی گئی ہے۔',
    chatSuggestedPrompt1: 'ان 4 حلوں میں سے مجھے پہلے کون سا طریقہ کرنا چاہیے؟',
    chatSuggestedPrompt2: 'کیا یہ طریقہ کرنے سے میرا ڈیٹا ختم ہو جائے گا؟',
    chatSuggestedPrompt3: 'اگر تمام حل کام نہ کریں تو کیا کریں؟',
    noApiKeyError: 'سرور پر API کلید موجود نہیں ہے۔',
    generalError: 'اسکرین شاٹس کا تجزیہ نہیں ہو سکا۔ برائے مہربانی دوبارہ کوشش کریں۔',
    retryButton: 'دوبارہ کوشش کریں',
    loadingStage1: 'اسکرین شاٹس اپ لوڈ کیے جا رہے ہیں',
    loadingStage2: 'تصاویر پروسیس ہو رہی ہیں',
    loadingStage3: 'خرابیوں کی نشاندہی کی جا رہی ہے',
    loadingStage4: 'حل تیار کیے جا رہے ہیں',
    loadingStage5: 'نتائج تیار کیے جا رہے ہیں',
    recommendedBadge: 'تجویز کردہ بنیادی حل',
    expandAll: 'تمام کھولیں',
    collapseAll: 'تمام بند کریں',
    footerRights: 'سنیپ سالو اے آئی • ملٹی امیج جیمینائی وژن لائیو تجزیہ',
    lightMode: 'لائٹ موڈ',
    darkMode: 'ڈارک موڈ',
  },
  hi: {
    appName: 'SnapSolve AI',
    appTagline: 'एक साथ 4 स्क्रीनशॉट से समस्याओं का सटीक निवारण',
    headline: 'आपकी समस्याएं। AI का सटीक समाधान।',
    subtitle: 'एक साथ 4 स्क्रीनशॉट तक अपलोड करें और त्वरित संयुक्त समाधान पाएं।',
    uploadAreaTitle: 'यहाँ 4 तक स्क्रीनशॉट डालें',
    uploadAreaSubtitle: 'या फोन गैलरी या कंप्यूटर से एक या अधिक फाइलें चुनें',
    dragActiveText: 'स्क्रीनशॉट अपलोड करने के लिए छोड़ें',
    pastePrompt: 'सुझाव: आप स्क्रीनशॉट लेने के बाद सीधे Ctrl+V दबाकर 4 तक इमेज पेस्ट कर सकते हैं',
    browseFiles: 'स्क्रीनशॉट चुनें',
    takePhoto: 'कैमरा खोलें',
    removeImage: 'हटाएं',
    uploadAnotherImage: 'नए चुनें',
    addMoreScreenshots: 'और स्क्रीनशॉट जोड़ें',
    maxImagesLimitWarning: 'अधिकतम 4 स्क्रीनशॉट की अनुमति है। आप एक बार में 4 तक इमेज विश्लेषित कर सकते हैं।',
    imagesSelectedCount: 'स्क्रीनशॉट चयनित',
    maxFileSize: '4 तक इमेज (JPG, JPEG, PNG, WEBP)',
    supportedFormats: 'JPG, JPEG, PNG, WEBP',
    categoryLabel: 'समस्या की श्रेणी',
    allCategories: 'ऑटो-डिटेक्ट श्रेणी',
    categoryBanking: 'बैंकिंग और UPI पेमेंट',
    categoryMobile: 'मोबाइल ऐप (Android/iOS)',
    categoryWeb: 'वेबसाइट और ब्राउज़र',
    categoryCode: 'कोडिंग और सॉफ्टवेयर',
    categoryOS: 'ऑपरेटिंग सिस्टम और डिवाइस',
    optionalNoteLabel: 'अतिरिक्त विवरण (वैकल्पिक)',
    optionalNotePlaceholder: 'उदा. पहले पेमेंट पेंडिंग हुआ फिर दूसरी स्क्रीन पर एरर कोड आया...',
    analyzeButton: 'सभी स्क्रीनशॉट का AI विश्लेषण करें',
    analyzingButton: 'इमेजेस का संयुक्त विश्लेषण हो रहा है...',
    cancelAnalysis: 'विश्लेषण रद्द करें',
    analysisCancelled: 'विश्लेषण रद्द कर दिया गया।',
    analysisTimeout: 'विश्लेषण में अधिक समय लग रहा है। कृपया इंटरनेट जांचें और पुनः प्रयास करें।',
    retryAnalysis: 'पुनः प्रयास करें',
    scanningOverlay: 'AI विज़न स्कैनर इमेजेस को स्कैन कर रहा है...',
    trySampleNotice: 'या नीचे दिए गए वास्तविक उदाहरणों में से किसी एक को तुरंत आज़माएं',
    sampleCategoriesTitle: 'प्रमुख समस्या श्रेणियाँ',
    sampleCategoriesSubtitle: 'SnapSolve AI की कार्यप्रणाली तुरंत देखने के लिए कोई नमूना चुनें',
    clickToTry: 'इस एरर का समाधान देखें',
    analyzingHeadline: 'Gemini Vision AI सभी स्क्रीनशॉट का विश्लेषण कर रहा है',
    analyzingSubtext: 'सभी इमेजेस के प्रमाणों को जोड़कर 4 सटीक समाधान तैयार किए जा रहे हैं...',
    analyzingStep1: 'सभी स्क्रीनशॉट से एरर कोड और टेक्स्ट की पहचान',
    analyzingStep2: 'समस्याओं का पारस्परिक संबंध और मूल कारण की पहचान',
    analyzingStep3: '4 चरणबद्ध समाधान रणनीतियों का निर्माण',
    solutionHeading: 'डायग्नोस्टिक रिपोर्ट एवं समाधान',
    errorDetected: 'पहचाना गया मुख्य एरर',
    confidence: 'AI सटीकता',
    severity: 'गंभीरता',
    quickFixBanner: '30-सेकंड का त्वरित समाधान',
    rootCauseTitle: 'यह एरर क्यों आया (मूल कारण)',
    confirmedFactsTitle: 'स्क्रीनशॉट से प्रमाणित तथ्य',
    possibleCausesTitle: 'संभावित कारण',
    combinedProblemTitle: 'सभी स्क्रीनशॉट का संयुक्त विवरण',
    screenshotsAnalyzedBadge: 'स्क्रीनशॉट का संयुक्त विश्लेषण',
    fourSolutionsHeading: 'संयुक्त प्रमाणों पर आधारित 4 सटीक समाधान',
    solutionNumberLabel: 'समाधान',
    stepsTitle: 'चरण-दर-चरण निर्देश',
    stepCompleted: 'पूर्ण हुआ',
    stepPending: 'पूर्ण चिह्नित करें',
    caution: 'सावधानी नोट',
    preventionTitle: 'भविष्य में इस एरर से बचने के उपाय',
    alternativeTitle: 'वैकल्पिक समाधान (यदि पहला तरीका काम न करे)',
    techDetailsTitle: 'तकनीकी विवरण',
    copySolution: 'पूरा समाधान कॉपी करें',
    copyAnswer: 'उत्तर कॉपी करें',
    tryAgain: 'पुनः प्रयास करें',
    solutionCopied: 'कॉपी हो गया!',
    downloadSolution: 'समाधान डाउनलोड करें (.txt)',
    downloadStarted: 'डाउनलोड शुरू हुआ!',
    uploadAnother: 'अन्य स्क्रीनशॉट जाँचें',
    chatHeading: 'AI फॉलो-अप सहायक',
    chatSubtitle: 'क्या आपको इन स्क्रीनशॉट को लेकर कोई प्रश्न या संदेह है? नीचे पूछें।',
    chatPlaceholder: 'इन स्क्रीनशॉट के बारे में कोई भी प्रश्न पूछें...',
    chatSend: 'भेजें',
    chatThinking: 'उत्तर तैयार किया जा रहा है...',
    clearChat: 'चैट साफ करें',
    chatCleared: 'चैट का इतिहास साफ कर दिया गया।',
    chatSuggestedPrompt1: 'इन 4 समाधानों में से मुझे सबसे पहले कौन सा करना चाहिए?',
    chatSuggestedPrompt2: 'क्या इससे मेरा व्यक्तिगत डेटा डिलीट हो जाएगा?',
    chatSuggestedPrompt3: 'अगर सभी समाधान काम न करें तो क्या करूँ?',
    noApiKeyError: 'सर्वर पर API की (Key) उपलब्ध नहीं है।',
    generalError: 'स्क्रीनशॉट का विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।',
    retryButton: 'पुनः प्रयास करें',
    loadingStage1: 'स्क्रीनशॉट अपलोड किए जा रहे हैं',
    loadingStage2: 'इमेजेस प्रोसेस की जा रही हैं',
    loadingStage3: 'समस्याओं की पहचान की जा रही है',
    loadingStage4: 'समाधान तैयार किए जा रहे हैं',
    loadingStage5: 'परिणाम तैयार किए जा रहे हैं',
    recommendedBadge: 'अनुशंसित प्राथमिक समाधान',
    expandAll: 'सभी खोलें',
    collapseAll: 'सभी बंद करें',
    footerRights: 'SnapSolve AI • मल्टी-स्क्रीनशॉट Gemini Vision AI द्वारा संचालित लाइव समाधान',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
  },
};
