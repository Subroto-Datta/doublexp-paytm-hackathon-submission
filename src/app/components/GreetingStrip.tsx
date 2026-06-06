"use client";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="#F5A623"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#9C27B0" stroke="#9C27B0" strokeWidth="1.5"/>
    </svg>
  );
}

function EveningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 17L3.27 6.96A10 10 0 0112 2a10 10 0 018.73 4.96L12 17z" fill="#FF6D00"/>
      <path d="M3 17h18" stroke="#FF6D00" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function getGreeting(): { text: string; Icon: React.FC } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", Icon: SunIcon };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", Icon: SunIcon };
  if (hour >= 17 && hour < 21) return { text: "Good Evening", Icon: EveningIcon };
  return { text: "Good Night", Icon: MoonIcon };
}

export default function GreetingStrip() {
  const { text, Icon } = getGreeting();

  return (
    <div
      className="mx-4 mb-4 px-4 py-3 rounded-2xl flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, #fff 0%, #F0FAFF 100%)",
        border: "1px solid #E8EBF0",
      }}
    >
      <div className="flex items-center gap-2">
        <Icon />
        <div>
          <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>
            {text},&nbsp;
          </span>
          <span className="text-xs font-bold" style={{ color: "#002970" }}>
            Saurabh 👋
          </span>
        </div>
      </div>

      {/* UPI Lite pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: "#E6F9FF", border: "1px solid #00BAF240" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00BAF2" }} />
        <span className="text-[10px] font-bold" style={{ color: "#00BAF2" }}>
          UPI Lite ON
        </span>
      </div>
    </div>
  );
}
