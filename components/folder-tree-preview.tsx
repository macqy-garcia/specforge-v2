type FileNode = {
    name: string
    type: "file" | "folder"
    children?: FileNode[]
}

type Props = {
    nodes: FileNode[]
    prefix?: string
}

export function FolderTreePreview({
    nodes,
    prefix = "",
}: Props) {
    const folders = nodes.filter((n) => n.type === "folder")

    return (
        <div className="font-mono text-sm leading-6 text-muted-foreground">
            {folders.map((node, index) => {
                const isLast = index === folders.length - 1
                const pointer = isLast ? "└── " : "├── "
                const nextPrefix = prefix + (isLast ? "    " : "│   ")

                return (
                    <div key={prefix + node.name}>
                        <div className="whitespace-pre">
                            {prefix}
                            {pointer}
                            <span className="text-foreground">{node.name}</span>
                        </div>

                        {node.children && (
                            <FolderTreePreview
                                nodes={node.children}
                                prefix={nextPrefix}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
