"use client"

import * as React from "react"
import { toast } from "sonner"

import { WizardLayout } from "@/components/wizard-layout"
import { UploadSpecStep } from "@/components/steps/upload-spec-step"
import { BuildLogsStep } from "@/components/steps/build-logs-step"
import { ApiTestingStep } from "@/components/steps/api-testing-step"
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "./ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "./ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

import { SparkleIcon, CodeIcon, Upload, Link as LinkIcon, InfoIcon, FolderGit2, HardDrive, Paperclip, CircleCheck, Check, GitBranch, Router, SquareCode, BookOpen } from "lucide-react"

import { FileNode, FileTreeComponent } from "./file-tree"
import { JsonViewer } from "./json-tree-viewer"
import { ModeToggle } from "./mode-toggle"
import { fetchOpenApiSpec } from "@/lib/openapi-validator"

// Define the type for your JSON data
interface ProjectData {
  upload: {
    source: string
    fileName: string
    url: string
    specData?: any // Stores the fetched OpenAPI spec
    isValidating?: boolean // Indicates if validation is in progress
    isValid?: boolean // Indicates if the spec is valid
    validationError?: string // Stores validation error messages
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
    hexagonalLayout: string
    dependencies: string[]
    starterKit: boolean | {
      azureDevOpsOrganisation: string
      platform: string
      generationScope: string
      resourceGeneration: string
      buildPipeline: {
        helm: { enabled: boolean; multiModuleProject: boolean; sonarQube: boolean }
        maven: { enabled: boolean; multiModuleProject: boolean; sonarQube: boolean }
        image: { enabled: boolean; sidecar: boolean; multiTemplate: boolean }
        tpa: { enabled: boolean; resources: boolean; ctk: boolean }
      }
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
    scaffoldingMode: string
  }
  scaffoldType: 'ai' | 'standard'
}

interface Architecture {
  id: string
  name: string
  description: string
  diagramPath: string
}

export function ComponentExample() {
  // Define wizard steps
  const wizardSteps = [
    { id: 1, label: "UPLOAD SPEC" },
    { id: 2, label: "PROJECT INFO" },
    { id: 3, label: "TECH STACK" },
    { id: 4, label: "SUMMARY" },
    { id: 5, label: "BUILD LOGS" },
  ]

  // Architecture options for the carousel
  const architectures: Architecture[] = [
    {
      id: "hex-3",
      name: "Hexagonal 3-Module",
      description: "Traditional hexagonal architecture with adapter, domain, and application layers.",
      diagramPath: "/architectures/hex-3.html",
    },
    {
      id: "hex-4",
      name: "Hexagonal 4-Module",
      description: "Hexagonal architecture with separate persistence layer using ports and adapters pattern.",
      diagramPath: "/architectures/hex-4.html",
    },
    {
      id: "multi-module",
      name: "Multi-Module",
      description: "Layered architecture with separate modules for presentation, application, domain, and infrastructure.",
      diagramPath: "/architectures/multi-module.html",
    },
  ]

  // Initial state — also used by the "New Project" reset
  const initialProjectData: ProjectData = {
    upload: {
      source: "file",
      fileName: "",
      url: "",
      specData: undefined,
      isValidating: false,
      isValid: false,
      validationError: undefined
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
      hexagonalLayout: "",
      dependencies: [],
      starterKit: false,
      mock: {
        engine: "prism",
      },
      observability: {
        otel: false
      },
      scaffoldingMode: "standard"
    },
    scaffoldType: "standard"
  }

  const [projectData, setProjectData] = React.useState<ProjectData>(initialProjectData)

  const [selectedArchitecture, setSelectedArchitecture] = React.useState<number | null>(null)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])
  const [wizardCompleted, setWizardCompleted] = React.useState(false)
  const [buildLogsComplete, setBuildLogsComplete] = React.useState(false)

  // Validation error states — set by handleStepValidation, cleared on input change
  const [step1Errors, setStep1Errors] = React.useState({ fileUpload: false })
  const [step2Errors, setStep2Errors] = React.useState({ purposeCode: false, projectName: false, repoName: false })
  const [step3Errors, setStep3Errors] = React.useState({ architecture: false })

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

  // Update completed steps based on validation
  React.useEffect(() => {
    const newCompletedSteps: number[] = []

    // Validate Step 1: Upload Spec
    // For file upload: check fileName exists
    // For URL upload: check URL exists (validation happens on Next click)
    const step1Complete =
      (projectData.upload.source === 'file' && projectData.upload.fileName) ||
      (projectData.upload.source === 'url' && projectData.upload.url)

    if (step1Complete) {
      newCompletedSteps.push(1)
    }

    // Validate Step 2: Project Info
    const step2Complete =
      projectData.projectInfo.purposeCode &&
      projectData.projectInfo.projectName &&
      projectData.projectInfo.repoName

    if (step2Complete) {
      newCompletedSteps.push(2)
    }

    // Step 3: Tech Stack - hexagonalLayout (architecture) is mandatory
    const step3Complete = projectData.techOptions.hexagonalLayout !== ""

    if (step3Complete) {
      newCompletedSteps.push(3)
    }

    // Step 4: Summary - only complete if step 2 is complete
    if (step2Complete) {
      newCompletedSteps.push(4)
    }

    // Step 5: Build Logs - only complete once all build steps have finished
    if (buildLogsComplete) {
      newCompletedSteps.push(5)
    }

    setCompletedSteps(newCompletedSteps)
  }, [projectData, selectedArchitecture, buildLogsComplete])

  // Validation handler for step transitions
  const handleStepValidation = async (fromStep: number, toStep: number): Promise<boolean> => {
    // Only validate when moving forward from step 1
    if (fromStep === 1 && toStep > 1) {
      // If source is URL, validate it
      if (projectData.upload.source === 'url') {
        if (!projectData.upload.url) {
          toast.error('Please enter an OpenAPI Specification URL')
          updateProjectData(['upload', 'validationError'], 'Please enter a URL')
          return false
        }

        // If URL hasn't been validated yet or has changed, validate it
        if (!projectData.upload.isValid) {
          // Set validating state
          updateProjectData(['upload', 'isValidating'], true)
          updateProjectData(['upload', 'validationError'], undefined)

          // Fetch and validate the spec
          const result = await fetchOpenApiSpec(projectData.upload.url)

          // Update state with results
          updateProjectData(['upload', 'isValidating'], false)

          if (result.isValid && result.specData) {
            updateProjectData(['upload', 'specData'], result.specData)
            updateProjectData(['upload', 'isValid'], true)
            updateProjectData(['upload', 'validationError'], undefined)
            updateProjectData(['upload', 'fileName'], `${result.type}-spec.json`)
            toast.success('OpenAPI specification validated successfully')
            return true
          } else {
            updateProjectData(['upload', 'validationError'], result.error || 'Invalid OpenAPI specification')
            updateProjectData(['upload', 'isValid'], false)
            updateProjectData(['upload', 'specData'], undefined)
            toast.error(result.error || 'Invalid OpenAPI specification')
            return false
          }
        }
      }

      // If source is file, just check if file is selected
      if (projectData.upload.source === 'file' && !projectData.upload.fileName) {
        toast.error('Please select a file to upload')
        setStep1Errors({ fileUpload: true })
        return false
      }
    }

    // Validate step 2 → 3: Purpose Code, Project Name, Repository Name
    if (fromStep === 2 && toStep > 2) {
      const errors = {
        purposeCode: !projectData.projectInfo.purposeCode,
        projectName: !projectData.projectInfo.projectName,
        repoName: !projectData.projectInfo.repoName,
      }
      if (errors.purposeCode || errors.projectName || errors.repoName) {
        setStep2Errors(errors)
        toast.error('Please fill in all required fields')
        // Focus the first empty field
        if (errors.purposeCode) document.getElementById('purpose-code')?.focus()
        else if (errors.projectName) document.getElementById('project-name')?.focus()
        else if (errors.repoName) document.getElementById('repo-name')?.focus()
        return false
      }
    }

    // Validate step 3 → 4: Architecture must be selected
    if (fromStep === 3 && toStep > 3) {
      if (!projectData.techOptions.hexagonalLayout) {
        setStep3Errors({ architecture: true })
        toast.error('Please select an architecture to continue')
        return false
      }
    }

    return true
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UploadSpecStep
            data={projectData.upload}
            updateData={updateProjectData}
            errors={step1Errors}
            onClearError={(field) => setStep1Errors(prev => ({ ...prev, [field]: false }))}
          />
        )
      case 2:
        return (
          <ProjectInfoStep
            data={projectData.projectInfo}
            updateData={updateProjectData}
            errors={step2Errors}
            onClearError={(field) => setStep2Errors(prev => ({ ...prev, [field]: false }))}
          />
        )
      case 3:
        return (
          <ProjectConfigurationStep
            data={projectData.techOptions}
            architectures={architectures}
            selectedArchitecture={selectedArchitecture}
            setSelectedArchitecture={setSelectedArchitecture}
            updateData={updateProjectData}
            projectData={projectData}
            errors={step3Errors}
            onClearError={(field) => setStep3Errors(prev => ({ ...prev, [field]: false }))}
          />
        )
      case 4:
        return <SummaryStep projectData={projectData} updateData={updateProjectData} />
      case 5:
        return (
          <BuildLogsStep
            onComplete={() => setWizardCompleted(true)}
            onBuildComplete={() => setBuildLogsComplete(true)}
            projectName={projectData.projectInfo.projectName || "Project"}
          />
        )
      default:
        return null
    }
  }

  // If wizard is completed, show the API testing interface
  if (wizardCompleted) {
    return (
      <ApiTestingStep
        projectName={projectData.projectInfo.projectName}
        onBack={() => {
          setWizardCompleted(false)
          setCurrentStep(5)
        }}
        onNewProject={() => {
          setWizardCompleted(false)
          setProjectData(initialProjectData)
          setCurrentStep(1)
          setCompletedSteps([])
          setBuildLogsComplete(false)
          setSelectedArchitecture(null)
          setStep1Errors({ fileUpload: false })
          setStep2Errors({ purposeCode: false, projectName: false, repoName: false })
          setStep3Errors({ architecture: false })
        }}
      />
    )
  }

  return (
    <WizardLayout
      steps={wizardSteps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onStartOver={() => {
        setProjectData(initialProjectData)
        setCurrentStep(1)
        setCompletedSteps([])
        setBuildLogsComplete(false)
        setSelectedArchitecture(null)
        setStep1Errors({ fileUpload: false })
        setStep2Errors({ purposeCode: false, projectName: false, repoName: false })
        setStep3Errors({ architecture: false })
      }}
      completedSteps={completedSteps}
      onValidateStep={handleStepValidation}
    >
      {renderStepContent()}
    </WizardLayout>
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

function ProjectInfoStep({
  data,
  updateData,
  errors = { purposeCode: false, projectName: false, repoName: false },
  onClearError
}: {
  data: ProjectData['projectInfo']
  updateData: (path: string[], value: any) => void
  errors?: { purposeCode: boolean; projectName: boolean; repoName: boolean }
  onClearError?: (field: string) => void
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Project Information
        </h1>
        <p className="text-muted-foreground">
          Define the identity and target environment for your service.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="purpose-code" className={errors.purposeCode ? "text-destructive" : ""}>
                    Purpose Code <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="purpose-code"
                    placeholder="P00000"
                    value={data.purposeCode}
                    onChange={(e) => {
                      updateData(['projectInfo', 'purposeCode'], e.target.value)
                      if (e.target.value) onClearError?.('purposeCode')
                    }}
                    className={errors.purposeCode ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  {errors.purposeCode && (
                    <p className="text-sm text-destructive">Purpose Code is required</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="project-name" className={errors.projectName ? "text-destructive" : ""}>
                    Project Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="project-name"
                    placeholder="Payment Gateway Service"
                    value={data.projectName}
                    onChange={(e) => {
                      updateData(['projectInfo', 'projectName'], e.target.value)
                      if (e.target.value) onClearError?.('projectName')
                    }}
                    className={errors.projectName ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  {errors.projectName && (
                    <p className="text-sm text-destructive">Project Name is required</p>
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="repo-name" className={errors.repoName ? "text-destructive" : ""}>
                    Repository Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="repo-name"
                    placeholder="api-service-name"
                    value={data.repoName}
                    onChange={(e) => {
                      updateData(['projectInfo', 'repoName'], e.target.value)
                      if (e.target.value) onClearError?.('repoName')
                    }}
                    className={errors.repoName ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  {errors.repoName && (
                    <p className="text-sm text-destructive">Repository Name is required</p>
                  )}
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
                        <SelectItem value="master">master</SelectItem>
                        <SelectItem value="main">main</SelectItem>
                        <SelectItem value="develop">develop</SelectItem>
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
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectConfigurationStep({
  data,
  architectures,
  selectedArchitecture,
  setSelectedArchitecture,
  updateData,
  projectData,
  errors = { architecture: false },
  onClearError
}: {
  data: ProjectData['techOptions']
  architectures: Architecture[]
  selectedArchitecture: number | null
  setSelectedArchitecture: (index: number) => void
  updateData: (path: string[], value: any) => void
  projectData: ProjectData
  errors?: { architecture: boolean }
  onClearError?: (field: string) => void
}) {
  // Send theme to iframes
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    const theme = isDark ? 'dark' : 'light'

    // Send theme to all iframes
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      iframe.contentWindow?.postMessage({ theme }, '*')
    })

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark')
      const themeNow = isDarkNow ? 'dark' : 'light'
      iframes.forEach(iframe => {
        iframe.contentWindow?.postMessage({ theme: themeNow }, '*')
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // Tracks whether the user has actively clicked "Select Quick Build"
  const [quickBuildSelected, setQuickBuildSelected] = React.useState(false)

  // Reset the selected state whenever the user switches to Starter Kit
  React.useEffect(() => {
    if (typeof data.starterKit === 'object') {
      setQuickBuildSelected(false)
    }
  }, [data.starterKit])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
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
      </div>

      {/* Architecture Carousel */}
      <div className={`rounded-lg ${errors.architecture ? 'ring-2 ring-destructive ring-offset-2' : ''}`}>
        <Carousel className="w-full">
          <CarouselContent>
            {architectures.map((architecture, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className={`relative mx-auto w-full ${selectedArchitecture === index ? 'border-primary' : ''}`}>
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
                    <CardContent>
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border bg-card">
                        <iframe
                          src={architecture.diagramPath}
                          title={architecture.name}
                          className="w-full h-full border-0"
                          style={{ colorScheme: 'normal' }}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        className="w-full"
                        variant={selectedArchitecture === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedArchitecture(index)
                          updateData(['techOptions', 'hexagonalLayout'], architecture.id)
                          onClearError?.('architecture')
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
      </div>
      {errors.architecture && (
        <p className="text-sm text-destructive">Please select an architecture to continue</p>
      )}

      <div className="grid grid-cols-2 gap-5">
        {/* Build Setup Tabs */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Build Setup</CardTitle>
            <CardDescription>Select Quick Build or ING Starter Kit</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={typeof data.starterKit === 'object' ? "ing-starter-kit" : "quick-build"}
              onValueChange={(value) => {
                if (value === "quick-build") {
                  // Reset starterKit entirely — clears any previously filled fields
                  updateData(['techOptions', 'starterKit'], false)
                  toast.success("Quick Build selected", {
                    description: "ING Starter Kit configuration has been cleared.",
                    duration: 3000,
                  })
                } else {
                  // Initialise the Starter Kit object only if not already one
                  if (typeof data.starterKit !== 'object') {
                    updateData(['techOptions', 'starterKit'], {
                      azureDevOpsOrganisation: 'IngEurCDaaS01',
                      platform: 'ICHPDE',
                      generationScope: 'pipelines-only',
                      resourceGeneration: 'init',
                      buildPipeline: {
                        helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                        maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                        image: { enabled: false, sidecar: false, multiTemplate: false },
                        tpa: { enabled: false, resources: false, ctk: false }
                      },
                      purposeCode: '',
                      assetIndent: '',
                      applicationName: ''
                    })
                  }
                  toast.success("ING Starter Kit selected", {
                    description: "Fill in the details below to configure your pipeline.",
                    duration: 3000,
                  })
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
                      variant={quickBuildSelected ? "default" : "secondary"}
                      onClick={() => {
                        updateData(['techOptions', 'starterKit'], false)
                        setQuickBuildSelected(true)
                        toast.success("Quick Build selected", {
                          description: "ING Starter Kit configuration has been cleared.",
                          duration: 3000,
                        })
                      }}
                    >
                      {quickBuildSelected && (
                        <Check className="h-4 w-4 mr-2 animate-in fade-in slide-in-from-left-2 duration-300" />
                      )}
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
                              buildPipeline: {
                                helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                                maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                                image: { enabled: false, sidecar: false, multiTemplate: false },
                                tpa: { enabled: false, resources: false, ctk: false }
                              },
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                      <div className="space-y-3 rounded-md border p-3">
                        {/* Helm */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="helm-enabled"
                              checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.helm.enabled}
                              onCheckedChange={(checked) => {
                                const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                                  azureDevOpsOrganisation: 'IngEurCDaaS01',
                                  platform: 'ICHPDE',
                                  generationScope: 'pipelines-only',
                                  resourceGeneration: 'init',
                                  buildPipeline: {
                                    helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    image: { enabled: false, sidecar: false, multiTemplate: false },
                                    tpa: { enabled: false, resources: false, ctk: false }
                                  },
                                  purposeCode: '',
                                  assetIndent: '',
                                  applicationName: ''
                                }
                                updateData(['techOptions', 'starterKit'], {
                                  ...currentKit,
                                  buildPipeline: {
                                    ...currentKit.buildPipeline,
                                    helm: { ...currentKit.buildPipeline.helm, enabled: checked as boolean }
                                  }
                                })
                              }}
                            />
                            <Label htmlFor="helm-enabled" className="font-semibold cursor-pointer">Helm</Label>
                          </div>
                          {typeof data.starterKit === 'object' && data.starterKit.buildPipeline.helm.enabled && (
                            <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="helm-multimodule"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.helm.multiModuleProject}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        helm: { ...currentKit.buildPipeline.helm, multiModuleProject: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.helm.enabled}
                                />
                                <Label htmlFor="helm-multimodule" className="text-sm cursor-pointer">Multi-Module Project</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="helm-sonarqube"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.helm.sonarQube}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        helm: { ...currentKit.buildPipeline.helm, sonarQube: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.helm.enabled}
                                />
                                <Label htmlFor="helm-sonarqube" className="text-sm cursor-pointer">SonarQube</Label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Maven */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="maven-enabled"
                              checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.maven.enabled}
                              onCheckedChange={(checked) => {
                                const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                                  azureDevOpsOrganisation: 'IngEurCDaaS01',
                                  platform: 'ICHPDE',
                                  generationScope: 'pipelines-only',
                                  resourceGeneration: 'init',
                                  buildPipeline: {
                                    helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    image: { enabled: false, sidecar: false, multiTemplate: false },
                                    tpa: { enabled: false, resources: false, ctk: false }
                                  },
                                  purposeCode: '',
                                  assetIndent: '',
                                  applicationName: ''
                                }
                                updateData(['techOptions', 'starterKit'], {
                                  ...currentKit,
                                  buildPipeline: {
                                    ...currentKit.buildPipeline,
                                    maven: { ...currentKit.buildPipeline.maven, enabled: checked as boolean }
                                  }
                                })
                              }}
                            />
                            <Label htmlFor="maven-enabled" className="font-semibold cursor-pointer">Maven</Label>
                          </div>
                          {typeof data.starterKit === 'object' && data.starterKit.buildPipeline.maven.enabled && (
                            <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="maven-multimodule"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.maven.multiModuleProject}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        maven: { ...currentKit.buildPipeline.maven, multiModuleProject: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.maven.enabled}
                                />
                                <Label htmlFor="maven-multimodule" className="text-sm cursor-pointer">Multi-Module Project</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="maven-sonarqube"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.maven.sonarQube}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        maven: { ...currentKit.buildPipeline.maven, sonarQube: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.maven.enabled}
                                />
                                <Label htmlFor="maven-sonarqube" className="text-sm cursor-pointer">SonarQube</Label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="image-enabled"
                              checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.image.enabled}
                              onCheckedChange={(checked) => {
                                const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                                  azureDevOpsOrganisation: 'IngEurCDaaS01',
                                  platform: 'ICHPDE',
                                  generationScope: 'pipelines-only',
                                  resourceGeneration: 'init',
                                  buildPipeline: {
                                    helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    image: { enabled: false, sidecar: false, multiTemplate: false },
                                    tpa: { enabled: false, resources: false, ctk: false }
                                  },
                                  purposeCode: '',
                                  assetIndent: '',
                                  applicationName: ''
                                }
                                updateData(['techOptions', 'starterKit'], {
                                  ...currentKit,
                                  buildPipeline: {
                                    ...currentKit.buildPipeline,
                                    image: { ...currentKit.buildPipeline.image, enabled: checked as boolean }
                                  }
                                })
                              }}
                            />
                            <Label htmlFor="image-enabled" className="font-semibold cursor-pointer">Image</Label>
                          </div>
                          {typeof data.starterKit === 'object' && data.starterKit.buildPipeline.image.enabled && (
                            <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="image-sidecar"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.image.sidecar}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        image: { ...currentKit.buildPipeline.image, sidecar: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.image.enabled}
                                />
                                <Label htmlFor="image-sidecar" className="text-sm cursor-pointer">Sidecar</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="image-multitemplate"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.image.multiTemplate}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        image: { ...currentKit.buildPipeline.image, multiTemplate: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.image.enabled}
                                />
                                <Label htmlFor="image-multitemplate" className="text-sm cursor-pointer">Multi-Template</Label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* TPA */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="tpa-enabled"
                              checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.tpa.enabled}
                              onCheckedChange={(checked) => {
                                const currentKit = typeof data.starterKit === 'object' ? data.starterKit : {
                                  azureDevOpsOrganisation: 'IngEurCDaaS01',
                                  platform: 'ICHPDE',
                                  generationScope: 'pipelines-only',
                                  resourceGeneration: 'init',
                                  buildPipeline: {
                                    helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                                    image: { enabled: false, sidecar: false, multiTemplate: false },
                                    tpa: { enabled: false, resources: false, ctk: false }
                                  },
                                  purposeCode: '',
                                  assetIndent: '',
                                  applicationName: ''
                                }
                                updateData(['techOptions', 'starterKit'], {
                                  ...currentKit,
                                  buildPipeline: {
                                    ...currentKit.buildPipeline,
                                    tpa: { ...currentKit.buildPipeline.tpa, enabled: checked as boolean }
                                  }
                                })
                              }}
                            />
                            <Label htmlFor="tpa-enabled" className="font-semibold cursor-pointer">TPA</Label>
                          </div>
                          {typeof data.starterKit === 'object' && data.starterKit.buildPipeline.tpa.enabled && (
                            <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="tpa-resources"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.tpa.resources}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        tpa: { ...currentKit.buildPipeline.tpa, resources: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.tpa.enabled}
                                />
                                <Label htmlFor="tpa-resources" className="text-sm cursor-pointer">Resources</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="tpa-ctk"
                                  checked={typeof data.starterKit === 'object' && data.starterKit.buildPipeline.tpa.ctk}
                                  onCheckedChange={(checked) => {
                                    const currentKit = data.starterKit as Exclude<typeof data.starterKit, boolean>
                                    updateData(['techOptions', 'starterKit'], {
                                      ...currentKit,
                                      buildPipeline: {
                                        ...currentKit.buildPipeline,
                                        tpa: { ...currentKit.buildPipeline.tpa, ctk: checked as boolean }
                                      }
                                    })
                                  }}
                                  disabled={typeof data.starterKit !== 'object' || !data.starterKit.buildPipeline.tpa.enabled}
                                />
                                <Label htmlFor="tpa-ctk" className="text-sm cursor-pointer">CTK</Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                            buildPipeline: {
                              helm: { enabled: false, multiModuleProject: false, sonarQube: false },
                              maven: { enabled: false, multiModuleProject: false, sonarQube: false },
                              image: { enabled: false, sidecar: false, multiTemplate: false },
                              tpa: { enabled: false, resources: false, ctk: false }
                            },
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
                      <Button
                        type="button"
                        onClick={() => {
                          toast.success("ING Starter Kit confirmed", {
                            description: "Your pipeline configuration has been saved.",
                            duration: 3000,
                          })
                        }}
                      >
                        Done
                      </Button>
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
                    defaultValue="faker"
                    value={data.mock.engine}
                    onValueChange={(value) => updateData(['techOptions', 'mock', 'engine'], value)}
                    className="w-fit"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="faker" id="r1" />
                      <Label htmlFor="r1">Faker</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="ai-powered" id="r2" />
                      <Label htmlFor="r2">AI-Powered</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="hybrid" id="r2" />
                      <Label htmlFor="r2">Hybrid</Label>
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
      </div>
    </div>
  )
}

function SummaryStep({ projectData, updateData }: { projectData: ProjectData; updateData: (path: string[], value: any) => void }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Summary & Generate
        </h1>
        <p className="text-muted-foreground">
          Review your final configuration before launching orchestration.
        </p>
      </div>

      {/* Two-column layout: Summary cards (left) + Scaffolding (right) */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left column — project summary cards */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="flex justify-between items-center pt-6">
                  <div>
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                      {projectData.projectInfo.projectName || 'Untitled Project'}
                    </h4>
                    <p className="scroll-m-20 text-sm font-normal tracking-tight">
                      {projectData.projectInfo.description || 'No description'}
                    </p>
                  </div>
                  <Badge>{projectData.projectInfo.purposeCode || 'N/A'}</Badge>
                </CardContent>
              </Card>

              <Card className='w-full'>
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
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Right column — scaffolding mode selector */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Scaffolding</CardTitle>
            <CardDescription>Choose how your project should be scaffolded.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={projectData.techOptions.scaffoldingMode}
              onValueChange={(value) => {
                updateData(['techOptions', 'scaffoldingMode'], value)
                updateData(['scaffoldType'], value === 'ai-assisted' ? 'ai' : 'standard')
              }}
              className="space-y-4"
            >
              {/* Standard Scaffolding */}
              <div
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  projectData.techOptions.scaffoldingMode === 'standard'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
                onClick={() => {
                  updateData(['techOptions', 'scaffoldingMode'], 'standard')
                  updateData(['scaffoldType'], 'standard')
                }}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="standard" id="scaffold-standard" className="mt-0.5" />
                  <div className="space-y-1">
                    <Label htmlFor="scaffold-standard" className="text-sm font-semibold cursor-pointer">
                      Standard Scaffolding
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Uses Spring Initializr / predefined templates
                    </p>
                  </div>
                </div>
              </div>

              {/* AI-Assisted Scaffolding */}
              <div
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  projectData.techOptions.scaffoldingMode === 'ai-assisted'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
                onClick={() => {
                  updateData(['techOptions', 'scaffoldingMode'], 'ai-assisted')
                  updateData(['scaffoldType'], 'ai')
                }}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="ai-assisted" id="scaffold-ai" className="mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="scaffold-ai" className="text-sm font-semibold cursor-pointer">
                        AI-Assisted Scaffolding
                      </Label>
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <SparkleIcon className="h-3 w-3" />
                        AI
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uses AI to generate project structure and code
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Full-width JSON config */}
      <Card className='w-full max-w-full'>
        <CardHeader>
          <CardTitle>Collected Configuration (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={projectData} rootName="data" />
        </CardContent>
      </Card>
    </div>
  )
}