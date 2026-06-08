"use client";

import { useState } from "react";

// Bell icon
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Search icon
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Scan icon (inside search bar)
function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 7V4a1 1 0 011-1h3M17 3h3a1 1 0 011 1v3M21 17v3a1 1 0 01-1 1h-3M7 21H4a1 1 0 01-1-1v-3" stroke="#00BAF2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="#00BAF2" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function TopHeader({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="flex-shrink-0 flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 bg-white"
      style={{
        height: 56,
        borderBottom: "1px solid #F0F2F5",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div 
        className="flex-shrink-0 flex items-center cursor-pointer active:scale-95 transition-transform"
        onClick={() => { if (onTabChange) onTabChange("home"); }}
      >
        <span
          className="font-black select-none"
          style={{ fontSize: 22, color: "#002970", letterSpacing: "-0.5px", fontFamily: "Inter, sans-serif" }}
        >
          pay<span style={{ color: "#00BAF2" }}>T</span>m
        </span>
      </div>

      {/* Search bar */}
      <div
        className="flex-1 min-w-0 flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 transition-all duration-200"
        style={{
          height: 36,
          background: searchFocused ? "#F0FAFF" : "#F4F6FA",
          border: `1.5px solid ${searchFocused ? "#00BAF2" : "transparent"}`,
        }}
      >
        <SearchIcon />
        <input
          id="header-search"
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent outline-none text-xs min-w-0"
          style={{ color: "#1A1A2E", caretColor: "#00BAF2" }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div 
          className="flex-shrink-0 cursor-pointer active:scale-90 transition-transform p-1"
          onClick={() => { if (onTabChange) onTabChange("pay"); }}
        >
          <ScanIcon />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Bell */}
        <button
          id="header-notifications"
          onClick={() => { if (onTabChange) onTabChange("history"); }}
          className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer active:scale-95 transition-transform"
          style={{ color: "#4B5563", background: "#F4F6FA" }}
        >
          <BellIcon />
          {/* Red dot */}
          <div
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#F44336", border: "1.5px solid white" }}
          />
        </button>

        {/* Avatar */}
        <button
          id="header-profile"
          onClick={() => { if (onTabChange) onTabChange("profile"); }}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-bold text-[10px] sm:text-xs text-white flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #00BAF2, #0097C7)", letterSpacing: "0.02em" }}
        >
          SD
        </button>
      </div>
    </header>
  );
}
