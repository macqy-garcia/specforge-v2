"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { useHappyPath } from "@/components/happy-path-context"
import { cn } from "@/lib/utils"

/**
 * Happy-Path toggle — sits in the header next to ModeToggle.
 *   ON  → all backend calls are short-circuited with encoded success responses.
 *   OFF → real API calls go through to the backend.
 */
export function HappyPathToggle() {
  const { happyPath, setHappyPath } = useHappyPath()

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-xs font-semibold tracking-wide transition-colors",
          happyPath ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
      >
        Happy Path
      </span>
      <Switch
        checked={happyPath}
        onCheckedChange={setHappyPath}
        className="scale-90"
      />
    </div>
  )
}
