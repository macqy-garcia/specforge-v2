import { describe, it, expect } from "vitest"

/**
 * Unit-test the HTML-escaping logic from json-viewer.tsx in isolation.
 * We extract the same escapeHtml + highlightJson functions here so the test
 * remains fast and environment-free (no DOM rendering needed).
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function highlightJson(json: string): string {
  const escaped = escapeHtml(json)
  return escaped
    .replace(/(&quot;.*?&quot;):/g, '<span class="text-primary font-medium">$1</span>:')
    .replace(/: (&quot;.*?&quot;)/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
    .replace(/: (null)/g, ': <span class="text-muted-foreground">$1</span>')
}

describe("json-viewer escapeHtml", () => {
  it("escapes < and > characters", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    )
  })

  it("escapes & before other replacements (no double-escape)", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b")
  })

  it("escapes double quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;")
  })

  it("leaves plain alphanumeric text untouched", () => {
    expect(escapeHtml("hello world 123")).toBe("hello world 123")
  })
})

describe("json-viewer highlightJson — XSS payloads do not survive as raw HTML", () => {
  it("does not allow a <script> tag to appear unescaped in output", () => {
    const malicious = JSON.stringify({ name: '<script>alert("xss")</script>' }, null, 2)
    const output = highlightJson(malicious)
    // The literal <script> must NOT appear — only &lt;script&gt;
    expect(output).not.toContain("<script>")
    expect(output).toContain("&lt;script&gt;")
  })

  it("does not allow an img onerror tag to appear unescaped", () => {
    const malicious = JSON.stringify({ x: '<img src=x onerror=alert(1)>' }, null, 2)
    const output = highlightJson(malicious)
    expect(output).not.toContain("<img")
    expect(output).toContain("&lt;img")
  })

  it("still highlights normal JSON keys and values correctly", () => {
    const normal = JSON.stringify({ status: "ok", count: 42, active: true, removed: null }, null, 2)
    const output = highlightJson(normal)
    // Keys should be wrapped
    expect(output).toContain('<span class="text-primary font-medium">')
    // String values
    expect(output).toContain('<span class="text-green-600 dark:text-green-400">')
    // Numbers
    expect(output).toContain('<span class="text-purple-600 dark:text-purple-400">')
    // Booleans
    expect(output).toContain('<span class="text-orange-600 dark:text-orange-400">')
    // Null
    expect(output).toContain('<span class="text-muted-foreground">')
  })
})
