import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/forge/docker/project/start
 * Starts the Docker-based mock server for the given project.
 * Body: plain text — the projectPath string returned by the scaffold endpoint.
 */
export async function POST(req: Request) {
  try {
    const projectPath = await req.text()

    const res = await fetch(`${BACKEND}/api/v1/forge/docker/project/start`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: projectPath,
    })

    // The upstream may return JSON or plain text; normalise to JSON
    const contentType = res.headers.get("content-type") ?? ""
    const data = contentType.includes("application/json")
      ? await res.json().catch(() => ({ status: res.status }))
      : { status: res.status, message: await res.text() }

    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start mock server" },
      { status: 502 }
    )
  }
}
