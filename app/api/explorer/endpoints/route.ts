import { NextResponse } from "next/server"

/**
 * Mock API – returns the list of API endpoints for the explorer.
 * Replace the body of GET with a call to the real upstream service
 * once it is deployed; the shape stays the same.
 */

export interface ExplorerEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  hasAI?: boolean
  status?: "SERVER_STOPPED" | "OPEN" | "RUNNING" | "ERROR"
}

const ENDPOINTS: ExplorerEndpoint[] = [
  {
    method: "GET",
    path: "/api/mock/hello",
    description: "Simple health check and greeting endpoint.",
    status: "SERVER_STOPPED"
  },
  {
    method: "GET",
    path: "/api/mock/users",
    description: "Retrieves a list of mock users with AI-enhanced recommendations.",
    hasAI: true,
    status: "SERVER_STOPPED"
  },
  {
    method: "POST",
    path: "/api/mock/order",
    description: "Creates a new mock order and triggers fulfillment logic.",
    status: "SERVER_STOPPED"
  },
  {
    method: "DELETE",
    path: "/api/mock/users/{id}",
    description: "Deletes a specific user from the mock database.",
    status: "SERVER_STOPPED"
  }
]

// ---------------------------------------------------------------------------
// GET /api/explorer/endpoints
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json(ENDPOINTS)
}
