# 🎤 Paytm Zubaan — Hackathon Submission

> **Paytm AI Hackathon 2026 | Team: doublexp | Subroto Datta**

---

## 📎 Submission Assets

| Asset | Link |
|-------|------|
| 📊 Pitch Deck | [Paytm_Zubaan_v2.pptx](https://drive.google.com/drive/folders/19g3macVP8kNCLPztpztzjT8V9mVr09TC) |
| 📄 Solution Document | [Solution Doc](https://drive.google.com/drive/folders/19g3macVP8kNCLPztpztzjT8V9mVr09TC) |
| 💻 Source Code | [This Repository](https://github.com/Subroto-Datta/doublexp-paytm-hackathon-submission) |

---

## 💡 The Problem

India's informal workforce — plumbers, carpenters, electricians, repair technicians — operates on verbal agreements. There is no paper trail, no payment protection, no recourse when a job goes unpaid or a client disappears. **₹18 lakh crore** of informal economy transactions happen on trust alone.

---

## 🚀 The Solution — Paytm Zubaan

> **"अपनी ज़ुबान दें"** — *Give your word. We'll make it binding.*

**Zubaan** (meaning "word" / "voice" in Hindi) is a voice-first contract and payment feature built inside the Paytm app. It lets any worker formalize a deal in **60 seconds**, in **their own language**, without literacy or paperwork.

### How it works

```
Speak your deal  →  AI extracts contract  →  Review & sign  →  Lock advance in escrow
```

1. **🎤 Record** — Worker speaks the deal terms naturally in Hindi, Telugu, Tamil, Punjabi, Bengali, or English
2. **🧠 AI Extraction** — Sarvam AI (STT + LLM) transcribes speech and extracts structured contract fields
3. **✏️ Review** — Both parties confirm all terms on screen; both must tap to confirm
4. **🔒 Pay & Lock** — Advance is paid via UPI and held in **Commitment Vault** (escrow)
5. **📄 Proof** — A downloadable PDF contract + WhatsApp-shareable receipt is generated

---

## ✨ Key Features

### 🏠 Paytm Super-App Shell
The app is presented as a complete Paytm home screen mockup with:
- Wallet balance card (show/hide toggle)
- Quick Actions grid (Recharge, Electricity, Send Money, Bank Transfer, Tickets, Mutual Funds)
- Offers banner carousel
- Bottom navigation (Home, Pay, History, Offers, Profile)

### 🎤 Zubaan Voice Contract Flow

| Stage | Description |
|-------|-------------|
| **Idle** | Enter party names, tap the mic to begin |
| **Recording** | Live timer + animated waveform; tap stop when done |
| **Processing** | Sarvam AI STT + LLM extraction with animated skeleton |
| **Review** | Editable fields; **dual-confirm** (both parties tap) |
| **Payment** | Advance secured via simulated UPI |
| **Success** | Transaction receipt, PDF download, WhatsApp share |

### 🔒 Commitment Vault
Advance funds are held in escrow and released **only when both parties confirm** job completion.

### 📄 PDF Contract
A formatted, timestamped Zubaan Record PDF is downloadable and shareable as proof of agreement.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + inline CSS-in-JS |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| PDF Generation | `html2canvas` + `jsPDF` |
| Speech-to-Text | [Sarvam AI](https://www.sarvam.ai/) — `saaras:v3` |
| LLM Extraction | [Sarvam AI](https://www.sarvam.ai/) — `sarvam-30b` |

---

## 🌐 Supported Languages

हिंदी · English · తెలుగు · தமிழ் · ਪੰਜਾਬੀ · বাংলা · and more via Sarvam AI

---

## 📁 Project Structure

```
paytm-zubaan/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home page (Paytm super-app shell)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles & animations
│   │   ├── zubaan/
│   │   │   └── page.tsx              # Full voice-contract flow (6 stages)
│   │   ├── api/
│   │   │   └── extract/
│   │   │       └── route.ts          # POST /api/extract (Sarvam STT + LLM)
│   │   └── components/
│   │       ├── ZubaanCard.tsx        # Hero entry card on home feed
│   │       ├── QuickActions.tsx      # 8-icon quick action grid
│   │       ├── BannerCarousel.tsx    # Offers banner scroller
│   │       ├── BottomNav.tsx         # Tab bar navigation
│   │       ├── TopHeader.tsx         # App header
│   │       ├── ZubaanRecordPDF.tsx   # Hidden DOM rendered to PDF
│   │       └── ...                   # Other tab and UI components
│   └── lib/
│       └── generatePDF.ts            # PDF export utility
├── .env.local                        # API keys (not committed)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Sarvam AI](https://www.sarvam.ai/) API key

### 1. Clone & Install

```bash
git clone https://github.com/Subroto-Datta/doublexp-paytm-hackathon-submission.git
cd doublexp-paytm-hackathon-submission
npm install
```

### 2. Configure Environment

```bash
# Create .env.local
SARVAM_API_KEY=your_sarvam_api_key_here

# Optional: use hardcoded demo data instead of real STT/LLM
DEMO_MODE=false
```

### 3. Run

```bash
npm run dev
# Open http://localhost:3000
```

> **Demo mode:** Tap the Paytm logo 5 times on the Zubaan screen to toggle demo mode (bypasses real STT/LLM for quick testing).

---

## 🔌 API Reference

### `POST /api/extract`

| Field | Type | Description |
|-------|------|-------------|
| `audio` | `File` (webm) | Recorded audio blob |
| `contractor_name` | `string` | Worker's name |
| `customer_name` | `string` | Customer's name |

**Query:** `?demo=true` — use hardcoded transcript instead of real STT

**Response:**
```json
{
  "success": true,
  "data": {
    "service_description": "AC repair",
    "contractor_name": "Ramesh Kumar",
    "customer_name": "Suresh Sharma",
    "advance_amount": 1000,
    "total_amount": 3000,
    "completion_date": "2026-06-08",
    "special_conditions": "Work within 2 days"
  }
}
```

---

## 👤 About

**Subroto Datta** — Team doublexp  
Submission for the **Paytm AI Hackathon 2026**

📂 [All Submission Assets](https://drive.google.com/drive/folders/19g3macVP8kNCLPztpztzjT8V9mVr09TC)

---

*Built with ❤️ for India's informal workforce*
