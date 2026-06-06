"use client";

import { useState } from "react";

const TRANSACTIONS_ALL = [
  { id: 1, name: "Amazon Pay", desc: "Online Shopping", amount: "-₹1,249", isDebit: true, date: "Today", time: "10:32 AM", emoji: "🛒", status: "Success" },
  { id: 2, name: "Rahul Sharma", desc: "Money Received", amount: "+₹500", isDebit: false, date: "Today", time: "7:15 PM", emoji: "👤", status: "Success" },
  { id: 3, name: "BSES Electricity", desc: "Electricity Bill", amount: "-₹2,350", isDebit: true, date: "Yesterday", time: "9:00 AM", emoji: "⚡", status: "Success" },
  { id: 4, name: "Zomato", desc: "Food Delivery", amount: "-₹348", isDebit: true, date: "3 Jun", time: "1:45 PM", emoji: "🍛", status: "Success" },
  { id: 5, name: "Airtel Prepaid", desc: "Mobile Recharge", amount: "-₹599", isDebit: true, date: "2 Jun", time: "11:20 AM", emoji: "📱", status: "Success" },
  { id: 6, name: "Priya Mehta", desc: "Money Sent", amount: "-₹1,000", isDebit: true, date: "1 Jun", time: "6:00 PM", emoji: "👩", status: "Pending" },
  { id: 7, name: "Netflix", desc: "Subscription", amount: "-₹649", isDebit: true, date: "31 May", time: "12:00 AM", emoji: "🎬", status: "Success" },
  { id: 8, name: "Salary Credit", desc: "Bank Transfer", amount: "+₹85,000", isDebit: false, date: "30 May", time: "9:00 AM", emoji: "🏦", status: "Success" },
];

const FILTERS = ["All", "Sent", "Received", "Bills"];

export default function HistoryTab() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TRANSACTIONS_ALL.filter((t) => {
    const matchFilter =
      activeFilter === "All" ? true
      : activeFilter === "Sent" ? t.isDebit && t.desc !== "Electricity Bill" && t.desc !== "Subscription"
      : activeFilter === "Received" ? !t.isDebit
      : activeFilter === "Bills" ? (t.desc.includes("Bill") || t.desc.includes("Subscription") || t.desc.includes("Recharge"))
      : true;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalDebits = filtered.filter(t => t.isDebit).reduce((sum, t) => {
    const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
    return sum + n;
  }, 0);
  const totalCredits = filtered.filter(t => !t.isDebit).reduce((sum, t) => {
    const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
    return sum + n;
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto main-scroll flex flex-col" style={{ background: "#F4F6FA" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-4" style={{ background: "linear-gradient(135deg,#00BAF2,#0097C7)" }}>
        <h1 className="text-white font-extrabold text-lg">Transaction History</h1>
        <div className="flex gap-4 mt-3">
          <div className="flex-1 bg-white/20 rounded-2xl px-3 py-2">
            <div className="text-white/70 text-[10px] font-medium">Total Spent</div>
            <div className="text-white font-bold text-sm">-₹{totalDebits.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex-1 bg-white/20 rounded-2xl px-3 py-2">
            <div className="text-white/70 text-[10px] font-medium">Total Received</div>
            <div className="text-white font-bold text-sm">+₹{totalCredits.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white" style={{ borderBottom: "1px solid #F0F2F5" }}>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3" style={{ height: 38 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "#1A1A2E" }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-2.5 bg-white" style={{ borderBottom: "1px solid #F0F2F5" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-3.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: activeFilter === f ? "#00BAF2" : "#F4F6FA",
              color: activeFilter === f ? "#fff" : "#6B7280",
              border: `1.5px solid ${activeFilter === f ? "#00BAF2" : "#E8EBF0"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="px-4 pt-3 pb-6 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: "#9CA3AF" }}>
            No transactions found
          </div>
        ) : (
          filtered.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 bg-white rounded-2xl px-3.5 py-3"
              style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: txn.isDebit ? "#FFF3E0" : "#E8F5E9" }}
              >
                {txn.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: "#1A1A2E" }}>{txn.name}</div>
                <div className="text-[11px] flex items-center gap-1.5" style={{ color: "#9CA3AF" }}>
                  <span>{txn.desc}</span>
                  <span>·</span>
                  <span>{txn.date}, {txn.time}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="font-bold text-sm" style={{ color: txn.isDebit ? "#1A1A2E" : "#00C853" }}>
                  {txn.amount}
                </div>
                <div
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: txn.status === "Success" ? "#E8F5E9" : "#FFF9E0",
                    color: txn.status === "Success" ? "#00C853" : "#F5A623",
                  }}
                >
                  {txn.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
