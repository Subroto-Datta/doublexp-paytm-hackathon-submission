"use client";

import { useRouter } from "next/navigation";

/** Microphone SVG — used both as watermark and inline */
function MicIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path
        d="M5 10a7 7 0 0014 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ZubaanCard() {
  const router = useRouter();

  return (
    <div className="px-4 mb-5">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ background: "#00BAF2" }} />
        <h2
          className="text-sm font-extrabold tracking-wide uppercase"
          style={{ color: "#002970", letterSpacing: "0.05em" }}
        >
          Zubaan — Business Services
        </h2>
      </div>

      {/* ── HERO CARD ─────────────────────────────────────────────────────── */}
      <div
        id="zubaan-entry-card"
        className="rounded-2xl overflow-hidden relative cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #001F5B 0%, #0A2E6E 100%)",
          padding: 20,
        }}
        onClick={() => router.push("/zubaan")}
      >
        {/* ── Dot-grid pattern overlay ──────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* ── Microphone watermark ──────────────────────────────────────── */}
        <div
          className="absolute right-[-10px] top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ opacity: 0.06 }}
        >
          <MicIcon size={160} color="#fff" />
        </div>

        {/* ── TOP ROW ────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          {/* NEW badge */}
          <span
            className="text-white font-bold rounded-full px-2.5 py-0.5"
            style={{ fontSize: 10, background: "#00BAF2", letterSpacing: "0.08em" }}
          >
            NEW
          </span>

          {/* paytm wordmark */}
          <span
            className="font-black select-none"
            style={{ fontSize: 15, color: "#fff", letterSpacing: "-0.5px" }}
          >
            pay<span style={{ color: "#00BAF2" }}>T</span>m
          </span>
        </div>

        {/* ── MIDDLE ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 mb-6">
          <h3
            className="text-white leading-none mb-1.5"
            style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.5px" }}
          >
            Zubaan
          </h3>
          <p
            className="font-semibold mb-3"
            style={{ fontSize: 13, color: "#00BAF2" }}
          >
            Voice-Bound Business Contracts
          </p>
          <p
            className="leading-relaxed"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", maxWidth: 260 }}
          >
            Speak your deal. Lock the payment. Get proof — in your language.
          </p>
        </div>

        {/* ── BOTTOM ROW ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          {/* Micro-stats */}
          <div className="flex gap-5">
            {[
              { value: "₹500–₹50K", label: "Contract Range" },
              { value: "60 sec",   label: "Time to Contract" },
              { value: "11 langs", label: "Languages" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="font-bold leading-tight"
                  style={{ fontSize: 13, color: "#fff" }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 9, color: "rgba(255,255,255,0.50)", fontWeight: 500 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); router.push("/zubaan"); }}
            className="flex-shrink-0 font-bold rounded-full px-4 py-2 active:scale-95 transition-transform"
            style={{
              fontSize: 13,
              background: "#fff",
              color: "#001F5B",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            बनाओ Zubaan →
          </button>
        </div>
      </div>
    </div>
  );
}
