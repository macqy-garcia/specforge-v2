"use client"

import * as React from "react"
import { Upload, Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getSpecSummary } from "@/lib/openapi-validator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

interface UploadSpecStepProps {
  data: {
    source: string
    fileName: string
    url: string
    specData?: any
    isValidating?: boolean
    isValid?: boolean
    validationError?: string
  }
  updateData: (path: string[], value: any) => void
}

export function UploadSpecStep({ data, updateData }: UploadSpecStepProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.json') || file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        updateData(['upload', 'fileName'], file.name)
        updateData(['upload', 'source'], 'file')
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      updateData(['upload', 'fileName'], files[0].name)
      updateData(['upload', 'source'], 'file')
      // Clear any previous errors
      updateData(['upload', 'validationError'], undefined)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const specSummary = data.specData ? getSpecSummary(data.specData) : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Import API Specification
        </h1>
        <p className="text-muted-foreground">
          Upload your OpenAPI/Swagger definition to auto-configure your project.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative rounded-lg border-2 border-dashed p-12 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 bg-muted/20'}
          hover:border-muted-foreground/50 cursor-pointer
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".json,.yaml,.yml"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              <span className="text-primary hover:underline cursor-pointer">
                Click to upload
              </span>
              {" "}or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              JSON or YAML files supported
            </p>
          </div>

          {data.fileName && (
            <div className="mt-2 text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{data.fileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Or Import From URL
        </span>
        <Separator className="flex-1" />
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="spec-url"
            className={data.validationError && data.source === 'url' ? "text-destructive" : ""}
          >
            OpenAPI Specification URL
          </Label>
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="spec-url"
              type="url"
              placeholder="https://api.example.com/openapi.json"
              value={data.url}
              onChange={(e) => {
                updateData(['upload', 'url'], e.target.value)
                updateData(['upload', 'source'], 'url')
                // Reset validation state when URL changes
                updateData(['upload', 'isValid'], false)
                updateData(['upload', 'validationError'], undefined)
                updateData(['upload', 'specData'], undefined)
              }}
              className={`pl-9 ${data.validationError && data.source === 'url' ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
          </div>
          {data.validationError && data.source === 'url' && (
            <p className="text-sm text-destructive">{data.validationError}</p>
          )}
        </div>

        {data.isValid && specSummary && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">Valid OpenAPI Specification</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="mt-2 space-y-1">
                <p><strong>Title:</strong> {specSummary.title}</p>
                <p><strong>Version:</strong> {specSummary.version}</p>
                {specSummary.description && (
                  <p><strong>Description:</strong> {specSummary.description}</p>
                )}
                <p><strong>Endpoints:</strong> {specSummary.pathCount} path{specSummary.pathCount !== 1 ? 's' : ''}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
