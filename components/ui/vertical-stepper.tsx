import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"

export interface VerticalStep {
  id: number
  label: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "error"
}

interface VerticalStepperProps {
  steps: VerticalStep[]
  className?: string
}

export function VerticalStepper({ steps, className }: VerticalStepperProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="flex gap-4">
            {/* Step indicator column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  step.status === "completed" && "border-primary bg-primary text-primary-foreground",
                  step.status === "in_progress" && "border-primary bg-primary text-primary-foreground",
                  step.status === "error" && "border-destructive bg-destructive text-destructive-foreground",
                  step.status === "pending" && "border-muted-foreground/30 bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" && <Check className="h-5 w-5" />}
                {step.status === "in_progress" && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                {step.status === "pending" && (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
                {step.status === "error" && (
                  <span className="text-sm font-medium">!</span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-2 min-h-[40px]",
                    step.status === "completed" ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>

            {/* Content column */}
            <div className={cn("flex-1", !isLast && "pb-8")}>
              <div className="pt-1">
                <h3
                  className={cn(
                    "font-semibold text-base",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "completed" && "text-foreground",
                    step.status === "in_progress" && "text-primary",
                    step.status === "error" && "text-destructive"
                  )}
                >
                  {step.label}
                </h3>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
