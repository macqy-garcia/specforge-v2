import { NextResponse } from "next/server"

/**
 * Mock API – returns the build-pipeline step definitions.
 * Replace the body of GET with a call to the real upstream service
 * once it is deployed; the shape stays the same.
 */

export interface BuildStep {
  id: number
  label: string
  description: string
  apiEndpoint: string
}

const BUILD_STEPS: BuildStep[] = [
  {
    id: 1,
    label: "Initializing Project",
    description: "Setting up project structure",
    apiEndpoint: "/api/initialize",
  },
  {
    id: 2,
    label: "Generating Code",
    description: "Creating source files from specification",
    apiEndpoint: "/api/generate-code",
  },
  {
    id: 3,
    label: "Installing Dependencies",
    description: "Installing project dependencies",
    apiEndpoint: "/api/install-deps",
  },
  {
    id: 4,
    label: "Building Project",
    description: "Compiling and building the project",
    apiEndpoint: "/api/build",
  },
  {
    id: 5,
    label: "Running Tests",
    description: "Executing test suites",
    apiEndpoint: "/api/test",
  },
  {
    id: 6,
    label: "Generating Documentation",
    description: "Creating API documentation",
    apiEndpoint: "/api/docs",
  },
  {
    id: 7,
    label: "Setting up CI/CD",
    description: "Configuring continuous integration",
    apiEndpoint: "/api/cicd",
  },
  {
    id: 8,
    label: "Finalizing",
    description: "Completing project setup",
    apiEndpoint: "/api/finalize",
  },
]

// ---------------------------------------------------------------------------
// GET /api/build-steps
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json(BUILD_STEPS)
}
