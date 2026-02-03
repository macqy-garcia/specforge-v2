"use client"

import * as React from "react"
import { VerticalStepper, VerticalStep } from "@/components/ui/vertical-stepper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import type { BuildStep } from "@/app/api/build-steps/route"

interface BuildLogsStepProps {
  onComplete?: () => void
  onBuildComplete?: () => void
  projectName?: string
}

export function BuildLogsStep({ onComplete, onBuildComplete, projectName = "Project" }: BuildLogsStepProps) {
  // ---------------------------------------------------------------------------
  // Fetched step definitions (populated from /api/build-steps)
  // ---------------------------------------------------------------------------
  const [apiSteps, setApiSteps] = React.useState<BuildStep[]>([])
  const [fetchLoading, setFetchLoading] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  // Stepper UI state — initialised empty; populated after fetch resolves
  const [steps, setSteps] = React.useState<VerticalStep[]>([])
  const [isRunning, setIsRunning] = React.useState(false)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [buildComplete, setBuildComplete] = React.useState(false)
  const hasStartedRef = React.useRef(false)

  // ---------------------------------------------------------------------------
  // Fetch step definitions from the mock API on mount
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    async function loadSteps() {
      try {
        const res = await fetch("/api/build-steps")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: BuildStep[] = await res.json()
        setApiSteps(data)
        setSteps(
          data.map((step) => ({
            id: step.id,
            label: step.label,
            description: step.description,
            status: "pending" as const,
          }))
        )
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to load build steps")
      } finally {
        setFetchLoading(false)
      }
    }
    loadSteps()
  }, [])

  // Simulate API call with 2-second delay
  const simulateApiCall = async (_stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000) // 2 seconds delay
    })
  }

  // ---------------------------------------------------------------------------
  // Start the build process — only after steps have been fetched
  // ---------------------------------------------------------------------------
  const startBuildProcess = React.useCallback(async () => {
    if (isRunning || apiSteps.length === 0) return

    setIsRunning(true)

    for (let i = 0; i < apiSteps.length; i++) {
      setCurrentStepIndex(i)

      // Update step to in_progress
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === i ? { ...step, status: "in_progress" } : step
        )
      )

      // Simulate API call
      try {
        await simulateApiCall(i)

        // Update step to completed
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === i ? { ...step, status: "completed" } : step
          )
        )
      } catch (error) {
        // Update step to error if API fails
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === i ? { ...step, status: "error" } : step
          )
        )
        setIsRunning(false)
        return
      }
    }

    setIsRunning(false)

    // Show success toast
    toast.success("Project Orchestrated!", {
      description: `Your service ${projectName} is ready for development.`,
      icon: <Check className="h-5 w-5 text-green-600" />,
      duration: 5000,
    })

    // Show the confirmation prompt instead of auto-redirecting
    setBuildComplete(true)
    onBuildComplete?.()
  }, [isRunning, apiSteps, projectName, onBuildComplete])

  // Auto-start once the fetched steps are ready
  React.useEffect(() => {
    if (!fetchLoading && !fetchError && apiSteps.length > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true
      startBuildProcess()
    }
  }, [fetchLoading, fetchError, apiSteps, startBuildProcess])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Building Your Project
        </h1>
        <p className="text-muted-foreground">
          Please wait while we orchestrate your project. This may take a few moments.
        </p>
      </div>

      {/* Loading / error states while fetching step definitions */}
      {fetchLoading && (
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading build steps…</p>
        </div>
      )}

      {fetchError && (
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="pt-6 text-center space-y-3">
            <p className="text-sm text-destructive font-medium">{fetchError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFetchError(null)
                setFetchLoading(true)
                hasStartedRef.current = false
                fetch("/api/build-steps")
                  .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json() as Promise<BuildStep[]>
                  })
                  .then((data) => {
                    setApiSteps(data)
                    setSteps(
                      data.map((step) => ({
                        id: step.id,
                        label: step.label,
                        description: step.description,
                        status: "pending" as const,
                      }))
                    )
                  })
                  .catch((err) => {
                    setFetchError(err instanceof Error ? err.message : "Failed to load build steps")
                  })
                  .finally(() => setFetchLoading(false))
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Build Logs Card — rendered only after steps are fetched */}
      {!fetchLoading && !fetchError && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Build Progress</CardTitle>
            <CardDescription>
              {isRunning
                ? `Processing step ${currentStepIndex + 1} of ${apiSteps.length}…`
                : "Build process completed!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerticalStepper steps={steps} />
          </CardContent>
        </Card>
      )}

      {/* Redirect confirmation — shown only after build finishes */}
      {buildComplete && (
        <Card className="max-w-2xl mx-auto border-green-500 bg-green-50 dark:bg-green-950 animate-in fade-in duration-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-semibold text-green-900 dark:text-green-100">
                  Your project is ready!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {projectName} has been successfully orchestrated. Would you like to open the API Explorer to test your endpoints?
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBuildComplete(false)}
              >
                Stay Here
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => onComplete && onComplete()}
              >
                Open API Explorer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
