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
  /** Current value of the top-level pathToFile field (absolute path the user can edit) */
  pathToFile?: string
  updateData: (path: string[], value: any) => void
  errors?: { fileUpload: boolean }
  onClearError?: (field: string) => void
}

export function UploadSpecStep({ data, pathToFile, updateData, errors = { fileUpload: false }, onClearError }: UploadSpecStepProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  // ---------------------------------------------------------------------------
  // Read the file content via FileReader so downstream steps can forward it
  // ---------------------------------------------------------------------------
  const readFileContent = (file: File) => {
    const reader = new FileReader()
    reader.onload = (evt) => {
      updateData(['upload', 'fileContent'], evt.target?.result ?? "")
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.json')) {
        updateData(['upload', 'fileName'], file.name)
        updateData(['upload', 'source'], 'file')
        // Seed pathToFile with the file name — user can edit to the full absolute path below
        updateData(['pathToFile'], file.name)
        readFileContent(file)
        onClearError?.('fileUpload')
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      updateData(['upload', 'fileName'], files[0].name)
      updateData(['upload', 'source'], 'file')
      // Seed pathToFile with the file name — user can edit to the full absolute path below
      updateData(['pathToFile'], files[0].name)
      readFileContent(files[0])
      // Clear any previous errors
      updateData(['upload', 'validationError'], undefined)
      onClearError?.('fileUpload')
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
      <div>
        <div
          className={`
            relative rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : errors.fileUpload ? 'border-destructive bg-destructive/5' : 'border-muted-foreground/25 bg-muted/20'}
            ${!isDragging && !errors.fileUpload ? 'hover:border-muted-foreground/50' : ''}
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
            accept=".json"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`rounded-full p-4 ${errors.fileUpload ? 'bg-destructive/10' : 'bg-muted'}`}>
              <Upload className={`h-8 w-8 ${errors.fileUpload ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>

            <div className="space-y-1">
              <p className={`text-sm font-medium ${errors.fileUpload ? 'text-destructive' : ''}`}>
                <span className="text-primary hover:underline cursor-pointer">
                  Click to upload
                </span>
                {" "}or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                JSON files supported (.json)
              </p>
            </div>

            {data.fileName && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{data.fileName}</span>
              </div>
            )}
          </div>
        </div>
        {errors.fileUpload && (
          <p className="mt-1.5 text-sm text-destructive">Please upload a file or enter a URL to continue</p>
        )}
      </div>

      {/* Editable file-path input — visible once a file has been dropped / selected */}
      {data.source === 'file' && data.fileName && (
        <div className="space-y-2">
          <Label htmlFor="file-path">
            File Path <span className="text-muted-foreground text-xs font-normal">(edit to full absolute path)</span>
          </Label>
          <Input
            id="file-path"
            placeholder="/Users/you/Desktop/openapi.json"
            value={pathToFile ?? ""}
            onChange={(e) => updateData(['pathToFile'], e.target.value)}
          />
        </div>
      )}

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
                // Mirror the URL into pathToFile so it shows up in the Summary JSON
                updateData(['pathToFile'], e.target.value)
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
