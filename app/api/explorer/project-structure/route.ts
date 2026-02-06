import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/v1/project-structure/forge/docker/project/start
 * Proxies to the backend project-structure endpoint.
 * Returns the file-tree for the scaffolded project.
 */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/v1/project-structure/forge/docker/project/start`, {
      method: "POST",
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
