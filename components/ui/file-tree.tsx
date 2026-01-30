import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from "lucide-react"

export interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  icon?: string
}

interface FileTreeItemProps {
  node: FileNode
  level?: number
}

function FileTreeItem({ node, level = 0 }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(level < 2) // Auto-expand first 2 levels

  const isFolder = node.type === "folder"
  const hasChildren = node.children && node.children.length > 0

  const handleToggle = () => {
    if (isFolder && hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 hover:bg-accent rounded-sm cursor-pointer transition-colors",
          "text-sm"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {/* Chevron for folders */}
        {isFolder && hasChildren && (
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {isFolder && !hasChildren && <span className="w-4" />}

        {/* Icon */}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-blue-500" />
          )
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Name */}
        <span className={cn(
          isFolder ? "font-medium" : "text-muted-foreground"
        )}>
          {node.name}
        </span>
      </div>

      {/* Children */}
      {isFolder && hasChildren && isExpanded && (
        <div>
          {node.children?.map((child, index) => (
            <FileTreeItem key={`${child.name}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface FileTreeProps {
  data: FileNode[]
  className?: string
}

export function FileTree({ data, className }: FileTreeProps) {
  return (
    <div className={cn("w-full", className)}>
      {data.map((node, index) => (
        <FileTreeItem key={`${node.name}-${index}`} node={node} level={0} />
      ))}
    </div>
  )
}
