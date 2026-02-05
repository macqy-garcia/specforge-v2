import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * Catch-all proxy for the mock server.
 * Any request to /api/mock-server/{anything} is forwarded to
 * http://localhost:8080/mock-server/{anything} preserving the original method,
 * query string, and body.
 */

function forwardRequest(req: Request, path: string[]) {
  const upstreamUrl = `${BACKEND}/mock-server/${path.join("/")}`
  // Preserve query string if present
  const url = new URL(req.url)
  const search = url.search // includes the leading "?" if non-empty
  const target = `${upstreamUrl}${search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    // Strip Next.js / host headers that would confuse the upstream
    if (!["host", "next-router-state-tree", "next-router-prefetch"].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  return fetch(target, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    // @ts-expect-error — duplex is required for streaming bodies in Node 18+
    duplex: "half",
  })
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  try {
    const res = await forwardRequest(req, path)
    const data = await res.json().catch(() => ({ error: `Mock server returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mock server unreachable" },
      { status: 502 }
    )
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  try {
    const res = await forwardRequest(req, path)
    const data = await res.json().catch(() => ({ error: `Mock server returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mock server unreachable" },
      { status: 502 }
    )
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  try {
    const res = await forwardRequest(req, path)
    const data = await res.json().catch(() => ({ error: `Mock server returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mock server unreachable" },
      { status: 502 }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  try {
    const res = await forwardRequest(req, path)
    const data = await res.json().catch(() => ({ error: `Mock server returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mock server unreachable" },
      { status: 502 }
    )
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  try {
    const res = await forwardRequest(req, path)
    const data = await res.json().catch(() => ({ error: `Mock server returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mock server unreachable" },
      { status: 502 }
    )
  }
}
