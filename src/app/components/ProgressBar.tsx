"use client";

import { useEffect, useState } from "react";

export function ProgressBar({ loading }: { loading: boolean }) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setWidth(0);
      
      // Animate to 85% over 1.5s
      const start = Date.now();
      const duration = 1500;
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min((elapsed / duration) * 85, 85);
        setWidth(progress);
      }, 16);
      
      return () => clearInterval(interval);
    } else {
      // Jump to 100%, then fade out
      setWidth(100);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible && width < 100) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: 3,
        width: `${width}%`,
        backgroundColor: "#00BAF2",
        opacity: !loading && width === 100 ? 0 : 1,
        transition: !loading ? "opacity 300ms ease-out" : "none",
      }}
    />
  );
}
