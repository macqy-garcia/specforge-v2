"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Stepper, Step } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

interface WizardLayoutProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  onComplete?: () => void
  className?: string
  completedSteps?: number[]
}

export function WizardLayout({
  steps,
  currentStep,
  onStepChange,
  children,
  onComplete,
  className,
  completedSteps = []
}: WizardLayoutProps) {
  const canGoBack = currentStep > 1
  const canGoNext = currentStep < steps.length
  const isLastStep = currentStep === steps.length
  const isSummaryStep = currentStep === 4 // Step 4 is the Summary step

  const handleNext = () => {
    if (isLastStep && onComplete) {
      onComplete()
    } else if (canGoNext) {
      onStepChange(currentStep + 1)
    }
  }

  // Determine button text
  const getNextButtonText = () => {
    if (isSummaryStep) {
      return "Generate Project"
    }
    if (isLastStep) {
      return "Complete"
    }
    return "Next Step"
  }

  const handleBack = () => {
    if (canGoBack) {
      onStepChange(currentStep - 1)
    }
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              PROJECT ORCHESTRATOR
            </span>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Stepper */}
      <div className="border-b bg-background">
        <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container px-4 py-8 sm:px-6 lg:px-8 mx-auto">
        <div className="mx-auto max-w-3xl">
          {children}
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={!canGoBack}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {getNextButtonText()}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Add padding to the bottom to account for the fixed footer */}
      <div className="h-20" />
    </div>
  )
}
