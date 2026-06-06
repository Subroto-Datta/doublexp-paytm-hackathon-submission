"use client";

// SVG Icons for bottom nav
const NavIcons = {
  Home: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12L12 3L21 12"
        stroke="currentColor"
        strokeWidth={filled ? "2" : "1.8"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10V20C5 20.55 5.45 21 6 21H9V16C9 15.45 9.45 15 10 15H14C14.55 15 15 15.45 15 16V21H18C18.55 21 19 20.55 19 20V10"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? "0" : "1.8"}
        strokeLinecap="round"
      />
    </svg>
  ),
  Pay: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill={filled ? "currentColor" : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill={filled ? "currentColor" : "none"} />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill={filled ? "currentColor" : "none"} />
      <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="18" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="14" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="18" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
    </svg>
  ),
  History: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill={filled ? "currentColor" : "none"} />
      <path
        d="M12 7V12L15 15"
        stroke={filled ? "white" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Offers: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.58 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={filled ? "currentColor" : "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" fill={filled ? "white" : "currentColor"} />
    </svg>
  ),
  Profile: ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" fill={filled ? "currentColor" : "none"} />
      <path
        d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),
};

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", label: "Home", Icon: NavIcons.Home },
  { id: "pay", label: "Pay", Icon: NavIcons.Pay },
  { id: "history", label: "History", Icon: NavIcons.History },
  { id: "offers", label: "Offers", Icon: NavIcons.Offers, badge: true },
  { id: "profile", label: "Profile", Icon: NavIcons.Profile },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="flex-shrink-0 flex items-center bg-white border-t"
      style={{
        borderColor: "#E8EBF0",
        height: 60,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`nav-tab ${isActive ? "active" : ""} flex-1 flex flex-col items-center justify-center gap-0.5 relative`}
            style={{ color: isActive ? "#00BAF2" : "#9CA3AF" }}
          >
            {tab.badge && !isActive && (
              <div className="nav-badge" />
            )}
            <tab.Icon filled={isActive} />
            <span
              className="font-semibold"
              style={{ fontSize: 10, color: isActive ? "#00BAF2" : "#9CA3AF" }}
            >
              {tab.label}
            </span>
            {/* Active underline dot */}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: 24, height: 2.5, background: "#00BAF2", top: 0 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
