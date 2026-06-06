"use client";

import React from "react";

export interface ZubaanRecordProps {
  contractData: {
    service_description: string | null;
    contractor_name: string | null;
    customer_name: string | null;
    advance_amount: number | null;
    total_amount: number | null;
    completion_date: string | null;
    special_conditions: string | null;
  };
  transactionId: string;
  vaultId: string;
  timestamp: string;
  contractId: string;
}

export default function ZubaanRecordPDF({
  contractData,
  transactionId,
  vaultId,
  timestamp,
  contractId,
}: ZubaanRecordProps) {
  // Format timestamp for display
  const formattedTimestamp = (() => {
    const date = new Date(timestamp);
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

  const balanceDue = (contractData.total_amount || 0) - (contractData.advance_amount || 0);

  return (
    <div
      id="zubaan-record-pdf"
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: 390,
        background: "#FFFFFF",
        fontFamily: "system-ui, Arial, sans-serif",
        fontSize: 12,
        color: "#1A1A2E",
        margin: 0,
        padding: 0,
      }}
    >
      {/* SECTION 1 — HEADER BAR */}
      <div
        style={{
          background: "#0D1B3E",
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#00BAF2",
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: "-0.5px",
          }}
        >
          paytm
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          ZUBAAN RECORD
        </div>
      </div>
      <div
        style={{
          height: 2,
          background: "#00BAF2",
          width: "100%",
        }}
      />

      {/* SECTION 2 — META INFO */}
      <div
        style={{
          background: "#FFFFFF",
          padding: 16,
          borderBottom: "1px solid #E8EBF0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>
              CONTRACT ID
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "#0D1B3E",
                fontWeight: 600,
              }}
            >
              {contractId}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>
              GENERATED
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#0D1B3E",
                fontWeight: 600,
              }}
            >
              {formattedTimestamp}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>
              TRANSACTION ID
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#0D1B3E",
              }}
            >
              {transactionId}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>
              VAULT ID
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#0D1B3E",
              }}
            >
              {vaultId}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#00C48C",
              color: "#FFFFFF",
              padding: "4px 10px",
              borderRadius: 12,
              fontSize: 9,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>●</span> ADVANCE SECURED
          </div>
        </div>
      </div>

      {/* SECTION 3 — PARTIES */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: 16,
          borderBottom: "1px solid #E8EBF0",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid #DDE5F0",
            borderRadius: 8,
            padding: 12,
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>
            CONTRACTOR
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#0D1B3E",
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {contractData.contractor_name || "—"}
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>Party A</div>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #DDE5F0",
            borderRadius: 8,
            padding: 12,
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>
            CUSTOMER
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#0D1B3E",
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {contractData.customer_name || "—"}
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>Party B</div>
        </div>
      </div>

      {/* SECTION 4 — CONTRACT TERMS */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: "#0D1B3E", fontWeight: "bold", marginBottom: 10 }}>
          Contract Terms
        </div>

        {[
          { label: "Service Description", value: contractData.service_description || "—" },
          {
            label: "Total Contract Value",
            value: `₹${(contractData.total_amount || 0).toLocaleString("en-IN")}`,
          },
          {
            label: "Advance Amount",
            value: `₹${(contractData.advance_amount || 0).toLocaleString("en-IN")}`,
          },
          { label: "Balance Due", value: `₹${balanceDue.toLocaleString("en-IN")}` },
          { label: "Completion By", value: contractData.completion_date || "—" },
          {
            label: "Special Conditions",
            value: contractData.special_conditions || "None",
          },
        ].map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              background: idx % 2 === 0 ? "#F7F9FC" : "#FFFFFF",
              padding: 10,
              borderBottom: "1px solid #E8EBF0",
            }}
          >
            <div style={{ width: "40%", fontSize: 10, color: "#6B7280" }}>{row.label}</div>
            <div
              style={{
                width: "60%",
                fontSize: 11,
                color: "#0D1B3E",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 5 — PAYMENT CONFIRMATION BOX */}
      <div
        style={{
          background: "#EDFCF5",
          border: "1px solid #00C48C",
          borderRadius: 8,
          margin: 16,
          padding: 14,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "#00C48C",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              color: "#0D1B3E",
              fontWeight: "bold",
              marginBottom: 6,
            }}
          >
            ADVANCE OF ₹{(contractData.advance_amount || 0).toLocaleString("en-IN")} SECURED IN
            COMMITMENT VAULT
          </div>
          <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>
            Paytm Transaction: {transactionId}
          </div>
          <div style={{ fontSize: 10, color: "#6B7280" }}>Vault Reference: {vaultId}</div>
        </div>
      </div>

      {/* SECTION 6 — FOOTER */}
      <div
        style={{
          background: "#F7F9FC",
          padding: 14,
          borderTop: "1px solid #DDE5F0",
        }}
      >
        <div
          style={{
            height: 2,
            background: "#00BAF2",
            marginBottom: 10,
          }}
        />
        <div
          style={{
            fontSize: 8,
            color: "#6B7280",
            lineHeight: 1.6,
            marginBottom: 10,
          }}
        >
          This Zubaan Record is a digitally witnessed agreement created on the Paytm platform. It is
          not a legally enforceable contract. Both parties have confirmed these terms with individual
          timestamps.
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          Generated by Paytm Zubaan · Powered by Sarvam AI · {formattedTimestamp}
        </div>
      </div>
    </div>
  );
}
