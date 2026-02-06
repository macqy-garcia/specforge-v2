import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/explorer/endpoints
 * Fetches the list of API endpoints from the backend mock server.
 * Transforms the mockMode from frontend format to backend format.
 */

export interface ExplorerEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  hasAI?: boolean
  status?: "SERVER_STOPPED" | "OPEN" | "RUNNING" | "ERROR"
}

// ---------------------------------------------------------------------------
// POST /api/explorer/endpoints
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Transform mockMode: frontend sends "faker" | "ai" | "hybrid"
    // Backend expects "FAKER" | "AI" | "HYBRID"
    const mockModeMap: Record<string, string> = {
      "faker": "FAKER",
      "ai": "AI",
      "hybrid": "HYBRID"
    }

    const mockMode = mockModeMap[body.mockMode?.toLowerCase() ?? "faker"] ?? "FAKER"

    const requestBody = {
      mockMode
    }

    console.log("📤 Sending to /mock-server/openapi:", JSON.stringify(requestBody, null, 2))

    const res = await fetch(`${BACKEND}/mock-server/openapi`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(requestBody),
    })

    const data = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }))

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? `Backend returned ${res.status}` },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch endpoints" },
      { status: 502 }
    )
  }
}
