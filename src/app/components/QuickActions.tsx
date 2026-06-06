"use client";

import { useState } from "react";

// SVG Icons
const Icons = {
  Mobile: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  Electricity: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.5 13.5H11L11 22L19.5 10.5H13L13 2Z" fill="currentColor"/>
    </svg>
  ),
  SendMoney: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Bank: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="5" y="10" width="3" height="8" fill="currentColor" rx="0.5"/>
      <rect x="10.5" y="10" width="3" height="8" fill="currentColor" rx="0.5"/>
      <rect x="16" y="10" width="3" height="8" fill="currentColor" rx="0.5"/>
      <rect x="3" y="18" width="18" height="2" rx="1" fill="currentColor"/>
    </svg>
  ),
  Movie: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <path d="M8 4V20M16 4V20M2 9H8M16 9H22M2 15H8M16 15H22" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Train: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <path d="M4 10H20" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8.5" cy="18.5" r="1.5" fill="currentColor"/>
      <circle cx="15.5" cy="18.5" r="1.5" fill="currentColor"/>
      <path d="M7 17L5 21M17 17L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 7H10M14 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  MutualFund: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 17L8 11L12 14L17 7L21 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="21" cy="10" r="2" fill="currentColor"/>
    </svg>
  ),
  Grid: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
    </svg>
  ),
};

const ACTIONS = [
  { id: "recharge", label: "Mobile\nRecharge", Icon: Icons.Mobile, bg: "#E0F7FF", color: "#00BAF2" },
  { id: "electricity", label: "Electricity\nBill", Icon: Icons.Electricity, bg: "#FFF9E0", color: "#F5A623" },
  { id: "send", label: "Send\nMoney", Icon: Icons.SendMoney, bg: "#E0FFF4", color: "#00C853" },
  { id: "bank", label: "Bank\nTransfer", Icon: Icons.Bank, bg: "#E0EEFF", color: "#3D7FE6" },
  { id: "movie", label: "Movie\nTickets", Icon: Icons.Movie, bg: "#FFE0E0", color: "#F44336" },
  { id: "train", label: "Train\nTickets", Icon: Icons.Train, bg: "#FFF0E0", color: "#FF6D00" },
  { id: "mf", label: "Mutual\nFunds", Icon: Icons.MutualFund, bg: "#F0E0FF", color: "#9C27B0" },
  { id: "all", label: "See\nAll", Icon: Icons.Grid, bg: "#F0F2F5", color: "#6B7280" },
];

export default function QuickActions() {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <div className="px-4 mb-5">
      <div className="grid grid-cols-4 gap-y-4">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            id={`qa-${action.id}`}
            className="quick-action-btn flex flex-col items-center gap-1.5"
            onPointerDown={() => setPressed(action.id)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
            style={{ transform: pressed === action.id ? "scale(0.92)" : "scale(1)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                background: action.bg,
                color: action.color,
                boxShadow: pressed === action.id
                  ? `0 1px 4px ${action.color}40`
                  : `0 2px 8px ${action.color}25`,
              }}
            >
              <action.Icon />
            </div>
            <span
              className="text-center leading-tight font-medium"
              style={{ fontSize: 10, color: "#4B5563", whiteSpace: "pre-line" }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
