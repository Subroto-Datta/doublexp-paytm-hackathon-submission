"use client";

import { useState, useRef } from "react";
import TopHeader from "./components/TopHeader";
import BottomNav from "./components/BottomNav";
import QuickActions from "./components/QuickActions";
import BannerCarousel from "./components/BannerCarousel";
import ZubaanCard from "./components/ZubaanCard";
import RecommendedOffers from "./components/RecommendedOffers";
import RecentTransactions from "./components/RecentTransactions";
import GreetingStrip from "./components/GreetingStrip";
import PayTab from "./components/PayTab";
import HistoryTab from "./components/HistoryTab";
import OffersTab from "./components/OffersTab";
import ProfileTab from "./components/ProfileTab";

// ── Balance Card ────────────────────────────────────────────────────────────
function BalanceCard() {
  const [visible, setVisible] = useState(true);
  return (
    <div
      className="mx-4 mb-4 rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#00BAF2 0%,#0097C7 100%)",
        boxShadow: "0 4px 20px rgba(0,186,242,0.30)",
      }}
    >
      <div className="relative overflow-hidden px-5 pt-4 pb-4">
        {/* bg blobs */}
        <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="absolute bottom-[-20px] right-16 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />

        <div className="relative z-10">
          {/* Amount row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] font-medium text-white/70 mb-0.5">Paytm Wallet Balance</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">
                  {visible ? "₹ 4,285.50" : "₹ ••••••"}
                </span>
                <button onClick={() => setVisible(v => !v)} className="text-white/70 mt-0.5">
                  {visible ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/60 mb-0.5">UPI ID</div>
              <div className="text-[11px] font-semibold text-white/90">sd@paytm</div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="grid grid-cols-3 gap-2 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
          >
            {[
              { label: "Add Money", icon: "+" },
              { label: "Send", icon: "↑" },
              { label: "Request", icon: "↓" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-1 py-2 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <span className="text-white font-bold text-base leading-none">{a.icon}</span>
                <span className="text-white/80 font-medium" style={{ fontSize: 10 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="px-4 mb-3 flex items-center gap-2">
      <div className="w-1 h-4 rounded-full" style={{ background: "#00BAF2" }} />
      <span className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: "#9CA3AF" }}>
        {text}
      </span>
    </div>
  );
}

// ── Home feed ────────────────────────────────────────────────────────────────
function HomeFeed() {
  return (
    <div className="pt-3 pb-6">
      <GreetingStrip />
      <BalanceCard />

      {/* Quick Actions card */}
      <div className="bg-white rounded-3xl mx-4 mb-4 pt-4 pb-2" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
        <SectionLabel text="Quick Actions" />
        <QuickActions />
      </div>

      {/* Banners */}
      <div className="mb-1">
        <div className="px-4 mb-2.5">
          <span className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: "#9CA3AF" }}>
            ✨ Offers &amp; Promotions
          </span>
        </div>
        <BannerCarousel />
      </div>

      {/* Zubaan */}
      <ZubaanCard />

      {/* Recommended */}
      <div className="bg-white rounded-3xl mx-4 mb-4 pt-4 pb-3" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
        <RecommendedOffers />
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-3xl mx-4 mb-4 pt-4 pb-3" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
        <RecentTransactions />
      </div>

      <p className="text-center text-[10px] pb-2" style={{ color: "#D1D5DB" }}>
        🔒 Secured by Paytm · RBI Regulated · NPCI Member
      </p>
    </div>
  );
}

// ── Root page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const prevTab = useRef("home");

  const handleTabChange = (tab: string) => {
    prevTab.current = activeTab;
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":     return <div key="home" className="flex-1 overflow-y-auto main-scroll slide-up" style={{ background: "#F4F6FA" }}><HomeFeed /></div>;
      case "pay":      return <div key="pay" className="flex-1 flex flex-col slide-up" style={{ overflow: "hidden" }}><PayTab /></div>;
      case "history":  return <div key="history" className="flex-1 flex flex-col slide-up" style={{ overflow: "hidden" }}><HistoryTab /></div>;
      case "offers":   return <div key="offers" className="flex-1 flex flex-col slide-up" style={{ overflow: "hidden" }}><OffersTab /></div>;
      case "profile":  return <div key="profile" className="flex-1 flex flex-col slide-up" style={{ overflow: "hidden" }}><ProfileTab /></div>;
      default:         return null;
    }
  };

  return (
    <div className="app-shell">
      <TopHeader />
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
