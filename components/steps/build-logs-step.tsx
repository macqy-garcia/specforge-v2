"use client"

import * as React from "react"
import { VerticalStepper, VerticalStep } from "@/components/ui/vertical-stepper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Check } from "lucide-react"

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

    // Call onComplete callback after all steps are done
    if (onComplete) {
      setTimeout(onComplete, 500)
    }
  }, [isRunning, onComplete, projectName])

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
    </div>
  )
}
