"use client";

import { useState, useEffect, useRef } from "react";

const BANNERS = [
  {
    id: 1,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    title: "Earn up to ₹500 Cashback",
    subtitle: "On your first 3 recharges this month",
    badge: "LIMITED OFFER",
    badgeColor: "#FFD700",
  },
  {
    id: 2,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    title: "Paytm Travel SALE",
    subtitle: "Flat 20% off on train & bus tickets",
    badge: "ENDS TONIGHT",
    badgeColor: "#FF6B6B",
  },
  {
    id: 3,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    title: "Insurance at ₹1/day",
    subtitle: "Protect yourself & your family today",
    badge: "NEW",
    badgeColor: "#00C853",
  },
];

export default function BannerCarousel({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 3200);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const go = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) go((current + 1) % BANNERS.length);
      else go((current - 1 + BANNERS.length) % BANNERS.length);
    }
    setIsDragging(false);
  };

  return (
    <div className="px-4 mb-5">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ height: 140 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track */}
        <div
          className="carousel-track absolute inset-0 flex"
          style={{ width: `${BANNERS.length * 100}%`, transform: `translateX(-${current * (100 / BANNERS.length)}%)` }}
        >
          {BANNERS.map((b) => (
            <div
              key={b.id}
              className="relative flex-shrink-0 flex items-center px-5"
              style={{ width: `${100 / BANNERS.length}%`, background: b.gradient }}
            >
              {/* Decorative circles */}
              <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="absolute right-10 bottom-[-30px] w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />

              <div className="relative z-10">
                <span
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                  style={{ background: b.badgeColor, color: "#fff" }}
                >
                  {b.badge}
                </span>
                <div className="text-white font-bold text-base leading-tight">{b.title}</div>
                <div className="text-white/80 text-xs mt-1">{b.subtitle}</div>
                <button 
                  onClick={() => { if (onTabChange) onTabChange("offers"); }}
                  className="mt-3 bg-white text-xs font-semibold px-3 py-1 rounded-full active:scale-95 transition-transform" 
                  style={{ color: "#764ba2" }}
                >
                  Grab Now →
                </button>
              </div>

              {/* Illustration placeholder */}
              <div className="absolute right-4 bottom-0 flex items-end">
                <div className="text-5xl opacity-80">
                  {b.id === 1 ? "💸" : b.id === 2 ? "🚂" : "🛡️"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 18 : 6,
                height: 6,
                background: i === current ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
