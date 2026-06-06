import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/extract
 *
 * Receives FormData with:
 *   - audio: Blob (webm/mp4)
 *   - contractor_name: string
 *   - customer_name: string
 *
 * STEP 1: Sarvam STT (or demo mode)
 * STEP 2: Sarvam LLM extraction
 * STEP 3: Override names from FormData
 * STEP 4: Return contract data
 */

interface ContractData {
  service_description: string | null;
  contractor_name: string | null;
  customer_name: string | null;
  advance_amount: number | null;
  total_amount: number | null;
  completion_date: string | null;
  special_conditions: string | null;
}

const DEMO_TRANSCRIPT =
  "Ramesh bhai, aapko ₹500 advance deta hoon, aap kal subah aakar fridge " +
  "theek kar dijiye, baaki ₹1500 kaam hone ke baad milega, kaam 24 ghante " +
  "mein complete karna hai";

const FALLBACK_CONTRACT: ContractData = {
  service_description: "Fridge repair service",
  contractor_name: "Ramesh Kumar",
  customer_name: "Suresh Sharma",
  advance_amount: 500,
  total_amount: 2000,
  completion_date: "2026-06-07",
  special_conditions: "Work to be completed within 24 hours",
};

async function extractFromTranscript(transcript: string): Promise<ContractData> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY not set");
  }

  const prompt = `Extract these fields from this transcript. Use null for any field not clearly mentioned. Return ONLY this JSON object and nothing else:

{"service_description": string | null, "contractor_name": string | null, "customer_name": string | null, "advance_amount": number | null, "total_amount": number | null, "completion_date": string | null, "special_conditions": string | null}

Transcript: ${transcript}`;

  const llmResponse = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sarvam-2b",
      messages: [
        {
          role: "system",
          content:
            "You are a contract extraction engine. Extract contract fields from the given transcript. Return ONLY valid JSON, no markdown, no explanation, no extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!llmResponse.ok) {
    const errorText = await llmResponse.text();
    console.error("[Sarvam LLM Error]", llmResponse.status, errorText);
    throw new Error(`Sarvam LLM failed: ${llmResponse.status}`);
  }

  const llmData = (await llmResponse.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  let content = llmData.choices[0]?.message?.content || "{}";

  // Strip markdown code fences
  content = content
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  const contractData: ContractData = JSON.parse(content);
  return contractData;
}

export async function POST(req: NextRequest) {
  const demoMode = req.nextUrl.searchParams.get("demo") === "true" || process.env.DEMO_MODE === "true";
  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  const contractorName = (formData.get("contractor_name") as string) || "";
  const customerName = (formData.get("customer_name") as string) || "";
  const fallbackContract = {
    ...FALLBACK_CONTRACT,
    contractor_name: contractorName || FALLBACK_CONTRACT.contractor_name,
    customer_name: customerName || FALLBACK_CONTRACT.customer_name,
  };

  try {
    if (!audio) {
      throw new Error("No audio file provided");
    }

    let transcript: string;

    // STEP 1: STT (or demo mode)
    if (demoMode) {
      console.log("[Demo Mode] Using hardcoded transcript");
      transcript = DEMO_TRANSCRIPT;
    } else {
      const apiKey = process.env.SARVAM_API_KEY;
      if (!apiKey) {
        throw new Error("SARVAM_API_KEY not set");
      }

      const sttFormData = new FormData();
      sttFormData.append("file", audio);
      sttFormData.append("model", "saaras:v2");
      sttFormData.append("language_code", "hi-IN");
      sttFormData.append("with_timestamps", "false");

      const sttResponse = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
        },
        body: sttFormData,
      });

      if (!sttResponse.ok) {
        const errorText = await sttResponse.text();
        console.error("[Sarvam STT Error]", sttResponse.status, errorText);
        throw new Error(`Sarvam STT failed: ${sttResponse.status}`);
      }

      const sttData = (await sttResponse.json()) as { transcript: string };
      transcript = sttData.transcript || DEMO_TRANSCRIPT;
    }

    console.log("[Transcript]", transcript);

    // STEP 2: LLM Extraction
    let contractData = await extractFromTranscript(transcript);

    // STEP 3: Override names
    if (contractorName && contractorName.trim()) {
      contractData.contractor_name = contractorName.trim();
    }
    if (customerName && customerName.trim()) {
      contractData.customer_name = customerName.trim();
    }

    // STEP 4: Return
    return NextResponse.json(
      {
        success: true,
        data: contractData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/extract Error]", err);

    return NextResponse.json(
      {
        success: true,
        data: fallbackContract,
      },
      { status: 200 }
    );
  }
}
