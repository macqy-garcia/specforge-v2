import { NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

/**
 * POST /api/forge/scaffold
 * Transforms the frontend projectData into the backend's expected scaffold format.
 */
export async function POST(req: Request) {
  try {
    const projectData = await req.json()

    // Transform frontend projectData to backend scaffold format
    const scaffoldRequest = {
      groupId: projectData.techOptions?.groupId ?? "com.example",
      artifactId: projectData.techOptions?.artifactId ?? "demo",
      name: projectData.projectInfo?.projectName ?? "DemoService",
      description: projectData.projectInfo?.description ?? "",
      packageName: projectData.techOptions?.basePackage ?? "com.example.demo",
      type: projectData.techOptions?.buildTool === "gradle" ? "gradle-project" : "maven-project",
      language: projectData.techOptions?.language ?? "java",
      javaVersion: projectData.techOptions?.javaVersion ?? "17",
      bootVersion: projectData.techOptions?.springBootVersion ?? "3.2.3",
      packaging: "jar",
      dependencies: projectData.techOptions?.dependencies ?? [],
      observability: projectData.techOptions?.observability
    }

    const res = await fetch(`${BACKEND}/api/v1/forge/scaffold`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(scaffoldRequest),
    })

    const data = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to call scaffold endpoint" },
      { status: 502 }
    )
  }
}
