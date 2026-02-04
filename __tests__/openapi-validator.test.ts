import { describe, it, expect } from "vitest"
import { isValidUrl, validateOpenApiSpec, getSpecSummary } from "@/lib/openapi-validator"

// ---------------------------------------------------------------------------
// isValidUrl
// ---------------------------------------------------------------------------
describe("isValidUrl", () => {
  it("returns true for a well-formed https URL", () => {
    expect(isValidUrl("https://api.example.com/openapi.json")).toBe(true)
  })

  it("returns true for a well-formed http URL", () => {
    expect(isValidUrl("http://localhost:3000/spec")).toBe(true)
  })

  it("returns false for a plain string", () => {
    expect(isValidUrl("not-a-url")).toBe(false)
  })

  it("returns false for an empty string", () => {
    expect(isValidUrl("")).toBe(false)
  })

  it("returns false for a partial URL missing protocol", () => {
    expect(isValidUrl("example.com/spec")).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateOpenApiSpec — valid specs
// ---------------------------------------------------------------------------
describe("validateOpenApiSpec — valid inputs", () => {
  const minimalOpenApi3 = {
    openapi: "3.0.3",
    info: { title: "Pet Store", version: "1.0.0" },
    paths: { "/pets": {} },
  }

  const minimalSwagger2 = {
    swagger: "2.0",
    info: { title: "Pet Store", version: "2.0.0" },
    paths: { "/pets": {}, "/orders": {} },
  }

  it("validates a minimal OpenAPI 3.x spec", () => {
    const result = validateOpenApiSpec(minimalOpenApi3)
    expect(result.isValid).toBe(true)
    expect(result.type).toBe("openapi")
    expect(result.version).toBe("3.0.3")
    expect(result.specData).toBe(minimalOpenApi3)
  })

  it("validates a minimal Swagger 2.0 spec", () => {
    const result = validateOpenApiSpec(minimalSwagger2)
    expect(result.isValid).toBe(true)
    expect(result.type).toBe("swagger")
    expect(result.version).toBe("2.0")
  })
})

// ---------------------------------------------------------------------------
// validateOpenApiSpec — invalid specs
// ---------------------------------------------------------------------------
describe("validateOpenApiSpec — invalid inputs", () => {
  it("rejects null", () => {
    expect(validateOpenApiSpec(null).isValid).toBe(false)
  })

  it("rejects a non-object", () => {
    expect(validateOpenApiSpec("hello").isValid).toBe(false)
  })

  it("rejects an object with neither openapi nor swagger field", () => {
    const result = validateOpenApiSpec({ foo: "bar" })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/must be OpenAPI 3\.x/)
  })

  it("rejects OpenAPI 3.x missing info", () => {
    const result = validateOpenApiSpec({ openapi: "3.0.0", paths: {} })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/info/)
  })

  it("rejects OpenAPI 3.x with info but missing title", () => {
    const result = validateOpenApiSpec({ openapi: "3.0.0", info: { version: "1" }, paths: {} })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/info\.title/)
  })

  it("rejects OpenAPI 3.x with info but missing version", () => {
    const result = validateOpenApiSpec({ openapi: "3.0.0", info: { title: "X" }, paths: {} })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/info\.version/)
  })

  it("rejects OpenAPI 3.x missing paths", () => {
    const result = validateOpenApiSpec({ openapi: "3.0.0", info: { title: "X", version: "1" } })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/paths/)
  })

  it("rejects Swagger 2.0 missing info", () => {
    const result = validateOpenApiSpec({ swagger: "2.0", paths: {} })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/info/)
  })

  it("rejects Swagger 2.0 missing paths", () => {
    const result = validateOpenApiSpec({ swagger: "2.0", info: { title: "X", version: "1" } })
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/paths/)
  })
})

// ---------------------------------------------------------------------------
// getSpecSummary
// ---------------------------------------------------------------------------
describe("getSpecSummary", () => {
  it("returns null for null input", () => {
    expect(getSpecSummary(null)).toBeNull()
  })

  it("returns null when info is missing", () => {
    expect(getSpecSummary({ openapi: "3.0.0" })).toBeNull()
  })

  it("returns correct summary for a valid spec", () => {
    const spec = {
      info: { title: "Orders API", version: "2.1.0", description: "Handles orders" },
      paths: { "/orders": {}, "/orders/{id}": {}, "/orders/summary": {} },
    }
    const summary = getSpecSummary(spec)
    expect(summary).toEqual({
      title: "Orders API",
      version: "2.1.0",
      description: "Handles orders",
      pathCount: 3,
    })
  })

  it("defaults title to Untitled when missing", () => {
    const summary = getSpecSummary({ info: { version: "1" } })
    expect(summary?.title).toBe("Untitled")
  })

  it("defaults version to Unknown when missing", () => {
    const summary = getSpecSummary({ info: { title: "X" } })
    expect(summary?.version).toBe("Unknown")
  })

  it("returns pathCount 0 when paths is absent", () => {
    const summary = getSpecSummary({ info: { title: "X", version: "1" } })
    expect(summary?.pathCount).toBe(0)
  })
})
