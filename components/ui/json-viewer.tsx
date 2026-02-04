import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface JsonViewerProps {
  data: any
  title?: string
  className?: string
}

export function JsonViewer({ data, title = "Response Preview", className }: JsonViewerProps) {
  const [copied, setCopied] = React.useState(false)

  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return "{}"
    }
  }, [data])

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Escape HTML entities so user-controlled content cannot inject tags
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")

  // Simple syntax highlighting for JSON (applied AFTER escaping)
  const highlightJson = (json: string) => {
    const escaped = escapeHtml(json)
    return escaped
      .replace(/(&quot;.*?&quot;):/g, '<span class="text-primary font-medium">$1</span>:')
      .replace(/: (&quot;.*?&quot;)/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/: (null)/g, ': <span class="text-muted-foreground">$1</span>')
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-2 h-8"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy JSON
            </>
          )}
        </Button>
      </div>

      {/* JSON Display */}
      <div className="rounded-lg border bg-muted/30">
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }} />
        </pre>
      </div>
    </div>
  )
}
