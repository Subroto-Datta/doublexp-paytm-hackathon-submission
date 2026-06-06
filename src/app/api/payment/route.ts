import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment
 *
 * Receives JSON body:
 * {
 *   advance_amount: number,
 *   contractor_name: string,
 *   customer_name: string,
 *   service_description: string
 * }
 *
 * Always returns a successful payment response.
 * If DEMO_MODE or any real API call fails, returns mock success.
 */

interface PaymentRequest {
  advance_amount: number;
  contractor_name: string;
  customer_name: string;
  service_description: string;
}

interface PaymentResponse {
  success: true;
  transaction_id: string;
  amount: number;
  status: "SUCCESS";
  timestamp: string;
  vault_id: string;
}

function generateMockPaymentResponse(
  advanceAmount: number
): PaymentResponse {
  return {
    success: true,
    transaction_id: "PTM" + Date.now(),
    amount: advanceAmount,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    vault_id: "VLT" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };
}

async function initiatePaytmSandboxPayment(
  req: PaymentRequest
): Promise<PaymentResponse> {
  const paytmMerchantId = process.env.PAYTM_MERCHANT_ID;
  const paytmMerchantKey = process.env.PAYTM_MERCHANT_KEY;

  if (!paytmMerchantId || !paytmMerchantKey) {
    throw new Error("Paytm credentials not configured");
  }

  // This is a placeholder for actual Paytm integration
  // In production, you would:
  // 1. Generate checksum using merchant key
  // 2. Call Paytm Sandbox initiate transaction API
  // 3. Return the transaction ID from Paytm response
  //
  // For now, we'll just simulate the call
  console.log(
    "[Paytm Sandbox] Initiating payment for",
    req.contractor_name,
    "Amount:",
    req.advance_amount
  );

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  // In a real implementation:
  // const response = await fetch("https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ... })
  // });
  // const data = await response.json();
  // return { transaction_id: data.body.txnToken, ... };

  // For now, throw to trigger fallback
  throw new Error("Paytm integration not fully implemented");
}

export async function POST(req: NextRequest) {
  try {
    // Check for demo query param or env var
    const demoMode = req.nextUrl.searchParams.get("demo") === "true" || process.env.DEMO_MODE === "true";
    
    const body = (await req.json()) as PaymentRequest;

    const { advance_amount, contractor_name, customer_name } = body;

    // Validate required fields
    if (!advance_amount || !contractor_name || !customer_name) {
      console.warn("[Payment] Missing required fields");
      return NextResponse.json(
        generateMockPaymentResponse(advance_amount || 0),
        { status: 200 }
      );
    }

    // If demo mode, return mock response
    if (demoMode) {
      console.log("[Demo Mode] Returning mock payment response");
      return NextResponse.json(generateMockPaymentResponse(advance_amount), { status: 200 });
    }

    // Check demo mode
    if (process.env.DEMO_MODE === "true") {
      console.log("[Demo Mode] Returning mock payment response");
      return NextResponse.json(
        generateMockPaymentResponse(advance_amount),
        { status: 200 }
      );
    }

    // Try real Paytm call
    try {
      const paytmResponse = await initiatePaytmSandboxPayment(body);
      console.log("[Payment Success]", paytmResponse.transaction_id);
      return NextResponse.json(paytmResponse, { status: 200 });
    } catch (paytmErr) {
      // Silently fall back to mock response
      console.warn("[Paytm Sandbox Failed]", paytmErr);
      return NextResponse.json(
        generateMockPaymentResponse(advance_amount),
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[/api/payment Error]", err);

    // Even on unexpected error, return success response
    return NextResponse.json(
      generateMockPaymentResponse(0),
      { status: 200 }
    );
  }
}
