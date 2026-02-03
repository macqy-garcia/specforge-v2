import { NextResponse } from "next/server"

/**
 * Mock API – returns the project file-tree structure.
 * Replace the body of GET with a call to the real upstream service
 * once it is deployed; the shape stays the same.
 */

export interface FileTreeNode {
  name: string
  type: "file" | "folder"
  children?: FileTreeNode[]
  icon?: string
}

const FILE_TREE: FileTreeNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "main",
        type: "folder",
        children: [
          {
            name: "java",
            type: "folder",
            children: [
              {
                name: "controller",
                type: "folder",
                children: [
                  { name: "MockController.java", type: "file" }
                ]
              },
              {
                name: "service",
                type: "folder",
                children: [
                  { name: "MockService.java", type: "file" }
                ]
              },
              {
                name: "generator",
                type: "folder",
                children: [
                  { name: "HybridGenerator.java", type: "file" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "resources",
    type: "folder",
    children: []
  },
  {
    name: "pom.xml",
    type: "file"
  }
]

// ---------------------------------------------------------------------------
// GET /api/explorer/file-tree
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json(FILE_TREE)
}
