"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ZubaanRecordPDF from "../components/ZubaanRecordPDF";
import { generatePDF } from "../../lib/generatePDF";
import { ProgressBar } from "../components/ProgressBar";
import { ErrorBoundary } from "../components/ErrorBoundary";

// ── Types ────────────────────────────────────────────────────────────────────
type Stage = "idle" | "recording" | "processing" | "review" | "payment" | "success";

interface ContractData {
  service_description: string | null;
  contractor_name: string | null;
  customer_name: string | null;
  advance_amount: number | null;
  total_amount: number | null;
  completion_date: string | null;
  special_conditions: string | null;
}

const FALLBACK_CONTRACT: ContractData = {
  service_description: "Fridge repair service",
  contractor_name: "Ramesh Kumar",
  customer_name: "Suresh Sharma",
  advance_amount: 500,
  total_amount: 2000,
  completion_date: "2026-06-07",
  special_conditions: "Work to be completed within 24 hours",
};

// ── Tiny SVG atoms ──────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicSVG({ size = 32, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path d="M5 10a7 7 0 0014 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00C853" />
      <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Waveform bars ────────────────────────────────────────────────────────────
function Waveform() {
  return (
    <div className="flex items-center justify-center gap-1.5 h-10">
      {[0.6, 0.9, 1.4, 0.8, 1.2, 1.0, 0.5, 1.3, 0.7, 1.1].map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 4,
            background: "#E8365D",
            animation: `wave ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.07}s`,
            height: `${h * 16}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Processing dots ──────────────────────────────────────────────────────────
function ProcessingDots() {
  return (
    <div className="flex items-center justify-center gap-2.5 mb-6">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: i === 0 ? 16 : i === 3 ? 16 : 10,
            height: i === 0 ? 16 : i === 3 ? 16 : 10,
            background: "#00BAF2",
            animation: "processBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
            opacity: i === 0 || i === 3 ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Field component ──────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = "text", multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%",
    background: "#F8FAFF",
    border: "1.5px solid #E8EBF0",
    borderRadius: 14,
    padding: "10px 14px",
    fontSize: 14,
    color: "#1A1A2E",
    outline: "none",
    fontFamily: "inherit",
    resize: "none" as const,
  };
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-bold mb-1.5" style={{ color: "#6B7280" }}>
        {label}
      </label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} style={base} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={base} />
      )}
    </div>
  );
}

// ── IDLE STATE ───────────────────────────────────────────────────────────────
function IdleState({
  contractorName, setContractorName,
  customerName, setCustomerName,
  onStart,
}: {
  contractorName: string; setContractorName: (v: string) => void;
  customerName: string;   setCustomerName:   (v: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 pb-10">
      <p className="text-center text-sm mb-6" style={{ color: "#6B7280", lineHeight: 1.6 }}>
        Speak your deal in your language.<br />We&apos;ll formalize it.
      </p>

      {/* KYC-style inputs */}
      <div
        className="rounded-2xl p-4 mb-8"
        style={{ background: "#fff", border: "1px solid #E8EBF0", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      >
        <Field
          label="YOUR NAME (CONTRACTOR)"
          value={contractorName}
          onChange={setContractorName}
        />
        <Field
          label="CUSTOMER NAME"
          value={customerName}
          onChange={setCustomerName}
        />
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Pulse ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 96, height: 96,
              background: "rgba(0,186,242,0.20)",
              animation: "pulseRing 2s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 96, height: 96,
              background: "rgba(0,186,242,0.10)",
              animation: "pulseRing 2s ease-out infinite 0.5s",
            }}
          />
          <button
            onClick={onStart}
            className="relative z-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
            style={{
              width: 96, height: 96,
              background: "linear-gradient(135deg,#00BAF2,#0096D6)",
              boxShadow: "0 8px 24px rgba(0,186,242,0.45)",
            }}
          >
            <MicSVG size={34} color="#fff" />
          </button>
        </div>

        <div className="text-center">
          <div className="font-bold text-lg" style={{ color: "#002970" }}>
            अपनी ज़ुबान दें
          </div>
          <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
            Tap to start recording your contract terms
          </div>
        </div>

        {/* Language pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["हिंदी", "English", "తెలుగు", "தமிழ்", "ਪੰਜਾਬੀ", "বাংলা"].map((l) => (
            <span
              key={l}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: "#F0FAFF", color: "#00BAF2", border: "1px solid #B3E9FF" }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RECORDING STATE ──────────────────────────────────────────────────────────
function RecordingState({ elapsed, onStop }: { elapsed: number; onStop: () => void }) {
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10 gap-6">
      {/* Timer */}
      <div className="font-black tabular-nums text-5xl" style={{ color: "#E8365D", letterSpacing: 2 }}>
        {mins}:{secs}
      </div>

      {/* Waveform */}
      <Waveform />

      {/* Mic button (red) */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute rounded-full"
          style={{
            width: 96, height: 96,
            background: "rgba(232,54,93,0.22)",
            animation: "pulseRing 1s ease-out infinite",
          }}
        />
        <button
          onClick={onStop}
          className="relative z-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
          style={{
            width: 96, height: 96,
            background: "linear-gradient(135deg,#E8365D,#B8002E)",
            boxShadow: "0 8px 24px rgba(232,54,93,0.45)",
          }}
        >
          {/* Stop icon */}
          <div className="w-7 h-7 rounded-lg bg-white" />
        </button>
      </div>

      <div className="font-bold text-base" style={{ color: "#E8365D" }}>
        Recording… tap to stop
      </div>
      <div className="text-xs text-center" style={{ color: "#9CA3AF" }}>
        Speak your contract terms clearly.<br />We support background noise.
      </div>
    </div>
  );
}

// ── PROCESSING STATE ─────────────────────────────────────────────────────────
function ProcessingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10 gap-4">
      {/* Animated brain/AI circle */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-2">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid transparent",
            borderTopColor: "#00BAF2",
            borderRightColor: "#00BAF2",
            animation: "spin 1s linear infinite",
          }}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 12,
            border: "2px solid transparent",
            borderBottomColor: "#0052B4",
            animation: "spin 1.6s linear infinite reverse",
          }}
        />
        {/* Center */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#001F5B,#0A2E6E)" }}
        >
          <MicSVG size={26} color="#00BAF2" />
        </div>
      </div>

      <ProcessingDots />

      <div className="text-center">
        <div className="font-bold text-xl mb-1.5" style={{ color: "#001F5B" }}>
          ज़ुबान पढ़ी जा रही है...
        </div>
        <div className="text-sm" style={{ color: "#6B7280" }}>
          Sarvam AI is reading your contract...
        </div>
      </div>

      {/* Shimmer skeleton */}
      <div className="w-full max-w-xs mt-4 flex flex-col gap-2.5">
        {[80, 60, 90, 50].map((w, i) => (
          <div
            key={i}
            className="shimmer rounded-xl h-4"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── PAYMENT STATE ────────────────────────────────────────────────────────────
function PaymentState({
  contractData,
  onPay,
  loading,
  progress,
}: {
  contractData: ContractData;
  onPay: () => void;
  loading: boolean;
  progress: number;
}) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 px-5" style={{ background: "#fff" }}>
      {/* Progress bar */}
      {loading && (
        <div
          className="fixed top-0 left-0 h-1"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00BAF2, #0096D6)",
            transition: "width 0.3s ease",
            zIndex: 100,
          }}
        />
      )}

      {/* Payment summary card */}
      <div
        className="rounded-2xl border p-5 mt-4"
        style={{ borderColor: "#DDE5F0", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      >
        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
          COMMITMENT VAULT DEPOSIT
        </div>
        <div style={{ fontSize: 14, color: "#0D1B3E", fontWeight: "bold", marginBottom: 4 }}>
          {contractData.service_description}
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
          {contractData.contractor_name}
        </div>

        <div style={{ borderBottom: "1px solid #E8EBF0", marginBottom: 12 }} />

        <div className="flex items-center justify-between">
          <div style={{ fontSize: 12, color: "#6B7280" }}>Advance Amount</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#00BAF2",
            }}
          >
            ₹{(contractData.advance_amount || 0).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* UPI section */}
      <div
        className="rounded-2xl border p-5 mt-3"
        style={{ borderColor: "#DDE5F0" }}
      >
        <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, marginBottom: 12, letterSpacing: "0.05em" }}>
          PAY VIA UPI
        </div>
        <input
          type="text"
          disabled
          value="demo@paytm"
          style={{
            width: "100%",
            background: "#F4F6FA",
            border: "1px solid #E8EBF0",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13,
            color: "#1A1A2E",
            fontWeight: 500,
          }}
        />

        {/* Commitment Vault explainer */}
        <div
          className="rounded-lg p-3 mt-3 flex gap-3"
          style={{
            background: "#EEF8FF",
            border: "1px solid #B3E5FF",
          }}
        >
          <div style={{ fontSize: 16, flexShrink: 0 }}>🔒</div>
          <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>
            ₹{(contractData.advance_amount || 0).toLocaleString("en-IN")} will be held in Commitment Vault.
            Released only when both parties confirm job is done.
          </div>
        </div>

        {/* Protected by Paytm */}
        <div className="flex items-center gap-2 mt-2">
          <div style={{ fontSize: 12 }}>🛡️</div>
          <div style={{ fontSize: 10, color: "#6B7280" }}>Protected by Paytm</div>
        </div>
      </div>

      {/* Pay button (fixed) */}
      <button
        onClick={onPay}
        disabled={loading}
        className="fixed bottom-0 left-0 right-0 mx-4 rounded-full font-bold text-base text-white"
        style={{
          height: 56,
          background: loading ? "#7BB3DA" : "#00BAF2",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          maxWidth: 468,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
          marginBottom: 0,
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Processing...
          </>
        ) : (
          <>
            Pay ₹{(contractData.advance_amount || 0).toLocaleString("en-IN")} →
          </>
        )}
      </button>
    </div>
  );
}

// ── SUCCESS STATE ────────────────────────────────────────────────────────────
function SuccessState({
  contractData,
  paymentData,
  contractId,
  onDownloadPDF,
  pdfLoading,
  pdfDownloaded,
}: {
  contractData: ContractData;
  paymentData: { transaction_id: string; amount: number; status: string; timestamp: string; vault_id: string };
  contractId: string;
  onDownloadPDF: () => void;
  pdfLoading: boolean;
  pdfDownloaded: boolean;
}) {
  const formattedTime = (() => {
    const date = new Date(paymentData.timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${mins}`;
  })();

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#fff", paddingBottom: "max(80px, max(env(safe-area-inset-bottom), 16px) + 64px)" }}>
      {/* Checkmark animation */}
      <motion.div
        className="flex justify-center pt-12 pb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            border: "3px solid #00C48C",
            borderRadius: "50%",
          }}
        >
          <span style={{ fontSize: 48, color: "#00C48C" }}>✓</span>
        </div>
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 style={{ fontSize: 26, color: "#0D1B3E", fontWeight: "bold", marginBottom: 4 }}>
          Zubaan Secured! 🎉
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          Your contract is locked. Advance secured.
        </p>
      </div>

      {/* Transaction card */}
      <div
        className="rounded-2xl p-4 mt-4 mx-4"
        style={{
          background: "#EDFCF5",
          border: "1px solid #00C48C",
        }}
      >
        {[
          { label: "Transaction ID", value: paymentData.transaction_id },
          { label: "Amount", value: `₹${paymentData.amount.toLocaleString("en-IN")}` },
          {
            label: "Status",
            value: (
              <span
                style={{
                  background: "#00C48C",
                  color: "#fff",
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {paymentData.status}
              </span>
            ),
          },
          { label: "Time", value: formattedTime },
          { label: "Vault ID", value: paymentData.vault_id },
        ].map((row, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center"
            style={{
              padding: "12px 0",
              borderBottom: idx < 4 ? "1px solid rgba(0,196,140,0.1)" : "none",
            }}
          >
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{row.label}</div>
            <div
              style={{
                fontSize: 11,
                color: "#0D1B3E",
                fontWeight: 600,
                fontFamily: row.label.includes("ID") ? "monospace" : "inherit",
              }}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mx-4 mt-5 flex flex-col gap-3">
        {/* Download PDF */}
        <button
          onClick={onDownloadPDF}
          disabled={pdfLoading}
          className="w-full rounded-full bg-black text-white font-bold h-13 flex items-center justify-center gap-2"
          style={{
            background: "#0D1B3E",
            fontSize: 15,
            cursor: pdfLoading ? "not-allowed" : "pointer",
            opacity: pdfLoading ? 0.7 : 1,
          }}
        >
          {pdfLoading ? (
            <>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              Generating PDF...
            </>
          ) : pdfDownloaded ? (
            <>
              <span>✓</span> PDF Downloaded
            </>
          ) : (
            <>
              <span>📄</span> Download Zubaan Record
            </>
          )}
        </button>

        {/* Share WhatsApp */}
        <button
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
              navigator.vibrate(50);
            }
            const msg = `Zubaan Contract Created! ✅\n\nService: ${contractData.service_description}\nTotal: ₹${(contractData.total_amount || 0).toLocaleString("en-IN")}\nAdvance Secured: ₹${(contractData.advance_amount || 0).toLocaleString("en-IN")}\nContract ID: ${contractId}\nTransaction: ${paymentData.transaction_id}\n\nPowered by Paytm Zubaan 🎤`;
            window.open("https://wa.me/?text=" + encodeURIComponent(msg));
          }}
          className="w-full rounded-full text-white font-bold h-13 flex items-center justify-center gap-2"
          style={{
            background: "#25D366",
            fontSize: 15,
          }}
        >
          <span>💬</span> Share on WhatsApp
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 px-6">
        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 2 }}>
          🔒 Commitment Vault Active
        </div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>
          Funds release on dual completion confirmation
        </div>
      </div>
    </div>
  );
}

// ── REVIEW STATE ─────────────────────────────────────────────────────────────
function ReviewState({
  data, setData, onProceed,
}: {
  data: ContractData;
  setData: (d: ContractData) => void;
  onProceed: () => void;
}) {
  const [contractorConfirmed, setContractorConfirmed] = useState(false);
  const [customerConfirmed,   setCustomerConfirmed]   = useState(false);
  const bothConfirmed = contractorConfirmed && customerConfirmed;

  const set = (key: keyof ContractData) => (v: string) =>
    setData({ ...data, [key]: key === "advance_amount" || key === "total_amount" ? Number(v) : v });

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="flex-1 overflow-y-auto pb-8"
      style={{ background: "#F4F6FA" }}
    >
      {/* Success banner */}
      <div
        className="flex items-center gap-3 px-5 py-4 mb-4"
        style={{ background: "#fff", borderBottom: "1px solid #F0F2F5" }}
      >
        <CheckCircle />
        <div>
          <div className="font-bold text-base" style={{ color: "#1A1A2E" }}>
            Your Zubaan Contract
          </div>
          <div className="text-xs" style={{ color: "#6B7280" }}>
            Review &amp; confirm all terms before proceeding
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Editable fields */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
        >
          <Field label="SERVICE DESCRIPTION"    value={data.service_description || ""} onChange={set("service_description")} />
          <Field label="CONTRACTOR NAME"        value={data.contractor_name || ""}     onChange={set("contractor_name")} />
          <Field label="CUSTOMER NAME"          value={data.customer_name || ""}       onChange={set("customer_name")} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="ADVANCE AMOUNT (₹)"  value={String(data.advance_amount || "")} onChange={set("advance_amount")} type="number" />
            <Field label="TOTAL AMOUNT (₹)"    value={String(data.total_amount || "")}   onChange={set("total_amount")}   type="number" />
          </div>
          <Field label="COMPLETION DATE"       value={data.completion_date || ""}     onChange={set("completion_date")} type="date" />
          <Field label="SPECIAL CONDITIONS"    value={data.special_conditions || ""}  onChange={set("special_conditions")} multiline />
        </div>

        {/* Contract summary pill */}
        <div
          className="rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#001F5B,#0A2E6E)" }}
        >
          <div>
            <div className="text-white/60 text-[10px] font-semibold">TOTAL CONTRACT VALUE</div>
            <div className="text-white font-black text-2xl">
              ₹{Number(data.total_amount || 0).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-[10px] font-semibold">ADVANCE</div>
            <div className="text-white font-bold text-base">
              ₹{Number(data.advance_amount || 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Dual confirm buttons */}
        <div className="text-xs font-semibold text-center mb-3" style={{ color: "#9CA3AF" }}>
          Both parties must confirm to proceed
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => {
              try {
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(50);
                }
              } catch {}
              setContractorConfirmed(true);
            }}
            className="py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: contractorConfirmed ? "#00C853" : "#001F5B",
              color: "#fff",
              boxShadow: contractorConfirmed ? "0 4px 12px rgba(0,200,83,0.35)" : "none",
            }}
          >
            {contractorConfirmed ? "✓ Contractor" : "Contractor ✓"}
          </button>
          <button
            onClick={() => {
              try {
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(50);
                }
              } catch {}
              setCustomerConfirmed(true);
            }}
            className="py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: customerConfirmed ? "#00C853" : "#001F5B",
              color: "#fff",
              boxShadow: customerConfirmed ? "0 4px 12px rgba(0,200,83,0.35)" : "none",
            }}
          >
            {customerConfirmed ? "✓ Customer" : "Customer ✓"}
          </button>
        </div>

        {/* Proceed button — appears after both confirmed */}
        <AnimatePresence>
          {bothConfirmed && (
            <motion.button
              key="proceed"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              onClick={() => {
                try {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    navigator.vibrate(50);
                  }
                } catch {}
                onProceed();
              }}
              className="w-full py-4 rounded-2xl font-bold text-base text-white"
              style={{
                background: "linear-gradient(135deg,#00BAF2,#0096D6)",
                boxShadow: "0 6px 20px rgba(0,186,242,0.40)",
              }}
            >
              Proceed to Payment →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── ROOT PAGE ─────────────────────────────────────────────────────────────────
export default function ZubaanPage() {
  const router = useRouter();
  const [stage, setStage]                 = useState<Stage>("idle");
  const [contractorName, setContractorName] = useState("");
  const [customerName,   setCustomerName]   = useState("");
  const [elapsed, setElapsed]             = useState(0);
  const [contract, setContract]           = useState<ContractData | null>(null);
  const [paymentData, setPaymentData]     = useState<{ transaction_id: string; amount: number; status: string; timestamp: string; vault_id: string } | null>(null);
  const [contractId, setContractId]       = useState("");
  const [pdfBlobUrl, setPdfBlobUrl]       = useState<string | null>(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [pdfLoading, setPdfLoading]       = useState(false);
  const [demoMode, setDemoMode]           = useState(false);
  const [currentTime, setCurrentTime]     = useState("");
  const [loading, setLoading]             = useState(false);
  const [apiError, setApiError]           = useState<string | null>(null);
  const [showDemoToast, setShowDemoToast] = useState<{ show: boolean; on: boolean }>({ show: false, on: false });

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoTapCountRef = useRef(0);
  const logoTapTimestampRef = useRef(0);

  // Generate contract ID on mount
  useEffect(() => {
    setContractId("ZB" + Date.now());
    
    // Load demo mode from localStorage
    if (typeof window !== "undefined") {
      const savedDemoMode = localStorage.getItem("zubaan_demo_mode") === "true";
      setDemoMode(savedDemoMode);
      
      // Set initial time
      const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}`);
      };
      updateTime();
      
      // Update time every minute
      const timeInterval = setInterval(updateTime, 60000);
      return () => clearInterval(timeInterval);
    }
  }, []);

  // Auto-hide demo toast
  useEffect(() => {
    if (showDemoToast.show) {
      const timer = setTimeout(() => {
        setShowDemoToast({ show: false, on: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showDemoToast.show]);

  // ── Start recording ────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(50);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.start(200);
      mediaRef.current = mr;
      setElapsed(0);
      setStage("recording");

      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      // Microphone permission denied — fall through to processing with silence
      setStage("processing");
      callExtract(new Blob([], { type: "audio/webm" }));
    }
  }, []);

  // ── Call /api/extract ──────────────────────────────────────────────────
  const callExtract = useCallback(async (blob: Blob) => {
    setLoading(true);
    setApiError(null);
    const fd = new FormData();
    fd.append("audio",             blob, "recording.webm");
    fd.append("contractor_name",   contractorName);
    fd.append("customer_name",     customerName);

    try {
      const url = `/api/extract${demoMode ? "?demo=true" : ""}`;
      const res  = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Extract API failed ${res.status}: ${errorText}`);
      }
      const json = (await res.json()) as { success: boolean; error?: string; data: ContractData };

      // Surface API-level errors (STT or LLM failures) to the user
      if (!json.success && json.error) {
        console.error("[API Error]", json.error);
        setApiError(json.error);
      }

      setContract(json.data);
      setLoading(false);
      setStage("review");
    } catch (error) {
      console.error("[callExtract Error]", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      setApiError(msg);
      setContract({
        ...FALLBACK_CONTRACT,
        contractor_name: contractorName || FALLBACK_CONTRACT.contractor_name,
        customer_name: customerName || FALLBACK_CONTRACT.customer_name,
      });
      setLoading(false);
      setStage("review");
    }
  }, [contractorName, customerName, demoMode]);

  // ── Stop recording ─────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(50);
      }
    } catch {}
    if (timerRef.current) clearInterval(timerRef.current);
    const mr = mediaRef.current;
    if (!mr) return;

    setStage("processing");
    mr.addEventListener(
      "stop",
      () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        mr.stream.getTracks().forEach((t) => t.stop());
        callExtract(blob);
      },
      { once: true }
    );
    mr.stop();
  }, [callExtract]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Stage label ────────────────────────────────────────────────────────
  const stageLabel: Record<Stage, string> = {
    idle:       "Zubaan Contract",
    recording:  "Recording...",
    processing: "Processing",
    review:     "Review Contract",
    payment:    "Secure Payment",
    success:    "Zubaan Secured!",
  };

  return (
    <ErrorBoundary>
      <ProgressBar loading={loading} />
      
      <div
        className="app-shell"
        style={{ background: "#fff" }}
      >
        {/* ── Fake status bar ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 12,
            fontSize: 11,
            fontWeight: 500,
            color: "#666",
            zIndex: 9998,
            borderBottom: "1px solid #F0F2F5",
          }}
        >
          <span>{currentTime}</span>
          <span>●●● WiFi 🔋</span>
        </div>

        {/* ── Header with top margin for status bar ──────────────────────── */}
        <header
          className="flex-shrink-0 flex items-center px-4 gap-3"
          style={{
            height: 56,
            borderBottom: "1px solid #F0F2F5",
            background: "#fff",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            marginTop: 20,
          }}
      >
        <button
          onClick={() => {
            if (stage === "payment" || stage === "success") {
              if (stage === "success") {
                router.push("/");
              } else {
                setStage("review");
              }
            } else {
              router.push("/");
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "#F4F6FA", color: "#001F5B" }}
        >
          <BackIcon />
        </button>

        <h1
          className="flex-1 text-center font-extrabold text-base"
          style={{ color: "#00BAF2" }}
        >
          {stageLabel[stage]}
        </h1>

        {/* paytm wordmark right */}
        <span
          className="font-black text-sm cursor-pointer"
          style={{ color: "#001F5B", letterSpacing: "-0.5px" }}
          onClick={() => {
            const now = Date.now();
            if (now - logoTapTimestampRef.current > 2000) {
              logoTapCountRef.current = 0;
            }
            logoTapCountRef.current += 1;
            logoTapTimestampRef.current = now;

            if (logoTapCountRef.current === 5) {
              const newDemoMode = !demoMode;
              setDemoMode(newDemoMode);
              localStorage.setItem("zubaan_demo_mode", newDemoMode ? "true" : "false");
              setShowDemoToast({ show: true, on: newDemoMode });
              logoTapCountRef.current = 0;
            }
          }}
        >
          pay<span style={{ color: "#00BAF2" }}>T</span>m
        </span>
      </header>

      {/* ── Stage content ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <IdleState
              contractorName={contractorName} setContractorName={setContractorName}
              customerName={customerName}     setCustomerName={setCustomerName}
              onStart={startRecording}
            />
          </motion.div>
        )}

        {stage === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <RecordingState elapsed={elapsed} onStop={stopRecording} />
          </motion.div>
        )}

        {stage === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <ProcessingState />
          </motion.div>
        )}

        {stage === "review" && contract && (
          <motion.div
            key="review"
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── API Error Banner ────────────────────────────────────────── */}
            {apiError && (
              <div
                className="mx-4 mt-3 mb-1 rounded-2xl p-3 flex items-start gap-2"
                style={{ background: "#FFF3E0", border: "1px solid #FFB74D" }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#E65100", marginBottom: 2 }}>
                    AI extraction failed — showing fallback data
                  </div>
                  <div style={{ fontSize: 10, color: "#BF360C", lineHeight: 1.5 }}>
                    {apiError}
                  </div>
                </div>
                <button
                  onClick={() => setApiError(null)}
                  style={{ fontSize: 16, color: "#E65100", lineHeight: 1, flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            )}

            <ReviewState
              data={contract}
              setData={setContract}
              onProceed={async () => {
                setPaymentProgress(0);
                setStage("payment");
                
                // Simulate payment flow
                setTimeout(() => setPaymentProgress(85), 100);
                
                try {
                  const url = `/api/payment${demoMode ? "?demo=true" : ""}`;
                  const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      advance_amount: contract.advance_amount,
                      contractor_name: contract.contractor_name,
                      customer_name: contract.customer_name,
                      service_description: contract.service_description,
                    }),
                  });
                  const json = await res.json() as { success: boolean; transaction_id: string; amount: number; status: string; timestamp: string; vault_id: string };
                  setPaymentData(json);
                  setPaymentProgress(100);
                  setTimeout(() => setStage("success"), 300);
                } catch (err) {
                  console.error("[Payment Error]", err);
                  setStage("review");
                }
              }}
            />
          </motion.div>
        )}

        {stage === "payment" && contract && (
          <motion.div
            key="payment"
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <PaymentState
              contractData={contract}
              onPay={async () => {
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(100);
                }
                setPaymentProgress(0);
                const progressInterval = setInterval(() => {
                  setPaymentProgress((p) => Math.min(p + Math.random() * 20, 85));
                }, 300);

                try {
                  const url = `/api/payment${demoMode ? "?demo=true" : ""}`;
                  const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      advance_amount: contract.advance_amount,
                      contractor_name: contract.contractor_name,
                      customer_name: contract.customer_name,
                      service_description: contract.service_description,
                    }),
                  });
                  const json = await res.json() as { success: boolean; transaction_id: string; amount: number; status: string; timestamp: string; vault_id: string };
                  clearInterval(progressInterval);
                  setPaymentData(json);
                  setPaymentProgress(100);
                  setTimeout(() => setStage("success"), 300);
                } catch (err) {
                  clearInterval(progressInterval);
                  console.error("[Payment Error]", err);
                }
              }}
              loading={paymentProgress > 0 && paymentProgress < 100}
              progress={paymentProgress}
            />
          </motion.div>
        )}

        {stage === "success" && contract && paymentData && (
          <motion.div
            key="success"
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessState
              contractData={contract}
              paymentData={paymentData}
              contractId={contractId}
              onDownloadPDF={async () => {
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(50);
                }
                setPdfLoading(true);
                try {
                  const url = await generatePDF(contractId);
                  setPdfBlobUrl(url);
                  setPdfLoading(false);
                } catch (err) {
                  console.error("[PDF Generation Error]", err);
                  setPdfLoading(false);
                }
              }}
              pdfLoading={pdfLoading}
              pdfDownloaded={!!pdfBlobUrl}
            />

            {/* Hidden PDF element for html2canvas */}
            {contract && paymentData && (
              <ZubaanRecordPDF
                contractData={contract}
                transactionId={paymentData.transaction_id}
                vaultId={paymentData.vault_id}
                timestamp={paymentData.timestamp}
                contractId={contractId}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Keyframe styles ──────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes pulseRing {
          0%   { transform: scale(1);    opacity: 0.8; }
          80%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes wave {
          0%   { transform: scaleY(0.4); }
          100% { transform: scaleY(1.0); }
        }
        @keyframes processBounce {
          0%, 80%, 100% { transform: scale(1);    opacity: 0.5; }
          40%            { transform: scale(1.3);  opacity: 1;   }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>

      {/* ── Demo mode toast ──────────────────────────────────────────────────── */}
      {showDemoToast.show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            padding: "12px 20px",
            borderRadius: 8,
            backgroundColor: showDemoToast.on ? "#FF9500" : "#00C48C",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {showDemoToast.on ? "🎭 Demo Mode: ON" : "✅ Demo Mode: OFF"}
        </motion.div>
      )}
    </ErrorBoundary>
  );
}
