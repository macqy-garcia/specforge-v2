"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "./ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MultiSelect } from "./ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { SparkleIcon, CodeIcon, Upload, Link as LinkIcon, InfoIcon, EyeIcon, FolderGit2, HardDrive, Paperclip, CircleCheck, Check, GitBranch, Router, SquareCode, BookOpen } from "lucide-react"

import { FileNode, FileTreeComponent } from "./file-tree"
import { JsonViewer } from "./json-tree-viewer"
import { ModeToggle } from "./mode-toggle"

// Define the type for your JSON data
interface ProjectData {
  upload: {
    source: string
    fileName: string
    url: string
  }
  projectInfo: {
    purposeCode: string
    projectName: string
    description: string
    repoName: string
    defaultBranch: string
  }
  techOptions: {
    language: string
    javaVersion: string
    springBootVersion: string
    buildTool: string
    groupId: string
    artifactId: string
    basePackage: string
    hexagonal: boolean
    hexagonalLayout: FileNode[]
    dependencies: string[]
    starterKit: boolean | {
      azureDevOpsOrganisation: string
      platform: string
      generationScope: string
      resourceGeneration: string
      buildPipeline: string
      purposeCode: string
      assetIndent: string
      applicationName: string
    }
    mock: {
      engine: string
    }
    observability: {
      otel: boolean
    }
  }
}

interface Architecture {
  id: string
  name: string
  description: string
  structure: FileNode[]
}

export function ComponentExample() {
  // Architecture options for the carousel
  const architectures: Architecture[] = [
    {
      id: "hex-3",
      name: "Hex (3-module)",
      description: "Traditional Spring Boot layered architecture with clear separation of concerns.",
      structure: [
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
                      name: "com.example.demo",
                      type: "folder",
                      children: [
                        { name: "DemoApplication.java", type: "file" },
                        {
                          name: "controller",
                          type: "folder",
                          children: [
                            { name: "UserController.java", type: "file" },
                            { name: "ProductController.java", type: "file" },
                          ],
                        },
                        {
                          name: "service",
                          type: "folder",
                          children: [
                            { name: "UserService.java", type: "file" },
                            { name: "ProductService.java", type: "file" },
                          ],
                        },
                        {
                          name: "repository",
                          type: "folder",
                          children: [
                            { name: "UserRepository.java", type: "file" },
                            { name: "ProductRepository.java", type: "file" },
                          ],
                        },
                        {
                          name: "model",
                          type: "folder",
                          children: [
                            { name: "User.java", type: "file" },
                            { name: "Product.java", type: "file" },
                          ],
                        },
                        {
                          name: "dto",
                          type: "folder",
                          children: [
                            { name: "UserDTO.java", type: "file" },
                            { name: "ProductDTO.java", type: "file" },
                          ],
                        },
                        {
                          name: "config",
                          type: "folder",
                          children: [
                            { name: "SecurityConfig.java", type: "file" },
                            { name: "DatabaseConfig.java", type: "file" },
                          ],
                        },
                        {
                          name: "exception",
                          type: "folder",
                          children: [
                            { name: "GlobalExceptionHandler.java", type: "file" },
                            { name: "ResourceNotFoundException.java", type: "file" },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "resources",
                  type: "folder",
                  children: [
                    { name: "application.yml", type: "file" },
                    { name: "application-dev.yml", type: "file" },
                    { name: "application-prod.yml", type: "file" },
                  ],
                },
              ],
            },
            {
              name: "test",
              type: "folder",
              children: [
                {
                  name: "java",
                  type: "folder",
                  children: [
                    {
                      name: "com.example.demo",
                      type: "folder",
                      children: [
                        { name: "DemoApplicationTests.java", type: "file" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "hex-4",
      name: "Hex + Persistence (4-module)",
      description: "Domain-driven design with clear boundaries between business logic and infrastructure.",
      structure: [
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
                      name: "com.example.demo",
                      type: "folder",
                      children: [
                        { name: "DemoApplication.java", type: "file" },
                        {
                          name: "domain",
                          type: "folder",
                          children: [
                            {
                              name: "model",
                              type: "folder",
                              children: [
                                { name: "User.java", type: "file" },
                                { name: "Product.java", type: "file" },
                              ],
                            },
                            {
                              name: "port",
                              type: "folder",
                              children: [
                                {
                                  name: "in",
                                  type: "folder",
                                  children: [
                                    { name: "CreateUserUseCase.java", type: "file" },
                                    { name: "GetProductUseCase.java", type: "file" },
                                  ],
                                },
                                {
                                  name: "out",
                                  type: "folder",
                                  children: [
                                    { name: "UserRepositoryPort.java", type: "file" },
                                    { name: "ProductRepositoryPort.java", type: "file" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "service",
                              type: "folder",
                              children: [
                                { name: "UserService.java", type: "file" },
                                { name: "ProductService.java", type: "file" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "application",
                          type: "folder",
                          children: [
                            {
                              name: "adapter",
                              type: "folder",
                              children: [
                                {
                                  name: "in",
                                  type: "folder",
                                  children: [
                                    {
                                      name: "rest",
                                      type: "folder",
                                      children: [
                                        { name: "UserController.java", type: "file" },
                                        { name: "ProductController.java", type: "file" },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "out",
                                  type: "folder",
                                  children: [
                                    {
                                      name: "persistence",
                                      type: "folder",
                                      children: [
                                        { name: "UserJpaAdapter.java", type: "file" },
                                        { name: "ProductJpaAdapter.java", type: "file" },
                                        { name: "UserEntity.java", type: "file" },
                                        { name: "ProductEntity.java", type: "file" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "config",
                              type: "folder",
                              children: [
                                { name: "BeanConfig.java", type: "file" },
                                { name: "SecurityConfig.java", type: "file" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "resources",
                  type: "folder",
                  children: [
                    { name: "application.yml", type: "file" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "layered-ddd",
      name: "Layered (DDD)",
      description: "Domain-driven design with explicit layers: presentation, application, domain, and infrastructure.",
      structure: [
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
                      name: "com.example.demo",
                      type: "folder",
                      children: [
                        { name: "DemoApplication.java", type: "file" },
                        {
                          name: "presentation",
                          type: "folder",
                          children: [
                            {
                              name: "controller",
                              type: "folder",
                              children: [
                                { name: "UserController.java", type: "file" },
                                { name: "ProductController.java", type: "file" },
                              ],
                            },
                            {
                              name: "dto",
                              type: "folder",
                              children: [
                                { name: "UserDTO.java", type: "file" },
                                { name: "ProductDTO.java", type: "file" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "application",
                          type: "folder",
                          children: [
                            {
                              name: "service",
                              type: "folder",
                              children: [
                                { name: "UserApplicationService.java", type: "file" },
                                { name: "ProductApplicationService.java", type: "file" },
                              ],
                            },
                            {
                              name: "mapper",
                              type: "folder",
                              children: [
                                { name: "UserMapper.java", type: "file" },
                                { name: "ProductMapper.java", type: "file" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "domain",
                          type: "folder",
                          children: [
                            {
                              name: "model",
                              type: "folder",
                              children: [
                                { name: "User.java", type: "file" },
                                { name: "Product.java", type: "file" },
                              ],
                            },
                            {
                              name: "repository",
                              type: "folder",
                              children: [
                                { name: "UserRepository.java", type: "file" },
                                { name: "ProductRepository.java", type: "file" },
                              ],
                            },
                            {
                              name: "service",
                              type: "folder",
                              children: [
                                { name: "UserDomainService.java", type: "file" },
                                { name: "ProductDomainService.java", type: "file" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "infrastructure",
                          type: "folder",
                          children: [
                            {
                              name: "persistence",
                              type: "folder",
                              children: [
                                { name: "UserJpaRepository.java", type: "file" },
                                { name: "ProductJpaRepository.java", type: "file" },
                                { name: "UserEntity.java", type: "file" },
                                { name: "ProductEntity.java", type: "file" },
                              ],
                            },
                            {
                              name: "config",
                              type: "folder",
                              children: [
                                { name: "DatabaseConfig.java", type: "file" },
                                { name: "SecurityConfig.java", type: "file" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "resources",
                  type: "folder",
                  children: [
                    { name: "application.yml", type: "file" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  // Initialize state with default values
  const [projectData, setProjectData] = React.useState<ProjectData>({
    upload: {
      source: "file",
      fileName: "",
      url: ""
    },
    projectInfo: {
      purposeCode: "",
      projectName: "",
      description: "",
      repoName: "",
      defaultBranch: "master"
    },
    techOptions: {
      language: "java",
      javaVersion: "17",
      springBootVersion: "3.2.3",
      buildTool: "maven",
      groupId: "com.example",
      artifactId: "demo",
      basePackage: "com.example.demo",
      hexagonal: true,
      hexagonalLayout: architectures[1].structure, // Default to hex-4
      dependencies: [],
      starterKit: false,
      mock: {
        engine: "prism",
      },
      observability: {
        otel: false
      }
    }
  })

  const [selectedArchitecture, setSelectedArchitecture] = React.useState(1)

  // Generic update function for nested properties
  const updateProjectData = (path: string[], value: any) => {
    setProjectData(prevData => {
      const newData = { ...prevData }
      let current: any = newData

      // Navigate to the nested property
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] }
        current = current[path[i]]
      }

      // Update the final property
      current[path[path.length - 1]] = value

      return newData
    })
  }

  return (
    <ExampleWrapper>
      <ModeToggle />
      <UploadSpec
        data={projectData.upload}
        updateData={updateProjectData}
      />
      <ProjectInfo
        data={projectData.projectInfo}
        updateData={updateProjectData}
      />
      <ProjectConfiguration
        data={projectData.techOptions}
        architectures={architectures}
        selectedArchitecture={selectedArchitecture}
        setSelectedArchitecture={setSelectedArchitecture}
        updateData={updateProjectData}
        projectData={projectData}
      />
      <Summary projectData={projectData} />
      {/* Create the BuildLogs(Stepper Vertical Here) */}
      <ProjectOrchestrated projectData={projectData} />
    </ExampleWrapper>
  )
}

export function ImportApiCard({
  data,
  updateData
}: {
  data: ProjectData['upload']
  updateData: (path: string[], value: any) => void
}) {
  return (
    <Card className="relative w-full max-w-md">
      <CardHeader>
        <CardTitle>Import API Specification</CardTitle>
        <CardDescription>
          Upload your OpenAPI/Swagger definition to auto-configure your project.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Drag & Drop */}
        <div className="rounded-lg border border-dashed bg-muted/40 p-6 text-center">
          <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

          <p className="text-sm font-medium">
            Drag and drop or select files
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Supported files: PDF, PPTX, or DOCX
            <br />
            Max. file size: 25 MB
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              // Simulate file selection
              updateData(['upload', 'fileName'], 'spec.json')
              updateData(['upload', 'source'], 'file')
            }}
          >
            Select files
          </Button>
        </div>

        {/* OR IMPORT FROM URL */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            OR IMPORT FROM URL
          </span>
          <Separator className="flex-1" />
        </div>

        {/* URL Input */}
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Add file URL"
            value={data.url}
            onChange={(e) => {
              updateData(['upload', 'url'], e.target.value)
              updateData(['upload', 'source'], 'url')
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        <Button className="w-full">Next</Button>

        <Badge variant="secondary" className="ml-auto hidden">
          Beta
        </Badge>
      </CardFooter>
    </Card>
  )
}

function UploadSpec({
  data,
  updateData
}: {
  data: ProjectData['upload']
  updateData: (path: string[], value: any) => void
}) {
  return (
    <Example title="Upload Spec" className="items-center justify-center">
      <ImportApiCard data={data} updateData={updateData} />
    </Example>
  )
}

function ProjectInfo({
  data,
  updateData
}: {
  data: ProjectData['projectInfo']
  updateData: (path: string[], value: any) => void
}) {
  return (
    <Example title="Project Info" className="items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Define the identity and target environment for your service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="purpose-code">Purpose Code</FieldLabel>
                  <Input
                    id="purpose-code"
                    placeholder="P00000"
                    value={data.purposeCode}
                    onChange={(e) => updateData(['projectInfo', 'purposeCode'], e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
                  <Input
                    id="project-name"
                    placeholder="Payment Gateway Service"
                    value={data.projectName}
                    onChange={(e) => updateData(['projectInfo', 'projectName'], e.target.value)}
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="repo-name">Repository Name</FieldLabel>
                  <Input
                    id="repo-name"
                    placeholder="api-service-name"
                    value={data.repoName}
                    onChange={(e) => updateData(['projectInfo', 'repoName'], e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="default-branch">Default Branch</FieldLabel>
                  <Select
                    value={data.defaultBranch}
                    onValueChange={(value) => updateData(['projectInfo', 'defaultBranch'], value)}
                  >
                    <SelectTrigger id="default-branch">
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="main">Main</SelectItem>
                        <SelectItem value="develop">Develop</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Describe the main responsibility of this API"
                  value={data.description}
                  onChange={(e) => updateData(['projectInfo', 'description'], e.target.value)}
                />
              </Field>
              <Field orientation="responsive">
                <Button type="submit">Next</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function ProjectConfiguration({
  data,
  architectures,
  selectedArchitecture,
  setSelectedArchitecture,
  updateData,
  projectData
}: {
  data: ProjectData['techOptions']
  architectures: Architecture[]
  selectedArchitecture: number
  setSelectedArchitecture: (index: number) => void
  updateData: (path: string[], value: any) => void
  projectData: ProjectData
}) {
  return (
    <Example title="Project Configuration" className="items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Configure your project's technical specifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="language">Language</FieldLabel>
                  <Select
                    value={data.language}
                    onValueChange={(value) => updateData(['techOptions', 'language'], value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="kotlin">Kotlin</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="java-version">Java Version</FieldLabel>
                  <Select
                    value={data.javaVersion}
                    onValueChange={(value) => updateData(['techOptions', 'javaVersion'], value)}
                  >
                    <SelectTrigger id="java-version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="17">17</SelectItem>
                        <SelectItem value="21">21</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="spring-boot-version">Spring Boot Version</FieldLabel>
                  <Select
                    value={data.springBootVersion}
                    onValueChange={(value) => updateData(['techOptions', 'springBootVersion'], value)}
                    defaultValue="3.2.3"
                  >
                    <SelectTrigger id="spring-boot-version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="3.2.3">3.2.3</SelectItem>
                        <SelectItem value="3.1.9">3.1.9</SelectItem>
                        <SelectItem value="3.0.0">3.0.0</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="build-tool">Build Tool</FieldLabel>
                  <Select
                    value={data.buildTool}
                    onValueChange={(value) => updateData(['techOptions', 'buildTool'], value)}
                  >
                    <SelectTrigger id="build-tool">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="maven">Maven</SelectItem>
                        <SelectItem value="gradle">Gradle</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="group-id">Group ID</FieldLabel>
                <Input
                  id="group-id"
                  value={data.groupId}
                  onChange={(e) => updateData(['techOptions', 'groupId'], e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="artifact-id">Artifact ID</FieldLabel>
                <Input
                  id="artifact-id"
                  value={data.artifactId}
                  onChange={(e) => updateData(['techOptions', 'artifactId'], e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="base-package">Base Package</FieldLabel>
                <Input
                  id="base-package"
                  value={data.basePackage}
                  onChange={(e) => updateData(['techOptions', 'basePackage'], e.target.value)}
                />
              </Field>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FieldLabel htmlFor="hexagonal">Hexagonal Architecture</FieldLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable hexagonal (ports & adapters) architecture
                  </div>
                </div>
                <Switch
                  id="hexagonal"
                  checked={data.hexagonal}
                  onCheckedChange={(checked) => updateData(['techOptions', 'hexagonal'], checked)}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Dependencies Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
          <CardDescription>Define the dependencies for your service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <MultiSelect
                selected={data.dependencies}
                onChange={(selected) => updateData(['techOptions', 'dependencies'], selected)}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Architecture Carousel */}
      <Carousel className="w-full max-w-md">
        <CarouselContent>
          {architectures.map((architecture, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className={`relative mx-auto w-full max-w-sm ${selectedArchitecture === index ? 'border-primary' : ''}`}>
                  <CardHeader>
                    <CardAction>
                      <Badge variant={selectedArchitecture === index ? "default" : "secondary"}>
                        {selectedArchitecture === index ? 'Selected' : 'Featured'}
                      </Badge>
                    </CardAction>
                    <CardTitle>{architecture.name}</CardTitle>
                    <CardDescription>
                      {architecture.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1" variant="outline" size="sm">
                          <EyeIcon /> View Structure
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{architecture.name}</DialogTitle>
                          <DialogDescription>
                            {architecture.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
                          <FileTreeComponent data={architecture.structure} />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      className="flex-1"
                      variant={selectedArchitecture === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedArchitecture(index)
                        updateData(['techOptions', 'hexagonalLayout'], architecture.structure)
                      }}
                    >
                      {selectedArchitecture === index ? <CircleCheck className="mr-1" /> : null}
                      {selectedArchitecture === index ? 'Selected' : 'Select'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Build Setup Tabs */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Build Setup</CardTitle>
          <CardDescription>Select Quick Build or ING Starter Kit</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="quick-build"
            onValueChange={(value) => {
              if (value === "quick-build") {
                updateData(['techOptions', 'starterKit'], false)
              }
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="quick-build" className="flex-1">
                <SparkleIcon className="mr-2" />
                Quick Build
              </TabsTrigger>
              <TabsTrigger value="ing-starter-kit" className="flex-1">
                <CodeIcon className="mr-2" />
                ING Starter Kit
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quick-build">
              <Card>
                <CardHeader>
                  <CardTitle>Run a local build instantly.</CardTitle>
                  <CardDescription>
                    Perfect for rapid prototyping and development.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <Button
                    className="w-full"
                    onClick={() => updateData(['techOptions', 'starterKit'], false)}
                  >
                    Select Quick Build
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ing-starter-kit">
              <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4">
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="azure-devops-org">Azure DevOps Organisation</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <InfoIcon className="h-4 w-4" />
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <PopoverHeader>
                              <PopoverTitle>Azure DevOps Organisation</PopoverTitle>
                              <PopoverDescription>
                                Choose target ING Azure Devops organisation of your application.
                              </PopoverDescription>
                            </PopoverHeader>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Select
                        defaultValue="IngEurCDaaS01"
                        onValueChange={(value) => {
                          const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                            azureDevOpsOrganisation: 'IngEurCDaaS01',
                            platform: 'ICHPDE',
                            generationScope: 'pipelines-only',
                            resourceGeneration: 'init',
                            buildPipeline: 'helm',
                            purposeCode: '',
                            assetIndent: '',
                            applicationName: ''
                          }
                          updateData(['techOptions', 'starterKit'], {
                            ...currentKit,
                            azureDevOpsOrganisation: value
                          })
                        }}
                      >
                        <SelectTrigger id="azure-devops-org">
                          <SelectValue placeholder="Select organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="IngEurCDaaS01">IngEurCDaaS01</SelectItem>
                            <SelectItem value="IngEurCDaaS02">IngEurCDaaS02</SelectItem>
                            <SelectItem value="develop">Develop</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="platform">Platform</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Platform</PopoverTitle>
                            <PopoverDescription>
                              <span>ICHPDE - German Openshift Cluster</span>
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select
                      defaultValue="ICHPDE"
                      onValueChange={(value) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          platform: value
                        })
                      }}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ICHPDE">ICHPDE</SelectItem>
                          <SelectItem value="ICHPNL">ICHPNL</SelectItem>
                          <SelectItem value="ICHPPL">ICHPPL</SelectItem>
                          <SelectItem value="AZURE-PCF">Azure (PCF)</SelectItem>
                          <SelectItem value="ORACLE-DATABASE">Oracle Database</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="generation-scope">Generation Scope</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Generation Scope</PopoverTitle>
                            <PopoverDescription className="space-y-2">
                              <p>Each item includes matching pipelines.</p>
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select
                      defaultValue="pipelines-only"
                      onValueChange={(value) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          generationScope: value
                        })
                      }}
                    >
                      <SelectTrigger id="generation-scope">
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pipelines-only">Pipelines Only</SelectItem>
                          <SelectItem value="tpa-demo">TPA Demo with Sidecar</SelectItem>
                          <SelectItem value="network-health-checker">Network Health Checker</SelectItem>
                          <SelectItem value="aks-pave-road">AKS Pave Road</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="resource-generation">Resource Generation</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Resource Generation</PopoverTitle>
                            <PopoverDescription>
                              Choose resource generation mode.
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select
                      defaultValue="init"
                      onValueChange={(value) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          resourceGeneration: value
                        })
                      }}
                    >
                      <SelectTrigger id="resource-generation">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="init">Init</SelectItem>
                          <SelectItem value="add">Add</SelectItem>
                          <SelectItem value="develop">Develop</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="build-pipeline">Build Pipeline</FieldLabel>
                    <Select
                      defaultValue="helm"
                      onValueChange={(value) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          buildPipeline: value
                        })
                      }}
                    >
                      <SelectTrigger id="build-pipeline">
                        <SelectValue placeholder="Select pipeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="helm">Helm</SelectItem>
                          <SelectItem value="maven">Maven</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="tra">TRA</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* METADATA */}
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="purpose-code-kit">Purpose Code</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Purpose Code</PopoverTitle>
                            <PopoverDescription>
                              Purpose code starts with P followed by 5 digits.
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="purpose-code-kit"
                      placeholder="e.g. P12345"
                      value={projectData.projectInfo.purposeCode}
                      onChange={(e) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: projectData.projectInfo.purposeCode,
                          assetIndent: '',
                          applicationName: projectData.projectInfo.projectName
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          purposeCode: e.target.value
                        })
                      }}
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="asset-indent">Asset Indent</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Asset Indent</PopoverTitle>
                            <PopoverDescription>
                              Asset-Repo-Ident (case-sensitive).
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="asset-indent"
                      placeholder="e.g. IBBR"
                      onChange={(e) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          assetIndent: e.target.value
                        })
                      }}
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="application-name">Application Name</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Application Name</PopoverTitle>
                            <PopoverDescription>
                              Application name uniquely identifies your service.
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="application-name"
                      value={projectData.projectInfo.projectName}
                      placeholder="e.g. ibbr-backend"
                      onChange={(e) => {
                        const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                          azureDevOpsOrganisation: 'IngEurCDaaS01',
                          platform: 'ICHPDE',
                          generationScope: 'pipelines-only',
                          resourceGeneration: 'init',
                          buildPipeline: 'helm',
                          purposeCode: '',
                          assetIndent: '',
                          applicationName: ''
                        }
                        updateData(['techOptions', 'starterKit'], {
                          ...currentKit,
                          applicationName: e.target.value
                        })
                      }}
                      required
                    />
                  </Field>

                  <Field orientation="responsive">
                    <Button type="submit">Next</Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mock Server Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mock Server</CardTitle>
          <CardDescription>Select your type of mockserver</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="mock-engine">Engine</FieldLabel>
                <RadioGroup
                  defaultValue="wiremock"
                  value={data.mock.engine}
                  onValueChange={(value) => updateData(['techOptions', 'mock', 'engine'], value)}
                  className="w-fit"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="wiremock" id="r1" />
                    <Label htmlFor="r1">Wiremock</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="mockoon" id="r2" />
                    <Label htmlFor="r2">Mockoon</Label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Observability Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enable OpenTelemetry</CardTitle>
          <CardDescription>Jaeger tracing support</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="otel-mode"
                    checked={data.observability.otel}
                    onCheckedChange={(checked) => updateData(['techOptions', 'observability', 'otel'], checked)}
                  />
                  <Label htmlFor="otel-mode">Enable</Label>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function Summary({ projectData }: { projectData: ProjectData }) {
  return (
    <Example title="Summary" className="items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Summary & Generate</CardTitle>
          <CardDescription>Review your final configuration before launching orchestration.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Card>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                      {projectData.projectInfo.projectName || 'Untitled Project'}
                    </h4>
                    <p className="scroll-m-20 text-sm font-normal tracking-tight">
                      {projectData.projectInfo.description || 'No description macqy'}
                    </p>
                  </div>
                  <Badge>{projectData.projectInfo.purposeCode || 'N/A'}</Badge>
                </CardContent>
              </Card>

              <Card className='w-full max-w-lg'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5" />
                    <CardTitle>Source Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {projectData.projectInfo.repoName || 'N/A'}
                      </span>
                      <span className='text-muted-foreground text-sm'>Repository</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {projectData.projectInfo.defaultBranch}
                      </span>
                      <span className='text-muted-foreground text-sm'>Main Branch</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    <CardTitle>Infrastructure</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        Java {projectData.techOptions.javaVersion} / SB {projectData.techOptions.springBootVersion}
                      </span>
                      <span className='text-muted-foreground text-sm'>Runtime</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {projectData.techOptions.buildTool.charAt(0).toUpperCase() + projectData.techOptions.buildTool.slice(1)}
                      </span>
                      <span className='text-muted-foreground text-sm'>Build System</span>
                    </div>
                  </div>
                  {projectData.techOptions.hexagonal && (
                    <div className='flex items-center gap-4'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold'>Hexagonal</span>
                        <span className='text-muted-foreground text-sm'>Architecture</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Field orientation="responsive">
                <Button type="submit">Generate Project</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card className='w-full max-w-full'>
        <CardHeader>
          <CardTitle>Collected Configuration (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={projectData} rootName="data" />
        </CardContent>
      </Card>
    </Example>
  )
}

function ProjectOrchestrated({ projectData }: { projectData: ProjectData }) {
  return (
    <Example title="Project Orchestrated" className="items-center justify-center">
      <div className="flex items-start w-fit rounded-full p-5 bg-green-300">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Project Orchestrated!
      </h1>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Your service {projectData.projectInfo.projectName || 'Project'} is ready for development.
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <Button className="p-7 cursor-pointer" variant="secondary" size="lg">
          <GitBranch /> Open Repository
        </Button>
        <Button className="p-7 cursor-pointer" variant="secondary" size="lg">
          <Router /> Run Mock Server
        </Button>
        <Button className="p-7 cursor-pointer" variant="secondary" size="lg">
          <SquareCode /> Download Code
        </Button>
        <Button className="p-7 cursor-pointer" variant="secondary" size="lg">
          <BookOpen /> View README
        </Button>
      </div>
      <Card className='w-full max-w-full'>
        <CardHeader>
          <CardTitle>Collected Manifest (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Postman Like Component */}
        </CardContent>
      </Card>
    </Example>
  )
}