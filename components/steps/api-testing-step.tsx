"use client"

import * as React from "react"
import { FileTree, FileNode } from "@/components/ui/file-tree"
import { ApiEndpointItem, ApiEndpoint } from "@/components/ui/api-endpoint-item"
import { JsonViewer } from "@/components/ui/json-viewer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, Sparkles, ExternalLink, Download, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data - replace with actual data from backend
const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "main",
        type: "folder",
        children: [
          {
            name: "java",
            type: "folder",
            children: [
              {
                name: "controller",
                type: "folder",
                children: [
                  { name: "MockController.java", type: "file" }
                ]
              },
              {
                name: "service",
                type: "folder",
                children: [
                  { name: "MockService.java", type: "file" }
                ]
              },
              {
                name: "generator",
                type: "folder",
                children: [
                  { name: "HybridGenerator.java", type: "file" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "resources",
    type: "folder",
    children: []
  },
  {
    name: "pom.xml",
    type: "file"
  }
]

const mockEndpoints: ApiEndpoint[] = [
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

const mockResponse = {
  "id": "usr_9f2c1a",
  "userName": "sofia_lee",
  "email": "sofia@example.com",
  "roles": ["USER"],
  "score": 0.92,
  "recommendation": "Increase retry backoff to 250ms.",
  "generatedAt": "2020-01-30T14:12:05Z",
  "links": {
    "self": "/api/mock/users/9f2c1a",
    "orders": "/api/mock/users/9f2c1a/orders"
  }
}

interface ApiTestingStepProps {
  projectName?: string
  fileTree?: FileNode[]
  endpoints?: ApiEndpoint[]
}

export function ApiTestingStep({
  projectName = "CorePartyData",
  fileTree = mockFileTree,
  endpoints = mockEndpoints
}: ApiTestingStepProps) {
  const [isRunning, setIsRunning] = React.useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<ApiEndpoint | null>(null)
  const [response, setResponse] = React.useState<any>(null)

  const handleRun = () => {
    setIsRunning(true)
    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      if (selectedEndpoint) {
        setResponse(mockResponse)
        setIsRunning(false)
      }
    }, 1000)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleEndpointClick = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint)
    setResponse(null)
  }

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
            <Badge variant="outline" className="gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              Stopped
            </Badge>
            <span className="text-sm text-muted-foreground">v1.0.4-stable</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <aside className="w-60 border-r">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Project Explorer
              </h2>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="p-4">
              <FileTree data={fileTree} />
            </div>
          </ScrollArea>
        </aside>

        {/* Center - API Endpoints & Response */}
        <div className="flex-1 flex flex-col">
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
                  disabled={isRunning || !selectedEndpoint}
                  className="gap-2"
                  variant={isRunning ? "secondary" : "default"}
                >
                  <Play className="h-4 w-4" />
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
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI REGEN
                </Button>
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
                />
              </div>

              {/* Endpoints List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">◆</span>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    STANDARD API OPERATIONS
                  </h3>
                </div>
                <ScrollArea className="h-[calc(100vh-500px)]">
                  <div className="space-y-3 pr-4">
                    {endpoints.map((endpoint, index) => (
                      <ApiEndpointItem
                        key={index}
                        endpoint={endpoint}
                        onClick={() => handleEndpointClick(endpoint)}
                        isSelected={selectedEndpoint === endpoint}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="console" className="flex-1 m-0 p-6">
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  Live console output will appear here...
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Bottom - Response Preview */}
          <div className="border-t">
            <ScrollArea className="h-64">
              <div className="p-6">
                {response ? (
                  <JsonViewer data={response} title="RESPONSE PREVIEW" />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">SPRING BOOT SCAFFOLD</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  Ready for demo
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open in IDE
                </Button>
                <Button size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Scaffold Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
