import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorBoundary } from "@/components/error-boundary"

// Suppress console.error noise from React error boundary logs
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

// A component that always throws — used to trigger the boundary
function BrokenChild() {
  throw new Error("deliberate test crash")
}

// A healthy component
function HealthyChild() {
  return <p>All good</p>
}

describe("ErrorBoundary", () => {
  it("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <HealthyChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("All good")).toBeDefined()
  })

  it("renders the fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("Something went wrong")).toBeDefined()
  })

  it("shows the error message in the details section", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    )
    // The <pre> inside <details> should contain the error message
    expect(screen.getByText("deliberate test crash")).toBeDefined()
  })

  it("renders a Try Again button in the fallback", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("Try Again")).toBeDefined()
  })

  it("renders a Reload Page button in the fallback", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    )
    expect(screen.getByText("Reload Page")).toBeDefined()
  })
})
