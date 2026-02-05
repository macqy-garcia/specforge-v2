import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/forge/architecture
 * Routes to the correct backend endpoint based on scaffoldType in the body:
 *   "ai"       → /api/v1/project-architecture/generate
 *   "standard" → /api/v1/project-architecture/fallback/generate
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const path =
      body.scaffoldType === "ai"
        ? "/api/v1/project-architecture/generate"
        : "/api/v1/project-architecture/fallback/generate"

    const res = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to call architecture endpoint" },
      { status: 502 }
    )
  }
}
