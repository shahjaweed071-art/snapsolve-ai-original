# SnapSolve AI – Hostinger Web Apps Deployment Guide

This production package is prepared and optimized specifically for deployment on **Hostinger Web Apps / Node.js Application Manager** or Hostinger Cloud/VPS.

---

## 📁 Package Structure

```text
├── dist/                  # Pre-compiled high-performance React + Tailwind frontend assets
│   ├── assets/            # Bundled CSS, JS, fonts, and icons
│   └── index.html         # Main SPA entry point
├── server.js              # Standalone Node.js production server (Express + Gemini AI Vision)
├── package.json           # Production-only dependencies (Express, Dotenv, Google GenAI)
├── .env.example           # Environment variables template
├── .htaccess              # Hostinger LiteSpeed/Apache routing configuration
└── README.md              # This setup guide
```

---

## 🚀 Quick Deployment in 5 Steps (Hostinger hPanel)

### Step 1: Upload and Extract Files
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** → Select your domain → Click **Manage**.
3. Open **File Manager** (under Files).
4. Navigate to your application root (typically `public_html` or the folder chosen for your web app).
5. Upload `snapsolve-hostinger-production.zip`.
6. Right-click the uploaded zip file and click **Extract**. Extract all files into your folder.

### Step 2: Open Node.js Application Manager
1. In Hostinger hPanel, search for or click **Node.js** (under the **Advanced** or **Web Apps** section).
2. Click **Create Application** (or select your existing domain).
3. Configure the settings:
   - **Node.js Version**: Select `20.x` or `18.x` (Recommended: `20.x`).
   - **Application Mode**: `Production`
   - **Application Root**: e.g., `/domains/yourdomain.com/public_html` (or your chosen subfolder).
   - **Application Startup File**: `server.js`

### Step 3: Install Production Dependencies
1. In the Node.js application dashboard in hPanel, look for the **NPM** section.
2. Click **Run NPM Install** (or open the Hostinger SSH Terminal in that folder and run `npm install --omit=dev`).
   > *Note: This will install only 3 lightweight packages (`express`, `@google/genai`, `dotenv`) in under 20 seconds.*

### Step 4: Configure Environment Variables
1. In the Hostinger Node.js manager, scroll to **Environment Variables** (or create a `.env` file in the folder by copying `.env.example`).
2. Add the following environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key (Get one free at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
3. Optional variables:
   - **Key**: `PORT` → `3000` (Hostinger usually routes to standard port or assigns automatically).
   - **Key**: `NODE_ENV` → `production`

### Step 5: Start or Restart Application
1. Click **Start** or **Restart Application** in Hostinger hPanel.
2. Visit your domain: `https://yourdomain.com`.
3. Test the health endpoint: `https://yourdomain.com/api/health`.
   - It should return:
     ```json
     {
       "status": "ok",
       "environment": "production",
       "hasApiKey": true
     }
     ```

---

## 🛠️ Alternative: Deploy via SSH / Hostinger VPS (PM2)

If you are using Hostinger VPS or prefer running via terminal with PM2:

1. Connect to your server via SSH:
   ```bash
   ssh u123456789@your-server-ip
   ```
2. Navigate to your website folder:
   ```bash
   cd ~/domains/yourdomain.com/public_html
   ```
3. Install dependencies:
   ```bash
   npm install --omit=dev
   ```
4. Create `.env` file:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Add your `GEMINI_API_KEY="AIzaSy..."` and save (`Ctrl+O`, `Enter`, `Ctrl+X`).
5. Start with PM2:
   ```bash
   pm2 start server.js --name "snapsolve-ai"
   pm2 save
   pm2 startup
   ```

---

## 🔍 Verification Checklist

- [x] Pre-compiled frontend in `dist/` (no Vite or Tailwind builds needed on Hostinger).
- [x] Zero devDependencies (prevents Hostinger out-of-memory errors).
- [x] Multi-screenshot analysis up to 4 images enabled.
- [x] Follow-up AI chat enabled.
- [x] Multilingual support (English, Urdu RTL, Hindi).
- [x] Security: Gemini API Key is stored safely on the server and never exposed to client browsers.

---

## ❓ Frequently Asked Questions & Troubleshooting

**Q: Why doesn't the app need `npm run build` on Hostinger?**
A: Hostinger shared and cloud hosting have limited RAM and strict execution timeouts. We pre-compiled all React, TypeScript, and Tailwind assets into `dist/`. The server serves these static assets instantly.

**Q: I see "GEMINI_API_KEY is not configured" error.**
A: Ensure you added `GEMINI_API_KEY` in Hostinger hPanel under Environment Variables or created a `.env` file in the application root with `GEMINI_API_KEY=your_key`.

**Q: How do I test if my server is running?**
A: Go to `https://yourdomain.com/api/health` in your browser. If it returns `{"status":"ok"}`, your Node.js server is running smoothly!
