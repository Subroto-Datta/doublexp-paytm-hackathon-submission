"use client";

const OFFER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "food", label: "🍕 Food" },
  { id: "travel", label: "✈️ Travel" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "recharge", label: "📱 Recharge" },
];

const ALL_OFFERS = [
  {
    id: 1, cat: "food",
    brand: "Swiggy",
    title: "10% Cashback",
    desc: "Min order ₹299. Max cashback ₹100.",
    code: "PAYTM10",
    emoji: "🍕",
    gradient: "linear-gradient(135deg,#ff9a9e,#fecfef)",
    expiry: "Ends 10 Jun",
  },
  {
    id: 2, cat: "shopping",
    brand: "Amazon",
    title: "₹150 Off",
    desc: "On orders above ₹999. New users only.",
    code: "PAYNEW150",
    emoji: "🛒",
    gradient: "linear-gradient(135deg,#f6d365,#fda085)",
    expiry: "Ends 20 Jun",
  },
  {
    id: 3, cat: "travel",
    brand: "MakeMyTrip",
    title: "Flat 20% Off",
    desc: "On domestic flight bookings.",
    code: "FLIGHTPAY",
    emoji: "✈️",
    gradient: "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
    expiry: "Ends 30 Jun",
  },
  {
    id: 4, cat: "recharge",
    brand: "Airtel",
    title: "₹50 Cashback",
    desc: "On recharge above ₹299.",
    code: "AIRTEL50",
    emoji: "📱",
    gradient: "linear-gradient(135deg,#84fab0,#8fd3f4)",
    expiry: "Ends 15 Jun",
  },
  {
    id: 5, cat: "food",
    brand: "Zomato",
    title: "Free Delivery",
    desc: "Use Paytm wallet. Min order ₹199.",
    code: "ZOMPAY",
    emoji: "🍛",
    gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
    expiry: "Today only",
  },
  {
    id: 6, cat: "shopping",
    brand: "Flipkart",
    title: "5% Extra Off",
    desc: "On electronics above ₹5000.",
    code: "FLIPKPAY5",
    emoji: "💻",
    gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
    expiry: "Ends 25 Jun",
  },
];

import { useState } from "react";

export default function OffersTab() {
  const [activeCat, setActiveCat] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);

  const shown = activeCat === "all"
    ? ALL_OFFERS
    : ALL_OFFERS.filter((o) => o.cat === activeCat);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto main-scroll" style={{ background: "#F4F6FA" }}>
      {/* Header */}
      <div
        className="px-4 pt-5 pb-4"
        style={{ background: "linear-gradient(135deg,#00BAF2,#0097C7)" }}
      >
        <h1 className="text-white font-extrabold text-lg mb-0.5">Exclusive Offers</h1>
        <p className="text-white/70 text-xs">Cashbacks &amp; deals crafted just for you</p>
      </div>

      {/* Category chips */}
      <div
        className="horizontal-scroll flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ background: "#fff", borderBottom: "1px solid #F0F2F5" }}
      >
        {OFFER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeCat === cat.id ? "#00BAF2" : "#F4F6FA",
              color: activeCat === cat.id ? "#fff" : "#6B7280",
              border: `1.5px solid ${activeCat === cat.id ? "#00BAF2" : "#E8EBF0"}`,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Offer cards */}
      <div className="px-4 pt-4 pb-6 grid grid-cols-1 gap-3">
        {shown.map((offer) => (
          <div
            key={offer.id}
            className="rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
          >
            {/* Gradient header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ background: offer.gradient }}
            >
              <div className="text-3xl">{offer.emoji}</div>
              <div className="flex-1">
                <div className="text-white font-extrabold text-base leading-tight">{offer.title}</div>
                <div className="text-white/80 text-[11px]">{offer.brand}</div>
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {offer.expiry}
              </div>
            </div>

            {/* Body */}
            <div
              className="bg-white px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <p className="text-xs" style={{ color: "#6B7280" }}>{offer.desc}</p>
              </div>
              <button
                onClick={() => copyCode(offer.code)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all active:scale-95"
                style={{
                  background: copied === offer.code ? "#E8F5E9" : "#E6F9FF",
                  color: copied === offer.code ? "#00C853" : "#00BAF2",
                  border: `1.5px dashed ${copied === offer.code ? "#00C853" : "#00BAF2"}`,
                }}
              >
                {copied === offer.code ? "✓ Copied!" : offer.code}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
