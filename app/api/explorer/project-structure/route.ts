import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * GET /api/explorer/project-structure
 * Proxies to the backend project-structure endpoint.
 * Returns the file-tree for the scaffolded project.
 */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/v1/project-architecture/project-structure`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    const data = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch project structure" },
      { status: 502 }
    )
  }
}
