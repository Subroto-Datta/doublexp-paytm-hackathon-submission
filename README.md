# 🎤 Paytm Zubaan

> **Voice-Bound Business Contracts — Speak your deal. Lock the payment. Get proof — in your language.**

Paytm Zubaan is a mobile-first feature built on top of a Paytm super-app UI that lets informal sector workers (contractors, plumbers, carpenters, etc.) create legally-traceable business contracts by simply **speaking** their deal terms — in Hindi, English, Telugu, Tamil, Punjabi, Bengali, and more.

---

## ✨ Features

### 🏠 Home (Super-App Shell)
- **Wallet Balance Card** — shows live balance with a show/hide toggle
- **Quick Actions** — Mobile Recharge, Electricity Bill, Send Money, Bank Transfer, Movie & Train Tickets, Mutual Funds
- **Banner Carousel** — promotional offers scroller
- **Zubaan Hero Card** — entry point to the voice-contract feature
- **Recommended Offers & Recent Transactions** — contextual feed content
- **Bottom Navigation** — Home, Pay, History, Offers, Profile tabs

### 🎤 Zubaan — Voice Contract Flow

A guided, stage-based flow with smooth Framer Motion animations:

| Stage | Description |
|-------|-------------|
| **Idle** | Enter contractor & customer names, tap the mic to begin |
| **Recording** | Live timer + animated waveform; tap stop when done |
| **Processing** | Audio sent to Sarvam AI STT → LLM extraction; animated skeleton loader |
| **Review** | Editable contract fields; dual-confirm (contractor + customer must both tap) |
| **Payment** | Commitment Vault UPI payment screen with advance amount |
| **Success** | Transaction receipt, PDF download, WhatsApp share |

### 🔒 Commitment Vault
Advance payment is held in escrow and released only when **both parties** confirm job completion — protecting both the worker and the customer.

### 📄 PDF Export
Download a formatted Zubaan Record PDF (`html2canvas` + `jsPDF`) with the full contract details and transaction proof.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + inline CSS-in-JS |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| PDF Generation | `html2canvas` + `jsPDF` |
| Speech-to-Text | [Sarvam AI](https://www.sarvam.ai/) — `saaras:v2` model |
| LLM Extraction | Sarvam AI — `sarvam-2b` model |
| Languages Supported | Hindi, English, Telugu, Tamil, Punjabi, Bengali + more |

---

## 📁 Project Structure

```
paytm-zubaan/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home page (super-app shell)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles & keyframe animations
│   │   ├── zubaan/
│   │   │   └── page.tsx              # Full Zubaan voice-contract flow
│   │   ├── api/
│   │   │   └── extract/
│   │   │       └── route.ts          # POST /api/extract (STT + LLM)
│   │   └── components/
│   │       ├── ZubaanCard.tsx        # Hero entry card on home feed
│   │       ├── QuickActions.tsx      # 8-icon quick action grid
│   │       ├── BannerCarousel.tsx    # Offers banner scroller
│   │       ├── BottomNav.tsx         # Tab bar navigation
│   │       ├── TopHeader.tsx         # App header with notifications/search
│   │       ├── GreetingStrip.tsx     # Personalised greeting
│   │       ├── RecentTransactions.tsx
│   │       ├── RecommendedOffers.tsx
│   │       ├── ZubaanRecordPDF.tsx   # Hidden DOM node rendered to PDF
│   │       ├── ProgressBar.tsx       # Animated progress indicator
│   │       ├── ErrorBoundary.tsx     # React error boundary wrapper
│   │       ├── PayTab.tsx            # Pay tab content
│   │       ├── HistoryTab.tsx        # Transaction history tab
│   │       ├── OffersTab.tsx         # Offers tab
│   │       ├── ProfileTab.tsx        # Profile tab
│   │       └── StubScreen.tsx        # Placeholder screens
│   └── lib/
│       └── generatePDF.ts            # PDF generation utility
├── .env.local                        # Environment variables (not committed)
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Sarvam AI](https://www.sarvam.ai/) API key

### 1. Clone & Install

```bash
git clone <repo-url>
cd paytm-zubaan
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
SARVAM_API_KEY=your_sarvam_api_key_here

# Optional: set to "true" to bypass the real STT/LLM and use hardcoded demo data
DEMO_MODE=false
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference

### `POST /api/extract`

Processes a voice recording and returns structured contract data.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `demo` | `boolean` | If `true`, skips real STT/LLM and returns hardcoded demo contract |

**Form Data**

| Field | Type | Description |
|-------|------|-------------|
| `audio` | `File` (webm/mp4) | The recorded audio blob |
| `contractor_name` | `string` | Pre-filled contractor name (overrides LLM extraction) |
| `customer_name` | `string` | Pre-filled customer name (overrides LLM extraction) |

**Response**

```json
{
  "success": true,
  "data": {
    "service_description": "Fridge repair service",
    "contractor_name": "Ramesh Kumar",
    "customer_name": "Suresh Sharma",
    "advance_amount": 500,
    "total_amount": 2000,
    "completion_date": "2026-06-07",
    "special_conditions": "Work to be completed within 24 hours"
  }
}
```

> **Fallback behaviour:** If STT or LLM extraction fails for any reason, the API returns a graceful fallback contract (HTTP 200) so the user flow is never broken.

---

## 🧩 Key Components

### `ZubaanCard`
The home-screen entry card. Displays key stats (contract range, time-to-contract, supported languages) and navigates to `/zubaan` on tap.

### `QuickActions`
An 8-icon 4-column grid (Mobile Recharge, Electricity, Send Money, Bank Transfer, Movie Tickets, Train Tickets, Mutual Funds, See All) with press-scale micro-animations.

### `ZubaanRecordPDF`
A hidden, off-screen React component that represents the final contract document. `html2canvas` captures it as a canvas, then `jsPDF` exports it as a downloadable PDF.

### `/zubaan/page.tsx`
The core voice-contract flow. Manages the `Stage` state machine (`idle → recording → processing → review → payment → success`) with Framer Motion `AnimatePresence` transitions between stages.

---

## 🌐 Supported Languages

| Language | Script |
|----------|--------|
| Hindi | हिंदी |
| English | English |
| Telugu | తెలుగు |
| Tamil | தமிழ் |
| Punjabi | ਪੰਜਾਬੀ |
| Bengali | বাংলা |
| + more via Sarvam AI | — |

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔐 Security & Trust

- Payments are protected by **Commitment Vault** escrow
- Dual-confirmation required from both contractor and customer
- PDF contract serves as a tamper-evident, timestamped record
- Built on Paytm's RBI-regulated, NPCI-member infrastructure

---

## 📄 License

Private — © Paytm. All rights reserved.
