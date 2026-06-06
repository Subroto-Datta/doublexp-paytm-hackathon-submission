"use client";

import React, { ReactNode, Component, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Zubaan Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100dvh",
            backgroundColor: "#0D1B3E",
            color: "#fff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>😅</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
            Something went wrong
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#00BAF2",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Tap to restart
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
