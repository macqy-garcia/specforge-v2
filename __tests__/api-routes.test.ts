import { describe, it, expect } from "vitest"

// ---------------------------------------------------------------------------
// Import the raw data constants by re-exporting via the route modules.
// Next.js API route GET handlers return NextResponse; we call them directly
// and inspect the JSON body.
// ---------------------------------------------------------------------------

// We need to mock NextResponse.json so we can capture the payload without
// actually running the Next.js server.
import { vi } from "vitest"

// Minimal NextResponse.json mock that captures the data
let lastPayload: unknown
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown) => {
      lastPayload = data
      return data
    },
  },
}))

// ---------------------------------------------------------------------------
// GET /api/build-steps
// ---------------------------------------------------------------------------
describe("GET /api/build-steps", async () => {
  const { GET } = await import("@/app/api/build-steps/route")

  it("returns an array", async () => {
    await GET()
    expect(Array.isArray(lastPayload)).toBe(true)
  })

  it("returns exactly 8 build steps", async () => {
    await GET()
    expect((lastPayload as any[]).length).toBe(8)
  })

  it("each step has id, label, description, apiEndpoint", async () => {
    await GET()
    const steps = lastPayload as any[]
    steps.forEach((step) => {
      expect(step).toHaveProperty("id")
      expect(typeof step.id).toBe("number")
      expect(step).toHaveProperty("label")
      expect(typeof step.label).toBe("string")
      expect(step).toHaveProperty("description")
      expect(typeof step.description).toBe("string")
      expect(step).toHaveProperty("apiEndpoint")
      expect(typeof step.apiEndpoint).toBe("string")
    })
  })

  it("step ids are sequential 1–8", async () => {
    await GET()
    const ids = (lastPayload as any[]).map((s) => s.id)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})

// ---------------------------------------------------------------------------
// GET /api/explorer/file-tree
// ---------------------------------------------------------------------------
describe("GET /api/explorer/file-tree", async () => {
  const { GET } = await import("@/app/api/explorer/file-tree/route")

  it("returns an array", async () => {
    await GET()
    expect(Array.isArray(lastPayload)).toBe(true)
  })

  it("every node has name and type", async () => {
    await GET()
    const checkNode = (node: any) => {
      expect(node).toHaveProperty("name")
      expect(typeof node.name).toBe("string")
      expect(node).toHaveProperty("type")
      expect(["file", "folder"]).toContain(node.type)
      if (node.children) {
        expect(Array.isArray(node.children)).toBe(true)
        node.children.forEach(checkNode)
      }
    }
    ;(lastPayload as any[]).forEach(checkNode)
  })

  it("contains a pom.xml file at the root level", async () => {
    await GET()
    const root = lastPayload as any[]
    const pomNode = root.find((n: any) => n.name === "pom.xml" && n.type === "file")
    expect(pomNode).toBeDefined()
  })

  it("contains a src folder at the root level", async () => {
    await GET()
    const root = lastPayload as any[]
    const srcNode = root.find((n: any) => n.name === "src" && n.type === "folder")
    expect(srcNode).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// GET /api/explorer/endpoints
// ---------------------------------------------------------------------------
describe("GET /api/explorer/endpoints", async () => {
  const { GET } = await import("@/app/api/explorer/endpoints/route")

  const VALID_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]

  it("returns an array", async () => {
    await GET()
    expect(Array.isArray(lastPayload)).toBe(true)
  })

  it("returns at least 2 endpoints", async () => {
    await GET()
    expect((lastPayload as any[]).length).toBeGreaterThanOrEqual(2)
  })

  it("every endpoint has method, path, description", async () => {
    await GET()
    ;(lastPayload as any[]).forEach((ep: any) => {
      expect(ep).toHaveProperty("method")
      expect(VALID_METHODS).toContain(ep.method)
      expect(ep).toHaveProperty("path")
      expect(typeof ep.path).toBe("string")
      expect(ep.path.startsWith("/")).toBe(true)
      expect(ep).toHaveProperty("description")
      expect(typeof ep.description).toBe("string")
    })
  })

  it("status field, when present, is a known value", async () => {
    await GET()
    const VALID_STATUSES = ["SERVER_STOPPED", "OPEN", "RUNNING", "ERROR"]
    ;(lastPayload as any[]).forEach((ep: any) => {
      if (ep.status !== undefined) {
        expect(VALID_STATUSES).toContain(ep.status)
      }
    })
  })
})
