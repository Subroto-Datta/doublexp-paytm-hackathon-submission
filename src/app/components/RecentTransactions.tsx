"use client";

const TRANSACTIONS = [
  {
    id: 1,
    name: "Amazon Pay",
    desc: "Online Shopping",
    amount: "-₹1,249",
    isDebit: true,
    time: "Today, 10:32 AM",
    emoji: "🛒",
    bg: "#FFF3E0",
    color: "#FF6D00",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    desc: "Money received",
    amount: "+₹500",
    isDebit: false,
    time: "Yesterday, 7:15 PM",
    emoji: "👤",
    bg: "#E8F5E9",
    color: "#00C853",
  },
  {
    id: 3,
    name: "BSES Electricity",
    desc: "Electricity Bill",
    amount: "-₹2,350",
    isDebit: true,
    time: "3 Jun, 9:00 AM",
    emoji: "⚡",
    bg: "#FFF9E0",
    color: "#F5A623",
  },
  {
    id: 4,
    name: "Zomato",
    desc: "Food Order",
    amount: "-₹348",
    isDebit: true,
    time: "2 Jun, 1:45 PM",
    emoji: "🍛",
    bg: "#FFEBEE",
    color: "#F44336",
  },
];

export default function RecentTransactions({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  return (
    <div className="mb-5">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="font-bold text-sm" style={{ color: "#1A1A2E" }}>
          Recent Transactions
        </h2>
        <button 
          onClick={() => { if (onTabChange) onTabChange("history"); }}
          className="text-xs font-semibold active:scale-95 transition-transform" 
          style={{ color: "#00BAF2" }}
        >
          View All
        </button>
      </div>

      <div className="px-4 flex flex-col gap-2">
        {TRANSACTIONS.map((txn, idx) => (
          <div
            key={txn.id}
            className="txn-item flex items-center gap-3 rounded-2xl px-3.5 py-3"
            style={{
              background: "#FAFBFD",
              border: "1px solid #F0F2F5",
              animationDelay: `${idx * 60}ms`,
            }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: txn.bg }}
            >
              {txn.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: "#1A1A2E" }}>
                {txn.name}
              </div>
              <div className="text-[11px] truncate" style={{ color: "#9CA3AF" }}>
                {txn.desc} · {txn.time}
              </div>
            </div>

            {/* Amount */}
            <div
              className="font-bold text-sm flex-shrink-0"
              style={{ color: txn.isDebit ? "#1A1A2E" : "#00C853" }}
            >
              {txn.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
