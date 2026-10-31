import { SampleError } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export const sampleErrors: SampleError[] = [
  {
    id: 'banking-upi-u16',
    title: 'UPI Payment Failed (Bank Server Busy / Code U16)',
    titleUrdu: 'یو پی آئی ادائیگی کی ناکامی (بینک سرور مصروف / کوڈ U16)',
    titleHindi: 'UPI पेमेंट फेल (बैंक सर्वर एरर / कोड U16)',
    category: 'Banking & Finance',
    description: 'Payment timed out on UPI app (PhonePe/Google Pay/Paytm) with bank server communication failure.',
    contextNote: 'Trying to transfer ₹1,500 to vendor via Google Pay, transaction failed after entering UPI PIN.',
    thumbnailSvg: createSvgDataUrl(`
      <svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#0f172a" rx="16"/>
        <rect x="20" y="20" width="440" height="280" fill="#1e293b" rx="12" stroke="#334155" stroke-width="2"/>
        <circle cx="240" cy="85" r="32" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="3"/>
        <path d="M228 73L252 97M252 73L228 97" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
        <text x="240" y="145" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="20" text-anchor="middle">Payment Failed</text>
        <text x="240" y="172" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Bank server did not respond in time</text>
        <text x="240" y="195" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Amount: ₹1,500.00 • No money was deducted</text>
        <rect x="70" y="215" width="340" height="34" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="240" y="237" fill="#f87171" font-family="monospace" font-size="12" font-weight="600" text-anchor="middle">Error Code: UPI_ERR_U16_REMITTER_BANK_UNAVAILABLE</text>
        <rect x="160" y="260" width="160" height="28" rx="6" fill="#ef4444"/>
        <text x="240" y="278" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Retry Payment</text>
      </svg>
    `),
    dataUrl: createSvgDataUrl(`
      <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="#090d16"/>
        <rect x="40" y="30" width="520" height="440" fill="#111827" rx="16" stroke="#1f2937" stroke-width="2"/>
        <circle cx="300" cy="110" r="44" fill="#dc2626" fill-opacity="0.1" stroke="#ef4444" stroke-width="4"/>
        <path d="M284 94L316 126M316 94L284 126" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
        <text x="300" y="185" fill="#f9fafb" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" text-anchor="middle">Payment Failed</text>
        <text x="300" y="216" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="15" text-anchor="middle">Your bank's UPI server is currently unreachable</text>
        <rect x="70" y="240" width="460" height="90" rx="10" fill="#1f2937" stroke="#374151" stroke-width="1"/>
        <text x="95" y="270" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Transaction ID: UPI/2026/08392189401</text>
        <text x="95" y="295" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="13">Status: Expired / Timed out after 60s</text>
        <text x="95" y="318" fill="#f87171" font-family="monospace" font-size="13" font-weight="700">Error Code: U16 - Remitter Bank Down or Rate Limited</text>
        <text x="300" y="360" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Note: If money is debited, it will auto-reverse within 2 business days.</text>
        <rect x="190" y="390" width="220" height="42" rx="8" fill="#2563eb"/>
        <text x="300" y="416" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle">Done / Back to Home</text>
      </svg>
    `),
  },
  {
    id: 'mobile-playstore-910',
    title: 'Google Play Error 910 (Can\'t Install App)',
    titleUrdu: 'گوگل پلے اسٹور ایرر 910 (ایپ انسٹال نہیں ہو رہی)',
    titleHindi: 'Google Play Store एरर 910 (ऐप इनस्टॉल नहीं हो पा रहा)',
    category: 'Mobile App',
    description: 'Android package manager failed to install or update the app due to corrupted cache or leftover package files.',
    contextNote: 'Trying to update WhatsApp on Android phone, Play Store downloaded 100% then failed.',
    thumbnailSvg: createSvgDataUrl(`
      <svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#ffffff" rx="16"/>
        <rect x="25" y="25" width="430" height="270" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="45" y="45" width="40" height="40" rx="8" fill="#059669"/>
        <text x="95" y="65" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Google Play Store</text>
        <text x="95" y="80" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Downloading update...</text>
        <rect x="45" y="110" width="390" height="120" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="1.5"/>
        <text x="65" y="140" fill="#991b1b" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Can't install WhatsApp Messenger</text>
        <text x="65" y="165" fill="#7f1d1d" font-family="system-ui, sans-serif" font-size="12">Try again, and if it still doesn't work,</text>
        <text x="65" y="185" fill="#7f1d1d" font-family="system-ui, sans-serif" font-size="12">see common ways to fix the problem.</text>
        <text x="65" y="215" fill="#b91c1c" font-family="monospace" font-size="12" font-weight="700">(Error code: 910)</text>
        <rect x="300" y="245" width="135" height="32" rx="6" fill="#0284c7"/>
        <text x="367" y="265" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Try again</text>
      </svg>
    `),
    dataUrl: createSvgDataUrl(`
      <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="#f8fafc"/>
        <rect x="30" y="30" width="540" height="440" fill="#ffffff" rx="16" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="80" cy="80" r="28" fill="#10b981"/>
        <path d="M68 80L76 88L92 72" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="125" y="75" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="700" font-size="18">WhatsApp Messenger</text>
        <text x="125" y="95" fill="#64748b" font-family="system-ui, sans-serif" font-size="13">Meta Platforms, Inc. • 42 MB</text>
        <rect x="50" y="140" width="500" height="190" rx="12" fill="#fff1f2" stroke="#fecdd3" stroke-width="1.5"/>
        <circle cx="85" cy="180" r="18" fill="#f43f5e"/>
        <text x="85" y="186" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="16" text-anchor="middle">!</text>
        <text x="115" y="185" fill="#881337" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Can't install WhatsApp Messenger</text>
        <text x="115" y="215" fill="#9f1239" font-family="system-ui, sans-serif" font-size="14">Try again, and if it still doesn't work, see common ways to fix the problem.</text>
        <text x="115" y="240" fill="#be123c" font-family="monospace" font-weight="700" font-size="14">Package error: INSTALL_FAILED_INVALID_APK (Error code: 910)</text>
        <text x="115" y="270" fill="#475569" font-family="system-ui, sans-serif" font-size="13">Google Play Services &amp; Package Installer version 24.12.14</text>
        <rect x="360" y="360" width="180" height="44" rx="8" fill="#0284c7"/>
        <text x="450" y="388" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="600" font-size="15" text-anchor="middle">Try Again</text>
        <rect x="180" y="360" width="160" height="44" rx="8" fill="#e2e8f0"/>
        <text x="260" y="388" fill="#334155" font-family="system-ui, sans-serif" font-weight="600" font-size="14" text-anchor="middle">Send Feedback</text>
      </svg>
    `),
  },
  {
    id: 'code-react-undefined',
    title: 'React Uncaught TypeError (Cannot read properties of undefined)',
    titleUrdu: 'ری ایکٹ ٹائپ ایرر (Cannot read properties of undefined reading map)',
    titleHindi: 'React टाइप एरर (Cannot read properties of undefined reading map)',
    category: 'Software & Code',
    description: 'Frontend JavaScript runtime crash when attempting to .map() over an undefined or null state array.',
    contextNote: 'Building an e-commerce catalog page in React 19, crashed when page loaded.',
    thumbnailSvg: createSvgDataUrl(`
      <svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#0f172a" rx="16"/>
        <rect x="20" y="20" width="440" height="280" fill="#18181b" rx="12" stroke="#27272a" stroke-width="2"/>
        <circle cx="45" cy="45" r="6" fill="#ef4444"/>
        <circle cx="65" cy="45" r="6" fill="#f59e0b"/>
        <circle cx="85" cy="45" r="6" fill="#10b981"/>
        <text x="240" y="48" fill="#71717a" font-family="monospace" font-size="12" text-anchor="middle">Chrome DevTools - Console</text>
        <rect x="30" y="70" width="420" height="180" rx="8" fill="#450a0a" fill-opacity="0.4" stroke="#991b1b" stroke-width="1"/>
        <text x="45" y="100" fill="#f87171" font-family="monospace" font-weight="700" font-size="13">Uncaught TypeError: Cannot read properties of</text>
        <text x="45" y="122" fill="#f87171" font-family="monospace" font-weight="700" font-size="13">undefined (reading 'map')</text>
        <text x="45" y="152" fill="#fda4af" font-family="monospace" font-size="11">    at ProductGrid (ProductGrid.tsx:28:22)</text>
        <text x="45" y="172" fill="#fda4af" font-family="monospace" font-size="11">    at renderWithHooks (react-dom.js:16305)</text>
        <text x="45" y="192" fill="#fda4af" font-family="monospace" font-size="11">    at updateFunctionComponent (react-dom.js:19588)</text>
        <rect x="30" y="260" width="220" height="26" rx="4" fill="#27272a"/>
        <text x="45" y="277" fill="#a1a1aa" font-family="monospace" font-size="11">Source: items.map(item =&gt; ...)</text>
      </svg>
    `),
    dataUrl: createSvgDataUrl(`
      <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="#121316"/>
        <rect x="25" y="25" width="550" height="450" fill="#1c1d22" rx="14" stroke="#2a2c33" stroke-width="2"/>
        <circle cx="50" cy="50" r="6" fill="#f43f5e"/>
        <circle cx="70" cy="50" r="6" fill="#f59e0b"/>
        <circle cx="90" cy="50" r="6" fill="#10b981"/>
        <text x="300" y="55" fill="#9ca3af" font-family="monospace" font-size="13" text-anchor="middle">Console / Runtime Error</text>
        <rect x="40" y="80" width="520" height="240" rx="8" fill="#3f0f15" fill-opacity="0.6" stroke="#9f1239" stroke-width="1.5"/>
        <text x="60" y="115" fill="#fca5a5" font-family="monospace" font-weight="700" font-size="15">Uncaught TypeError: Cannot read properties of undefined (reading 'map')</text>
        <text x="60" y="150" fill="#fda4af" font-family="monospace" font-size="13">  at ProductList (src/components/ProductList.tsx:32:17)</text>
        <text x="60" y="175" fill="#fda4af" font-family="monospace" font-size="13">  at commitHookEffectListMount (react-dom.development.js:23150)</text>
        <text x="60" y="200" fill="#fda4af" font-family="monospace" font-size="13">  at commitPassiveMountEffects (react-dom.development.js:23216)</text>
        <text x="60" y="235" fill="#fecdd3" font-family="monospace" font-size="13">The above error occurred in the &lt;ProductList&gt; component:</text>
        <text x="80" y="265" fill="#fed7aa" font-family="monospace" font-size="12">31 | return (</text>
        <text x="80" y="285" fill="#f87171" font-family="monospace" font-size="12" font-weight="700">&gt; 32 |   {products.map((p) =&gt; &lt;ProductCard key={p.id} item={p} /&gt;)}</text>
        <rect x="40" y="340" width="520" height="110" rx="8" fill="#111827" stroke="#374151" stroke-width="1"/>
        <text x="60" y="375" fill="#e5e7eb" font-family="system-ui, sans-serif" font-weight="600" font-size="14">Detected Framework: React 19 / Next.js / TypeScript</text>
        <text x="60" y="405" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="13">Initial state of products is likely undefined prior to API fetch resolution.</text>
      </svg>
    `),
  },
  {
    id: 'web-502-gateway',
    title: '502 Bad Gateway (Server Origin Unreachable)',
    titleUrdu: 'ویب سائٹ ایرر 502 بیڈ گیٹ وے (سرور جواب نہیں دے رہا)',
    titleHindi: 'वेबसाइट 502 Bad Gateway एरर (होस्ट सर्वर अनुपलब्ध)',
    category: 'Web & Cloud',
    description: 'Cloudflare / Reverse proxy cannot connect to upstream application server (Node/Express/Django/Nginx).',
    contextNote: 'Customer website showing 502 Bad Gateway during high traffic campaign.',
    thumbnailSvg: createSvgDataUrl(`
      <svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#f8fafc" rx="16"/>
        <rect x="25" y="25" width="430" height="270" fill="#ffffff" rx="12" stroke="#e2e8f0" stroke-width="2"/>
        <text x="240" y="110" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="800" font-size="36" text-anchor="middle">502</text>
        <text x="240" y="145" fill="#ef4444" font-family="system-ui, sans-serif" font-weight="700" font-size="20" text-anchor="middle">Bad Gateway</text>
        <rect x="80" y="170" width="320" height="1" fill="#cbd5e1"/>
        <text x="240" y="200" fill="#475569" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">The web server reported a bad gateway error.</text>
        <text x="240" y="225" fill="#64748b" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Cloudflare Ray ID: 894109fa81bc • Host Error</text>
        <text x="240" y="260" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">nginx/1.24.0 (Ubuntu)</text>
      </svg>
    `),
    dataUrl: createSvgDataUrl(`
      <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="#ffffff"/>
        <rect x="30" y="30" width="540" height="440" fill="#fafafa" rx="14" stroke="#e5e5e5" stroke-width="2"/>
        <text x="300" y="120" fill="#111827" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" text-anchor="middle">502 Bad Gateway</text>
        <rect x="150" y="145" width="300" height="2" fill="#e5e7eb"/>
        <text x="300" y="185" fill="#dc2626" font-family="system-ui, sans-serif" font-weight="700" font-size="18" text-anchor="middle">Host Error • Origin Web Server is Down</text>
        <rect x="60" y="220" width="480" height="120" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <text x="85" y="255" fill="#1e293b" font-family="system-ui, sans-serif" font-weight="600" font-size="14">What happened?</text>
        <text x="85" y="280" fill="#475569" font-family="system-ui, sans-serif" font-size="13">The proxy server reached out to the upstream origin IP, but connection was refused</text>
        <text x="85" y="302" fill="#475569" font-family="system-ui, sans-serif" font-size="13">on port 443 / 8080 (ECONNREFUSED / timeout).</text>
        <text x="300" y="380" fill="#64748b" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">nginx/1.24.0 (Ubuntu Linux) • Cloudflare CDN Edge</text>
      </svg>
    `),
  },
  {
    id: 'os-windows-bsod',
    title: 'Windows Blue Screen (Stop Code: CRITICAL_PROCESS_DIED)',
    titleUrdu: 'ونڈوز بلیو اسکرین آف ڈیتھ (CRITICAL_PROCESS_DIED)',
    titleHindi: 'Windows ब्लू स्क्रीन एरर (CRITICAL_PROCESS_DIED)',
    category: 'Operating System & Hardware',
    description: 'Windows operating system crashed due to a critical system service or driver failure.',
    contextNote: 'Laptop froze and displayed blue screen during video rendering.',
    thumbnailSvg: createSvgDataUrl(`
      <svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#0078d7" rx="16"/>
        <text x="50" y="110" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="300" font-size="64">:(</text>
        <text x="50" y="160" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="400" font-size="18">Your PC ran into a problem and needs to restart.</text>
        <text x="50" y="185" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="400" font-size="14">We're just collecting some error info, and then we'll restart for you.</text>
        <text x="50" y="225" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="600" font-size="13">0% complete</text>
        <rect x="50" y="245" width="55" height="55" fill="#ffffff" rx="4"/>
        <rect x="57" y="252" width="18" height="18" fill="#0078d7"/>
        <rect x="80" y="252" width="18" height="18" fill="#0078d7"/>
        <rect x="57" y="275" width="18" height="18" fill="#0078d7"/>
        <rect x="80" y="275" width="18" height="18" fill="#0078d7"/>
        <text x="120" y="265" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="11">Stop code: CRITICAL_PROCESS_DIED</text>
        <text x="120" y="285" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="11">What failed: ntoskrnl.exe</text>
      </svg>
    `),
    dataUrl: createSvgDataUrl(`
      <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="#0078d7"/>
        <text x="50" y="130" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="300" font-size="90">:(</text>
        <text x="50" y="200" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="400" font-size="24">Your PC ran into a problem and needs to restart.</text>
        <text x="50" y="235" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="300" font-size="18">We're just collecting some error info, and then we'll restart for you.</text>
        <text x="50" y="290" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="600" font-size="18">20% complete</text>
        <rect x="50" y="325" width="70" height="70" fill="#ffffff" rx="6"/>
        <rect x="59" y="334" width="22" height="22" fill="#0078d7"/>
        <rect x="90" y="334" width="22" height="22" fill="#0078d7"/>
        <rect x="59" y="365" width="22" height="22" fill="#0078d7"/>
        <rect x="90" y="365" width="22" height="22" fill="#0078d7"/>
        <text x="140" y="350" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="15">For more information about this issue and possible fixes, visit:</text>
        <text x="140" y="375" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="600" font-size="15">Stop code: CRITICAL_PROCESS_DIED</text>
        <text x="140" y="400" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="14">What failed: ntoskrnl.exe</text>
      </svg>
    `),
  },
];
