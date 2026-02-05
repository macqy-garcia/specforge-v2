"use client"

import * as React from "react"
import { FileTree, FileNode } from "@/components/ui/file-tree"
import { ApiEndpointItem, ApiEndpoint } from "@/components/ui/api-endpoint-item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, ChevronDown, Search, RotateCcw, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { HappyPathToggle } from "@/components/happy-path-toggle"
import { useHappyPath } from "@/components/happy-path-context"
import type { ExplorerEndpoint } from "@/app/api/explorer/endpoints/route"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type MockMode = "faker" | "ai" | "hybrid"

/** Shape returned by the mock server for list endpoints */
interface MockServerResponse {
  data: {
    items: Record<string, any>[]
    page?: number
    pageSize?: number
    total?: number
  }
  _provenance?: Record<string, string> // e.g. "items[0].name" → "AI"
}

interface ApiTestingStepProps {
  projectName?: string
  /** The projectPath returned by scaffold — used to start the Docker mock server */
  projectPath?: string
  /** The mock engine chosen on Step 3 (faker | ai | hybrid) */
  mockMode?: MockMode
  /** Same as projectPath; also used as the openapi file path for the backend */
  pathToFile?: string
  onBack?: () => void
  onNewProject?: () => void
}

// ---------------------------------------------------------------------------
// Happy-path fallback data (used when the toggle is ON)
// ---------------------------------------------------------------------------
// Raw backend shape — uppercase type, null children. normaliseFileTree()
// converts this to FileNode[] at the point it's consumed.
const HAPPY_PATH_FILE_TREE = [
  {
    "name": "src",
    "type": "FOLDER",
    "children": [
      {
        "name": "main",
        "type": "FOLDER",
        "children": [
          {
            "name": "java",
            "type": "FOLDER",
            "children": [
              {
                "name": "com",
                "type": "FOLDER",
                "children": [
                  {
                    "name": "example",
                    "type": "FOLDER",
                    "children": [
                      {
                        "name": "application",
                        "type": "FOLDER",
                        "children": [
                          {
                            "name": "Application.java",
                            "type": "FILE",
                            "children": null
                          },
                          {
                            "name": "config",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "SecurityConfig.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "DatabaseConfig.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "controller",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "UserController.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "ProductController.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "service",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "UserService.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "ProductService.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "repository",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "UserRepository.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "ProductRepository.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "model",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "User.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "Product.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "dto",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "UserDTO.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "ProductDTO.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          },
                          {
                            "name": "util",
                            "type": "FOLDER",
                            "children": [
                              {
                                "name": "DateUtil.java",
                                "type": "FILE",
                                "children": null
                              },
                              {
                                "name": "StringUtil.java",
                                "type": "FILE",
                                "children": null
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "resources",
            "type": "FOLDER",
            "children": [
              {
                "name": "application",
                "type": "FOLDER",
                "children": [
                  {
                    "name": "application-dev.yaml",
                    "type": "FILE",
                    "children": null
                  },
                  {
                    "name": "application.properties",
                    "type": "FILE",
                    "children": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": ".DS_Store",
    "type": "FILE",
    "children": null
  },
  {
    "name": ".dockerignore",
    "type": "FILE",
    "children": null
  },
  {
    "name": ".gitattributes",
    "type": "FILE",
    "children": null
  },
  {
    "name": ".gitignore",
    "type": "FILE",
    "children": null
  },
  {
    "name": "maven-wrapper.properties",
    "type": "FILE",
    "children": null
  },
  {
    "name": "Dockerfile",
    "type": "FILE",
    "children": null
  },
  {
    "name": "HELP.md",
    "type": "FILE",
    "children": null
  },
  {
    "name": "Makefile",
    "type": "FILE",
    "children": null
  },
  {
    "name": "docker-compose.amd64.yml",
    "type": "FILE",
    "children": null
  },
  {
    "name": "docker-compose.arm64.yml",
    "type": "FILE",
    "children": null
  },
  {
    "name": "mvnw",
    "type": "FILE",
    "children": null
  },
  {
    "name": "mvnw.cmd",
    "type": "FILE",
    "children": null
  },
  {
    "name": "pom.xml",
    "type": "FILE",
    "children": null
  }
]

const HAPPY_PATH_ENDPOINTS: ApiEndpoint[] = [
  { method: "GET", path: "/api/mock/hello", description: "Simple health check and greeting endpoint.", status: "SERVER_STOPPED" },
  { method: "GET", path: "/api/mock/users", description: "Retrieves a list of mock users with AI-enhanced recommendations.", hasAI: true, status: "SERVER_STOPPED" },
  { method: "POST", path: "/api/mock/order", description: "Creates a new mock order and triggers fulfillment logic.", status: "SERVER_STOPPED" },
  { method: "DELETE", path: "/api/mock/users/{id}", description: "Deletes a specific user from the mock database.", status: "SERVER_STOPPED" },
]

const HAPPY_PATH_MOCK_RESPONSE = {
  "id": "usr_9f2c1a",
  "userName": "sofia_lee",
  "email": "sofia@example.com",
  "roles": ["USER"],
  "score": 0.92,
  "recommendation": "Increase retry backoff to 250ms.",
  "generatedAt": "2020-01-30T14:12:05Z",
  "links": { "self": "/api/mock/users/9f2c1a", "orders": "/api/mock/users/9f2c1a/orders" },
}

// ---------------------------------------------------------------------------
// Provenance badge colours
// ---------------------------------------------------------------------------
const PROVENANCE_BADGE: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  Hybrid: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Faker: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
}

/**
 * Normalise the raw JSON returned by the backend into the shape that
 * FileTree expects.  Handles two mismatches the backend currently ships:
 *   1. `type` is UPPER-CASE ("FOLDER" / "FILE") — needs lowercasing.
 *   2. The payload may be a single root-wrapper object with a `children`
 *      array instead of the array itself — needs unwrapping.
 */
function normaliseFileTree(raw: unknown): FileNode[] {
  // If it's a single object with children (the root-wrapper pattern), unwrap it
  const nodes: unknown[] = Array.isArray(raw)
    ? raw
    : (raw && typeof raw === "object" && "children" in raw && Array.isArray((raw as any).children))
      ? (raw as any).children
      : []

  return nodes.map((node: any) => ({
    name: node.name ?? "",
    type: (typeof node.type === "string" ? node.type.toLowerCase() : "file") as "file" | "folder",
    ...(node.children ? { children: normaliseFileTree(node.children) } : {}),
  }))
}

/** Parse the flat _provenance map into a per-item lookup: itemIndex → { fieldName → source } */
function buildProvenanceMap(provenance: Record<string, string>): Map<number, Record<string, string>> {
  const map = new Map<number, Record<string, string>>()
  for (const [key, source] of Object.entries(provenance)) {
    // keys look like "items[0].name" or "items[1].services[2]"
    const match = key.match(/^items\[(\d+)\]\.(.+)$/)
    if (!match) continue
    const idx = parseInt(match[1], 10)
    const field = match[2].split(".")[0].split("[")[0] // top-level field only (e.g. "services" from "services[0]")
    if (!map.has(idx)) map.set(idx, {})
    map.get(idx)![field] = source
  }
  return map
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ApiTestingStep({
  projectName = "CorePartyData",
  projectPath,
  mockMode = "faker",
  pathToFile,
  onBack,
  onNewProject
}: ApiTestingStepProps) {
  const { happyPath } = useHappyPath()

  // ---------------------------------------------------------------------------
  // Fetched data
  // ---------------------------------------------------------------------------
  const [fileTree, setFileTree] = React.useState<FileNode[]>([])
  const [endpoints, setEndpoints] = React.useState<ApiEndpoint[]>([])
  const [fetchLoading, setFetchLoading] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Mock-server startup state
  // ---------------------------------------------------------------------------
  /** true while the docker container is booting — endpoint list is disabled */
  const [mockServerStarting, setMockServerStarting] = React.useState(false)
  /** true once the mock server responded 200 */
  const [mockServerReady, setMockServerReady] = React.useState(false)

  // ---------------------------------------------------------------------------
  // Load explorer data on mount
  // ---------------------------------------------------------------------------
  const loadExplorerData = React.useCallback(async () => {
    setFetchLoading(true)
    setFetchError(null)
    try {
      if (happyPath) {
        // Happy path — use local fallbacks, no network
        setFileTree(normaliseFileTree(HAPPY_PATH_FILE_TREE))
        setEndpoints(HAPPY_PATH_ENDPOINTS)
        setMockServerReady(true) // no server to start
      } else {
        // Real path — fire 3 calls in parallel
        const [treeRes, endpointsRes, openapiRes] = await Promise.all([
          fetch("/api/explorer/project-structure"),
          fetch("/api/explorer/endpoints"),
          fetch("/api/explorer/openapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ openapi: pathToFile ?? "", mockMode }),
          }),
        ])
        if (!treeRes.ok) throw new Error(`Project structure: HTTP ${treeRes.status}`)
        if (!endpointsRes.ok) throw new Error(`Endpoints: HTTP ${endpointsRes.status}`)
        // openapiRes failure is non-fatal — log but continue
        if (!openapiRes.ok) {
          console.warn("OpenAPI registration returned", openapiRes.status)
        }

        const treeData: unknown = await treeRes.json()
        const endpointsData: ExplorerEndpoint[] = await endpointsRes.json()

        setFileTree(normaliseFileTree(treeData))
        setEndpoints(endpointsData as unknown as ApiEndpoint[])
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load explorer data")
    } finally {
      setFetchLoading(false)
    }
  }, [happyPath, pathToFile, mockMode])

  React.useEffect(() => {
    loadExplorerData()
  }, [loadExplorerData])

  // ---------------------------------------------------------------------------
  // Start mock server after explorer data is loaded (non-happy-path only)
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (happyPath || fetchLoading || fetchError || mockServerReady) return

    async function startMockServer() {
      setMockServerStarting(true)
      try {
        const res = await fetch("/api/forge/docker/project/start", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: projectPath ?? "",
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error((err as any).error ?? `Mock server start failed: HTTP ${res.status}`)
        }
        setMockServerReady(true)
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to start mock server")
      } finally {
        setMockServerStarting(false)
      }
    }

    startMockServer()
  }, [happyPath, fetchLoading, fetchError, mockServerReady, projectPath])

  // ---------------------------------------------------------------------------
  // Local UI state
  // ---------------------------------------------------------------------------
  const [isRunning, setIsRunning] = React.useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<ApiEndpoint | null>(null)
  /** Raw response from the mock server (happy-path: flat object; real: MockServerResponse shape) */
  const [response, setResponse] = React.useState<any>(null)
  /** Parsed items + provenance for the real response panel */
  const [parsedItems, setParsedItems] = React.useState<{ items: Record<string, any>[]; provenanceMap: Map<number, Record<string, string>> } | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [consoleLogs, setConsoleLogs] = React.useState<{ id: number; type: "request" | "response" | "info"; text: string }[]>([])

  // Abort controller ref so STOP can cancel an in-flight request
  const abortRef = React.useRef<AbortController | null>(null)

  // Derived: badge flips green while a request is in-flight or a response is cached
  const serverStatus = mockServerStarting
    ? "Starting"
    : isRunning
      ? "Running"
      : mockServerReady
        ? response ? "Connected" : "Ready"
        : "Stopped"

  const filteredEndpoints = React.useMemo(() => {
    if (!searchQuery.trim()) return endpoints
    const q = searchQuery.toLowerCase()
    return endpoints.filter(
      (ep) =>
        ep.path.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q)
    )
  }, [endpoints, searchQuery])

  // ---------------------------------------------------------------------------
  // Execute a call against the mock server (or happy-path fallback)
  // ---------------------------------------------------------------------------
  const executeCall = React.useCallback(async (endpoint: ApiEndpoint, extraParams?: { mode?: string }) => {
    if (!endpoint) return
    setIsRunning(true)
    setResponse(null)
    setParsedItems(null)

    const ts = new Date().toLocaleTimeString()
    setConsoleLogs((prev) => [...prev, { id: Date.now(), type: "request", text: `[${ts}]  → ${endpoint.method} ${endpoint.path}` }])

    if (happyPath) {
      // Happy-path — simulate latency and return static mock
      setTimeout(() => {
        const resTs = new Date().toLocaleTimeString()
        setConsoleLogs((prev) => [...prev, { id: Date.now() + 1, type: "response", text: `[${resTs}]  ← 200 OK  (${JSON.stringify(HAPPY_PATH_MOCK_RESPONSE).length} bytes)` }])
        setResponse(HAPPY_PATH_MOCK_RESPONSE)
        setIsRunning(false)
      }, 1000)
      return
    }

    // Real path — call the mock-server proxy
    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Strip leading slash for the proxy path
      const mockPath = endpoint.path.replace(/^\//, "")
      let url = `/api/mock-server/${mockPath}`
      if (extraParams?.mode) {
        url += (url.includes("?") ? "&" : "?") + `mode=${extraParams.mode}`
      }

      const res = await fetch(url, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      })

      const data = await res.json()
      const resTs = new Date().toLocaleTimeString()
      setConsoleLogs((prev) => [...prev, { id: Date.now() + 1, type: "response", text: `[${resTs}]  ← ${res.status} OK  (${JSON.stringify(data).length} bytes)` }])

      setResponse(data)

      // If the response has the items + provenance shape, parse it
      if (data?.data?.items && data?._provenance) {
        const mockRes = data as MockServerResponse
        const provenanceMap = buildProvenanceMap(mockRes._provenance ?? {})
        setParsedItems({ items: mockRes.data.items, provenanceMap })
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        const resTs = new Date().toLocaleTimeString()
        setConsoleLogs((prev) => [...prev, { id: Date.now() + 1, type: "info", text: `[${resTs}]  ⚠ Request cancelled` }])
      } else {
        const resTs = new Date().toLocaleTimeString()
        setConsoleLogs((prev) => [...prev, { id: Date.now() + 1, type: "info", text: `[${resTs}]  ✗ ${err instanceof Error ? err.message : "Request failed"}` }])
      }
    } finally {
      abortRef.current = null
      setIsRunning(false)
    }
  }, [happyPath])

  const handleRun = () => {
    if (selectedEndpoint) executeCall(selectedEndpoint)
  }

  const handleAiRegen = () => {
    if (selectedEndpoint) executeCall(selectedEndpoint, { mode: "ai" })
  }

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setIsRunning(false)
  }

  const handleEndpointClick = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint)
    setResponse(null)
    setParsedItems(null)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Project Orchestrator</span>
                <span className="text-muted-foreground">/</span>
                <span>{projectName}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20">
              Hackathon Demo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("gap-1.5", serverStatus === "Stopped" && "text-muted-foreground")}>
              <div className={cn(
                "h-2 w-2 rounded-full",
                (serverStatus === "Running" || serverStatus === "Starting") && "bg-amber-500 animate-pulse",
                (serverStatus === "Connected" || serverStatus === "Ready") && "bg-green-500",
                serverStatus === "Stopped" && "bg-red-500"
              )} />
              {serverStatus}
            </Badge>
            <span className="text-sm text-muted-foreground">v1.0.4-stable</span>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <HappyPathToggle />
            <ModeToggle />
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={onNewProject}>
              <RotateCcw className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Loading state */}
      {fetchLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading explorer data…</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!fetchLoading && fetchError && (
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md text-center space-y-3">
            <p className="text-sm text-destructive font-medium">{fetchError}</p>
            <Button variant="outline" size="sm" onClick={loadExplorerData}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content — rendered only after data is fetched */}
      {!fetchLoading && !fetchError && (
        <div className="flex flex-1 overflow-hidden">
          {/* Resizable sidebar + drag handle */}
          <ResizableSidebar fileTree={fileTree} />

          {/* Center - API Endpoints & Response */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="endpoints" className="flex-1 flex flex-col">
              {/* Tabs Header with Controls */}
              <div className="flex items-center justify-between px-6 py-3 border-b">
                <TabsList>
                  <TabsTrigger value="endpoints" className="gap-2">
                    <span className="text-primary">◉</span>
                    API ENDPOINTS
                  </TabsTrigger>
                  <TabsTrigger value="console" className="gap-2">
                    &gt;_
                    LIVE CONSOLE
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning || !selectedEndpoint || !mockServerReady}
                    className="gap-2"
                    variant={isRunning ? "secondary" : "default"}
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    RUN
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStop}
                    disabled={!isRunning}
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    STOP
                  </Button>
                  {/* AI Regen — visible only when mock server is ready */}
                  {mockServerReady && !happyPath && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAiRegen}
                      disabled={isRunning || !selectedEndpoint}
                      className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950"
                    >
                      <Sparkles className="h-4 w-4" />
                      AI REGEN
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs Content */}
              <TabsContent value="endpoints" className="flex-1 m-0 p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search endpoints..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Mock-server starting overlay */}
                {mockServerStarting && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950 p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Preparing the mock server…</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">Endpoints will be available once the container is ready.</p>
                    </div>
                  </div>
                )}

                {/* Endpoints List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">◆</span>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      STANDARD API OPERATIONS
                    </h3>
                  </div>
                  <ScrollArea className="h-[calc(100vh-500px)]">
                    <div className={cn("space-y-3 pr-4", mockServerStarting && "opacity-40 pointer-events-none")}>
                      {filteredEndpoints.length > 0 ? (
                        filteredEndpoints.map((endpoint, index) => (
                          <ApiEndpointItem
                            key={index}
                            endpoint={endpoint}
                            onClick={() => handleEndpointClick(endpoint)}
                            isSelected={selectedEndpoint === endpoint}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No endpoints match your search.
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="console" className="flex-1 m-0 p-6">
                <ScrollArea className="h-[calc(100vh-380px)]">
                  {consoleLogs.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                      <p className="text-sm text-muted-foreground">
                        Select an endpoint and press RUN — logs will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-xs">
                      {consoleLogs.map((log) => (
                        <div
                          key={log.id}
                          className={cn(
                            "px-3 py-1 rounded",
                            log.type === "request" && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
                            log.type === "response" && "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
                            log.type === "info" && "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950"
                          )}
                        >
                          {log.text}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Bottom - Response Preview */}
            <div className="border-t">
              <ScrollArea className="h-64">
                <div className="p-6">
                  {parsedItems ? (
                    // Real mock-server response with provenance badges
                    <ResponseItemsPanel items={parsedItems.items} provenanceMap={parsedItems.provenanceMap} />
                  ) : response ? (
                    // Happy-path or non-items response — render as key-value
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">RESPONSE PREVIEW</p>
                      <div className="space-y-1">
                        {Object.entries(response).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-2 text-sm">
                            <span className="font-mono text-muted-foreground min-w-[100px]">{key}</span>
                            <span className="font-mono">{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <p className="text-sm text-muted-foreground text-center">
                        {selectedEndpoint
                          ? "Click RUN to execute the selected endpoint"
                          : "Select an endpoint to see the response preview"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">SPRING BOOT SCAFFOLD</span>
                <Badge variant="secondary" className={cn(
                  mockServerReady ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  {mockServerReady ? "Ready for demo" : "Starting…"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Resizable-sidebar wrapper  (extracted so the drag state lives close to
// the sidebar and doesn't pollute the main component)
// ---------------------------------------------------------------------------
function ResizableSidebar({ fileTree }: { fileTree: FileNode[] }) {
  const MIN_WIDTH = 160   // px  – minimum sidebar width
  const MAX_WIDTH = 600   // px  – maximum sidebar width
  const DEFAULT_WIDTH = 240

  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_WIDTH)
  const isDragging = React.useRef(false)
  const startX = React.useRef(0)
  const startWidth = React.useRef(DEFAULT_WIDTH)

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = sidebarWidth
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [sidebarWidth])

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - startX.current
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta))
      setSidebarWidth(newWidth)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <>
      {/* Left Sidebar - File Explorer */}
      <aside className="flex flex-col border-r shrink-0" style={{ width: sidebarWidth }}>
        <div className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Project Explorer
            </h2>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {/* ScrollArea fills remaining vertical space; inner wrapper enables
            horizontal scroll so deeply-nested paths are never clipped. */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 min-w-max">
            <FileTree data={fileTree} />
          </div>
        </ScrollArea>
      </aside>

      {/* Drag handle – a thin invisible strip that turns into col-resize on hover */}
      <div
        className="w-1 shrink-0 cursor-col-resize hover:bg-primary/20 transition-colors relative group"
        onMouseDown={onMouseDown}
      >
        {/* Visual grip dots (centred vertically, visible on hover) */}
        <div className="absolute inset-y-0 left-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-1">
            <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: renders parsed items with per-field provenance badges
// ---------------------------------------------------------------------------
function ResponseItemsPanel({
  items,
  provenanceMap,
}: {
  items: Record<string, any>[]
  provenanceMap: Map<number, Record<string, string>>
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">RESPONSE ITEMS</p>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const fieldSources = provenanceMap.get(idx) ?? {}
          return (
            <div key={idx} className="rounded-lg border p-3 space-y-2">
              {Object.entries(item).map(([field, value]) => {
                const source = fieldSources[field]
                const displayValue = Array.isArray(value) ? value.join(", ") : String(value)
                return (
                  <div key={field} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-muted-foreground min-w-[72px]">{field}</span>
                    <span className="font-mono flex-1">{displayValue}</span>
                    {source && (
                      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", PROVENANCE_BADGE[source] ?? PROVENANCE_BADGE.Faker)}>
                        {source === "AI" && <Sparkles className="h-3 w-3" />}
                        {source}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
