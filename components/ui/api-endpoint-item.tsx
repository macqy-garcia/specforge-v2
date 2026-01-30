import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  hasAI?: boolean
  status?: "SERVER_STOPPED" | "OPEN" | "RUNNING" | "ERROR"
}

interface ApiEndpointItemProps {
  endpoint: ApiEndpoint
  onClick?: () => void
  isSelected?: boolean
}

const methodStyles = {
  GET: "bg-blue-500 text-white",
  POST: "bg-green-500 text-white",
  PUT: "bg-orange-500 text-white",
  DELETE: "bg-red-500 text-white",
  PATCH: "bg-purple-500 text-white",
}

const statusStyles = {
  SERVER_STOPPED: "text-muted-foreground",
  OPEN: "text-blue-600",
  RUNNING: "text-green-600",
  ERROR: "text-red-600",
}

export function ApiEndpointItem({ endpoint, onClick, isSelected }: ApiEndpointItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-accent/50",
        isSelected && "border-primary bg-accent"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Method Badge */}
        <Badge className={cn("shrink-0", methodStyles[endpoint.method])}>
          {endpoint.method}
        </Badge>

        {/* Endpoint Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <code className="font-mono font-semibold text-sm truncate">
              {endpoint.path}
            </code>
            {endpoint.hasAI && (
              <Badge variant="secondary" className="gap-1 text-xs shrink-0">
                <Sparkles className="h-3 w-3" />
                AI
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {endpoint.description}
          </p>
        </div>

        {/* Status */}
        {endpoint.status && (
          <div className={cn("text-xs font-medium uppercase tracking-wider shrink-0", statusStyles[endpoint.status])}>
            {endpoint.status.replace("_", " ")}
          </div>
        )}
      </div>
    </button>
  )
}
