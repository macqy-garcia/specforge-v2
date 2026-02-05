import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/explorer/openapi
 * Registers the OpenAPI spec with the mock-server backend.
 * Body: { openapi: string (pathToFile), mockMode: "faker" | "ai" | "hybrid" }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${BACKEND}/api/v1/openapi`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to register OpenAPI spec" },
      { status: 502 }
    )
  }
}
