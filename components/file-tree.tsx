import { useState } from "react";

export type FileNode = {
    type: "file" | "folder";
    name: string;
    children?: FileNode[];
};

type Props = {
    node: FileNode;
    level?: number;
};

export function FileTreeItem({ node, level = 0 }: Props) {
    const [open, setOpen] = useState(true);

    const isFolder = node.type === "folder";

    return (
        <div style={{ marginLeft: level * 7 }}>
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => isFolder && setOpen(!open)}
            >
                {isFolder ? (
                    <span>{open ? "📂" : "📁"}</span>
                ) : (
                    <span>📄</span>
                )}

                <span className="text-sm">{node.name}</span>
            </div>

            {isFolder && open && node.children && (
                <div className="mt-1">
                    {node.children.map((child, index) => (
                        <FileTreeItem
                            key={`${child.name}-${index}`}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

type FileTreeProps = {
    data: FileNode[];
};

export function FileTreeComponent({ data }: FileTreeProps) {
    return (
        <div className="space-y-1">
            {data.map((node, index) => (
                <FileTreeItem key={`${node.name}-${index}`} node={node} />
            ))}
        </div>
    );
}
