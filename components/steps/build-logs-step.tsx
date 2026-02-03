"use client"

import * as React from "react"
import { VerticalStepper, VerticalStep } from "@/components/ui/vertical-stepper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, CheckCircle2, ArrowRight } from "lucide-react"

// Define the API steps
const API_STEPS = [
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

interface BuildLogsStepProps {
  onComplete?: () => void
  projectName?: string
}

export function BuildLogsStep({ onComplete, projectName = "Project" }: BuildLogsStepProps) {
  const [steps, setSteps] = React.useState<VerticalStep[]>(
    API_STEPS.map((step) => ({
      id: step.id,
      label: step.label,
      description: step.description,
      status: "pending" as const,
    }))
  )

  const [isRunning, setIsRunning] = React.useState(false)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [buildComplete, setBuildComplete] = React.useState(false)
  const hasStartedRef = React.useRef(false)

  // Simulate API call with 2-second delay
  const simulateApiCall = async (stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000) // 2 seconds delay
    })
  }

  // Start the build process
  const startBuildProcess = React.useCallback(async () => {
    // Prevent multiple executions
    if (isRunning) return

    setIsRunning(true)

    for (let i = 0; i < API_STEPS.length; i++) {
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
  }, [isRunning, projectName])

  // Auto-start the build process when component mounts
  React.useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      startBuildProcess()
    }
  }, [startBuildProcess])

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

      {/* Build Logs Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Build Progress</CardTitle>
          <CardDescription>
            {isRunning
              ? `Processing step ${currentStepIndex + 1} of ${API_STEPS.length}...`
              : "Build process completed!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerticalStepper steps={steps} />
        </CardContent>
      </Card>

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
