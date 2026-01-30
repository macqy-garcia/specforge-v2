"use client"

import * as React from "react"
import { Upload, Link as LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface UploadSpecStepProps {
  data: {
    source: string
    fileName: string
    url: string
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
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

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
      <div className="space-y-2">
        <label htmlFor="spec-url" className="text-sm font-medium">
          OpenAPI Specification URL
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="spec-url"
            type="url"
            placeholder="https://api.example.com/openapi.json"
            value={data.url}
            onChange={(e) => {
              updateData(['upload', 'url'], e.target.value)
              if (e.target.value) {
                updateData(['upload', 'source'], 'url')
              }
            }}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}
