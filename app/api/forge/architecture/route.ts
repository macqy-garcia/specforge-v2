import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/forge/architecture
 * Routes to the correct backend endpoint based on scaffoldType in the body:
 *   "ai"       → /api/v1/project-architecture/generate
 *   "standard" → /api/v1/project-architecture/fallback/generate
 *
 * Transforms the request body to match backend expectations.
 */
export async function POST(req: Request) {
  try {
    const projectData = await req.json()

    const isAI = projectData.scaffoldType === "ai"
    const path = isAI
      ? "/api/v1/project-architecture/generate"
      : "/api/v1/project-architecture/fallback/generate"

    // Transform request body based on the endpoint
    const requestBody = isAI
      ? {
          // AI endpoint - send full projectData (placeholder for now, update when you provide AI endpoint details)
          ...projectData
        }
      : {
          // Standard (fallback) endpoint - only needs packageName
          packageName: projectData.techOptions?.basePackage ?? "com.example.demo"
        }

    console.log(`📤 Sending to ${path}:`, JSON.stringify(requestBody, null, 2))

    const res = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(requestBody),
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
