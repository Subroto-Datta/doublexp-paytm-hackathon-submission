"use client";

const OFFERS = [
  {
    id: 1,
    title: "10% off on Swiggy",
    desc: "Use PAYTM10 at checkout",
    emoji: "🍕",
    bg: "linear-gradient(135deg, #ff9a9e, #fecfef)",
    expiry: "Ends 10 Jun",
  },
  {
    id: 2,
    title: "₹200 Cashback",
    desc: "On DTH recharge above ₹500",
    emoji: "📺",
    bg: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    expiry: "Ends 15 Jun",
  },
  {
    id: 3,
    title: "Free Gold!",
    desc: "Buy ₹1000 gold, get ₹100 free",
    emoji: "🥇",
    bg: "linear-gradient(135deg, #f6d365, #fda085)",
    expiry: "Limited stock",
  },
  {
    id: 4,
    title: "Flat ₹150 off",
    desc: "On flight bookings via app",
    emoji: "✈️",
    bg: "linear-gradient(135deg, #84fab0, #8fd3f4)",
    expiry: "Ends 30 Jun",
  },
];

export default function RecommendedOffers({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  return (
    <div className="mb-5">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="font-bold text-sm" style={{ color: "#1A1A2E" }}>
          Recommended For You
        </h2>
        <button 
          onClick={() => { if (onTabChange) onTabChange("offers"); }}
          className="text-xs font-semibold active:scale-95 transition-transform" 
          style={{ color: "#00BAF2" }}
        >
          View All
        </button>
      </div>

      <div className="horizontal-scroll flex gap-3 px-4 overflow-x-auto pb-1">
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            onClick={() => { if (onTabChange) onTabChange("offers"); }}
            className="offer-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
            style={{ width: 152, background: offer.bg, boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}
          >
            <div className="p-3.5">
              <div className="text-3xl mb-2">{offer.emoji}</div>
              <div className="font-bold text-xs text-white leading-tight mb-0.5">{offer.title}</div>
              <div className="text-[10px] text-white/80 leading-tight mb-2">{offer.desc}</div>
              <div
                className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.95)" }}
              >
                {offer.expiry}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
