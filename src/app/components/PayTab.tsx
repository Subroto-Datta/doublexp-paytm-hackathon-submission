"use client";

import { useState } from "react";

const UPI_CONTACTS = [
  { name: "Rahul Sharma", upi: "rahul@okaxis", emoji: "👨", amount: "₹500", recent: true },
  { name: "Priya Mehta", upi: "priya@paytm", emoji: "👩", amount: "₹1,000", recent: true },
  { name: "Arjun Singh", upi: "arjun@ybl", emoji: "🧑", amount: "₹250", recent: false },
];

function QRFrame() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Corner brackets */}
      {[
        "top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl",
        "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl",
        "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl",
        "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 ${cls}`} style={{ borderColor: "#00BAF2" }} />
      ))}

      {/* Dummy QR inner */}
      <div className="absolute inset-3 rounded-xl overflow-hidden bg-white flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 100 100">
          {/* QR-like pattern */}
          {[
            [0,0,28,28], [36,0,28,28], [72,0,28,28],
            [0,36,28,28], [0,72,28,28], [36,72,28,28], [72,72,28,28],
          ].map(([x,y,w,h],i) => (
            <rect key={i} x={x+4} y={y+4} width={w-8} height={h-8} rx="4" fill="#1A1A2E" />
          ))}
          {[
            [8,8,12,12],[40,8,12,12],[76,8,12,12],
            [8,40,12,12],[8,76,12,12],[40,76,12,12],[76,76,12,12],
          ].map(([x,y,w,h],i) => (
            <rect key={`inner-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="white" />
          ))}
          {/* Random dots */}
          {[36,42,44,50,56,60,66,68,72,76,80,84,44,56,68,80].map((x,i) => (
            <rect key={`dot-${i}`} x={x} y={36 + (i % 5) * 8} width="4" height="4" rx="1" fill="#1A1A2E" />
          ))}
          {/* Center logo */}
          <rect x="38" y="38" width="24" height="24" rx="4" fill="#00BAF2" />
          <text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">P</text>
        </svg>
      </div>

      {/* Scan line animation */}
      <div
        className="absolute left-3 right-3"
        style={{
          height: 2,
          background: "linear-gradient(90deg,transparent,#00BAF2,transparent)",
          animation: "scanLine 2s ease-in-out infinite",
          top: "50%",
        }}
      />
    </div>
  );
}

export default function PayTab() {
  const [amount, setAmount] = useState("");
  const [activeMode, setActiveMode] = useState<"scan" | "send">("scan");

  return (
    <div className="flex-1 overflow-y-auto main-scroll" style={{ background: "#F4F6FA" }}>
      {/* Mode toggle */}
      <div className="flex gap-1 mx-4 mt-4 mb-4 p-1 rounded-2xl bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        {(["scan", "send"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: activeMode === mode ? "#00BAF2" : "transparent",
              color: activeMode === mode ? "#fff" : "#6B7280",
            }}
          >
            {mode === "scan" ? "📷  Scan QR" : "↑  Send Money"}
          </button>
        ))}
      </div>

      {activeMode === "scan" ? (
        <div className="px-4">
          {/* Scanner viewfinder */}
          <div
            className="rounded-3xl overflow-hidden mb-4"
            style={{ background: "#0A0A14", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
          >
            <div className="pt-8 pb-6 px-4 flex flex-col items-center gap-4">
              <QRFrame />
              <p className="text-white/50 text-xs text-center">
                Point camera at any UPI QR code
              </p>
            </div>
          </div>

          {/* Amount field */}
          <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <label className="text-[11px] font-semibold" style={{ color: "#6B7280" }}>
              Enter amount (optional)
            </label>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black" style={{ color: "#002970" }}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 text-2xl font-black outline-none bg-transparent"
                style={{ color: "#002970" }}
              />
            </div>
          </div>

          {/* Or upload QR */}
          <button
            className="w-full py-3 rounded-2xl font-semibold text-sm mb-4"
            style={{ background: "#fff", color: "#00BAF2", border: "1.5px solid #E0F7FF" }}
          >
            📁  Upload QR from Gallery
          </button>
        </div>
      ) : (
        <div className="px-4">
          {/* UPI ID input */}
          <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <label className="text-[11px] font-semibold block mb-2" style={{ color: "#6B7280" }}>
              Enter UPI ID / Mobile Number
            </label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3" style={{ height: 44 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#9CA3AF" strokeWidth="1.8"/>
              </svg>
              <input
                placeholder="name@bank or 9876543210"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: "#1A1A2E" }}
              />
            </div>
          </div>

          {/* Recent contacts */}
          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Recent</p>
            <div className="flex flex-col gap-2">
              {UPI_CONTACTS.map((c) => (
                <div
                  key={c.name}
                  className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-blue-50 flex-shrink-0">
                    {c.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: "#1A1A2E" }}>{c.name}</div>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>{c.upi}</div>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-xl font-bold text-xs text-white"
                    style={{ background: "#00BAF2" }}
                  >
                    Pay {c.amount}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scanLine {
          0%   { top: 12px; opacity: 1; }
          50%  { top: calc(100% - 12px); opacity: 1; }
          100% { top: 12px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
