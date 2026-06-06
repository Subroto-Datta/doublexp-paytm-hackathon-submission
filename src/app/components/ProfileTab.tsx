"use client";

import { useState } from "react";

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const MENU_ITEMS = [
  { section: "Account", items: [
    { label: "KYC Verification", emoji: "🪪", badge: "Complete", badgeColor: "#00C853" },
    { label: "Bank Accounts", emoji: "🏦", badge: "2 Linked", badgeColor: "#00BAF2" },
    { label: "UPI IDs", emoji: "🔗", badge: "sd@paytm", badgeColor: "#6B7280" },
  ]},
  { section: "Payments", items: [
    { label: "Saved Cards", emoji: "💳", badge: "3 Cards", badgeColor: "#6B7280" },
    { label: "Auto Pay", emoji: "🔄", badge: null, badgeColor: null },
    { label: "Payment Limits", emoji: "📊", badge: null, badgeColor: null },
  ]},
  { section: "More", items: [
    { label: "Refer & Earn ₹200", emoji: "🎁", badge: "New", badgeColor: "#F44336" },
    { label: "Help & Support", emoji: "💬", badge: null, badgeColor: null },
    { label: "Settings", emoji: "⚙️", badge: null, badgeColor: null },
  ]},
];

export default function ProfileTab() {
  const [kycPressed, setKycPressed] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto main-scroll" style={{ background: "#F4F6FA" }}>
      {/* Profile hero */}
      <div
        className="relative overflow-hidden px-5 pt-6 pb-16"
        style={{ background: "linear-gradient(135deg,#002970 0%,#0052B4 100%)" }}
      >
        {/* BG circles */}
        <div className="absolute w-48 h-48 rounded-full top-[-40px] right-[-40px]" style={{ background: "rgba(0,186,242,0.12)" }} />
        <div className="absolute w-28 h-28 rounded-full bottom-[-20px] left-10" style={{ background: "rgba(0,186,242,0.08)" }} />

        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#00BAF2,#0097C7)", boxShadow: "0 4px 16px rgba(0,186,242,0.4)" }}
          >
            SD
          </div>
          <div>
            <div className="text-white font-extrabold text-lg leading-tight">Saurabh Datta</div>
            <div className="text-white/60 text-xs mt-0.5">sd@paytm · +91 98765 43210</div>
            <div
              className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(0,200,83,0.2)", color: "#00C853" }}
            >
              ✓ KYC Verified
            </div>
          </div>
        </div>
      </div>

      {/* Stats row — overlapping the hero */}
      <div className="mx-4 -mt-8 relative z-10 bg-white rounded-3xl px-4 py-4 mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
        <div className="grid grid-cols-3 divide-x" style={{ divideColor: "#F0F2F5" }}>
          {[
            { label: "Transactions", value: "142", sub: "This month" },
            { label: "Cashback", value: "₹2,340", sub: "Earned" },
            { label: "Paytm Points", value: "8,520", sub: "Redeemable" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center px-2">
              <div className="font-extrabold text-base" style={{ color: "#1A1A2E" }}>{stat.value}</div>
              <div className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{stat.label}</div>
              <div className="text-[9px]" style={{ color: "#9CA3AF" }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4 pb-6 flex flex-col gap-3">
        {MENU_ITEMS.map((section) => (
          <div key={section.section}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: "#9CA3AF" }}>
              {section.section}
            </div>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50 transition-colors"
                  style={{ borderTop: i > 0 ? "1px solid #F4F6FA" : "none" }}
                >
                  <span className="text-xl w-7 text-center">{item.emoji}</span>
                  <span className="flex-1 text-sm font-medium" style={{ color: "#1A1A2E" }}>{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1"
                      style={{ background: `${item.badgeColor}18`, color: item.badgeColor! }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Log out */}
        <button
          className="w-full py-3.5 rounded-2xl font-bold text-sm mt-1 active:scale-95 transition-transform"
          style={{ background: "#FFF5F5", color: "#F44336", border: "1.5px solid #FFEBEE" }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
