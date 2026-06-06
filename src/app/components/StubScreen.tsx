"use client";

// QR Code icon
function QRIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="#00BAF2" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="#00BAF2" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="#00BAF2" strokeWidth="1.5" />
      <rect x="5.5" y="5.5" width="2" height="2" fill="#00BAF2" />
      <rect x="16.5" y="5.5" width="2" height="2" fill="#00BAF2" />
      <rect x="5.5" y="16.5" width="2" height="2" fill="#00BAF2" />
      <rect x="14" y="14" width="2" height="2" fill="#00BAF2" />
      <rect x="17" y="14" width="2" height="2" fill="#00BAF2" />
      <rect x="14" y="17" width="2" height="2" fill="#00BAF2" />
      <rect x="17" y="17" width="2" height="2" fill="#00BAF2" />
      <rect x="20" y="14" width="1" height="1" fill="#00BAF2" />
      <rect x="20" y="20" width="1" height="1" fill="#00BAF2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#00BAF2" strokeWidth="1.5" />
      <path d="M12 7V12L15.5 14.5" stroke="#00BAF2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.58 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z"
        stroke="#00BAF2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" fill="#00BAF2" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#00BAF2" strokeWidth="1.5" />
      <path d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20" stroke="#00BAF2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const STUBS: Record<string, { title: string; subtitle: string; Icon: React.FC; cta: string }> = {
  pay: {
    title: "Scan & Pay",
    subtitle: "Scan any UPI QR code to make instant payments",
    Icon: QRIcon,
    cta: "Open Scanner",
  },
  history: {
    title: "Transaction History",
    subtitle: "All your payments, transfers and receipts in one place",
    Icon: ClockIcon,
    cta: "View All Transactions",
  },
  offers: {
    title: "Exclusive Offers",
    subtitle: "Cashbacks, coupons and deals crafted just for you",
    Icon: TagIcon,
    cta: "Explore Offers",
  },
  profile: {
    title: "Your Profile",
    subtitle: "Manage your account, KYC, and Paytm settings",
    Icon: PersonIcon,
    cta: "View Profile",
  },
};

export default function StubScreen({ tab }: { tab: string }) {
  const stub = STUBS[tab];
  if (!stub) return null;
  const { title, subtitle, Icon, cta } = stub;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 slide-up">
      {/* Illustration circle */}
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center"
        style={{ background: "#E6F9FF" }}
      >
        <Icon />
      </div>

      <div>
        <div className="font-extrabold text-xl mb-2" style={{ color: "#1A1A2E" }}>
          {title}
        </div>
        <div className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          {subtitle}
        </div>
      </div>

      <button
        className="px-8 py-3 rounded-2xl font-bold text-sm text-white"
        style={{ background: "linear-gradient(135deg, #00BAF2, #0097C7)" }}
      >
        {cta}
      </button>

      <div className="text-xs" style={{ color: "#D1D5DB" }}>
        Coming soon in this demo
      </div>
    </div>
  );
}
