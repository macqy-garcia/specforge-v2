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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SparkleIcon, CodeIcon, Upload, Link as LinkIcon, InfoIcon, MoreVerticalIcon, FileIcon, FolderIcon, FolderOpenIcon, FileCodeIcon, MoreHorizontalIcon, FolderSearchIcon, SaveIcon, DownloadIcon, EyeIcon, LayoutIcon, PaletteIcon, SunIcon, MoonIcon, MonitorIcon, UserIcon, CreditCardIcon, SettingsIcon, KeyboardIcon, LanguagesIcon, BellIcon, MailIcon, ShieldIcon, HelpCircleIcon, FileTextIcon, LogOutIcon } from "lucide-react"
import { MultiSelect } from "./ui/multi-select"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "./ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import { FileNode, FileTreeComponent } from "./file-tree"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <CardExample />
      <ProjectInfo />
      <ProjectConfiguration />
      <ProjectMetadata />
      <Dependencies />
      <FileTree />
      <BuildSetup />
    </ExampleWrapper>
  )
}

export function ImportApiCard() {
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

          <Button variant="outline" size="sm" className="mt-4">
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

function CardExample() {
  return (
    <Example title="Upload Spec" className="items-center justify-center">
      {/* <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <CardHeader>
          <CardTitle>Import API Specification</CardTitle>
          <CardDescription>
            Upload your OpenAPI/Swagger definition to auto-configure your project.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <PlusIcon data-icon="inline-start" />
                Show Dialog
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <BluetoothIcon
                  />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card> */}
      <ImportApiCard />
    </Example>
  )
}

function ProjectInfo() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Project Info">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Define the identity and target environment for your service.</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Purpose Code</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="P00000"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-name">Project Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Payment Gateway Service"
                    required
                  />
                </Field>
                {/* <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="small-form-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field> */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Repository Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="api-service-name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Default Branch</FieldLabel>
                  <Select defaultValue="master">
                    <SelectTrigger id="small-form-role">
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
                <FieldLabel htmlFor="small-form-comments">Description</FieldLabel>
                <Textarea
                  id="small-form-comments"
                  placeholder="Describe the main responsibility of this API"
                />
              </Field>
              <Field orientation="responsive">
                <Button type="submit">Next</Button>
                {/* <Button variant="outline" type="button">
                  Cancel
                </Button> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function ProjectConfiguration() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Tech Stack">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
          <CardDescription>Tailor your Spring Boot project settings and dependencies.</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Project</FieldLabel>
                  <RadioGroup defaultValue="gradlegroovy" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="gradlegroovy" id="r1" />
                      <Label htmlFor="r1">Gradle - Groovy</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="maven" id="r2" />
                      <Label htmlFor="r2">Maven</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-name">Language</FieldLabel>
                  <RadioGroup defaultValue="java" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="java" id="r1" />
                      <Label htmlFor="r1">Java</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="kotlin" id="r2" />
                      <Label htmlFor="r2">Kotlin</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="groovy" id="r2" />
                      <Label htmlFor="r2">Groovy</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Spring Boot</FieldLabel>
                  <RadioGroup defaultValue="3.2.3" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="3.2.3" id="r1" />
                      <Label htmlFor="r1">3.2.3</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="3.1.9" id="r2" />
                      <Label htmlFor="r2">3.1.9</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="3.0.0" id="r2" />
                      <Label htmlFor="r2">3.0.0</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-name">Packaging</FieldLabel>
                  <RadioGroup defaultValue="jar" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="jar" id="r1" />
                      <Label htmlFor="r1">JAR</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="war" id="r2" />
                      <Label htmlFor="r2">WAR</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Java</FieldLabel>
                  <RadioGroup defaultValue="21" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="21" id="r1" />
                      <Label htmlFor="r1">21</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="17" id="r2" />
                      <Label htmlFor="r2">17</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="11" id="r2" />
                      <Label htmlFor="r2">11</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </div>
              <Field orientation="responsive">
                <Button type="submit">Next</Button>
                {/* <Button variant="outline" type="button">
                  Cancel
                </Button> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function ProjectMetadata() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Project Metadata">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Metadata</CardTitle>
          <CardDescription>Define the identity and target environment for your service.</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Group</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="com.example"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-name">Artifact</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="demo"
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="demo"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-name">Package Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="com.example.demo"
                    required
                  />
                </Field>
              </div>
              <Field orientation="responsive">
                <Button type="submit">Next</Button>
                {/* <Button variant="outline" type="button">
                  Cancel
                </Button> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function Dependencies() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Project Dependencies">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
          <CardDescription>Define the dependencies for your service.</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <MultiSelect />
              <Field orientation="responsive">
                <Button variant="default" type="submit">Next</Button>
                {/* <Button variant="outline" type="button">
                  Cancel
                </Button> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function FileTree() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  interface Architecture {
    id: string;
    name: string;
    description: string;
    structure: FileNode[];
  }

  const architectures: Architecture[] = [
    {
      id: "standard",
      name: "Standard",
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
      id: "hexagonal",
      name: "Hexagonal (Ports & Adapters)",
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
      id: "layered",
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
  ];

  const FILE_TREE: FileNode[] = [
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
  ];

  return (
    <Example title="Project Architecture">
      <Carousel className="w-full max-w-full ">
        <CarouselContent>
          {architectures.map((architecture, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{architecture.name}</CardTitle>
                    <CardDescription>
                      {architecture.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <FileTreeComponent data={architecture.structure} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Example>
  )
}

function BuildSetup() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Build Setup">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Build Setup</CardTitle>
          <CardDescription>Select Quick Build or ING Starter Kit</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quick-build">
            <TabsList>
              <TabsTrigger value="quick-build">
                <SparkleIcon />
                Quick Build
              </TabsTrigger>
              <TabsTrigger value="ing-starter-kit">
                <CodeIcon />
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
                  <Button className="w-full">Select Quick Build</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ing-starter-kit">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Basic configuration</CardTitle>
                  <CardDescription>
                    Select ING starter-kit configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  
                </CardContent>
              </Card> */}
              <form>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4">
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="small-form-role">Azure DevOps Organisation</FieldLabel>
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
                      <Select defaultValue="IngEurCDaaS01">
                        <SelectTrigger id="small-form-role">
                          <SelectValue placeholder="Select a branch" />
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
                      <FieldLabel htmlFor="small-form-role">Platform</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Platform</PopoverTitle>
                            <PopoverDescription>
                              <p>ICHPDE - German Openshift Cluster</p>
                              <Button className="p-0" variant="link">Documentation</Button>
                              <p>Azure (PCF) - AKS based on Public Cloud Foundation</p>
                              <Button className="p-0" variant="link">Documentation</Button>
                              <p>Oracle Database - Oracle Database</p>
                              <Button className="p-0" variant="link">Documentation</Button>
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select defaultValue="ICHPDE">
                      <SelectTrigger id="small-form-role">
                        <SelectValue placeholder="Select a branch" />
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
                      <FieldLabel htmlFor="small-form-role">Generation Scope</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Generation Scope</PopoverTitle>
                            <PopoverDescription className="space-y-2">
                              <p>Each item includes matching pipelines.
                                Depending on your choice additionally sample code, helmChart etc. will be generated.
                                Sample code is hosted <Button className="p-0" variant="link">here</Button></p>

                              <p className="font-bold">Pipelines Only</p>
                              <p>Pipelines only, no further application code or Helm chart will be generated.</p>

                              <p className="font-bold">TPA Demo with Sidecar</p>
                              <p>Enhanced TPA configuration plus HelmChart. TPA sidecar is recommended by Architecture. Please follow README.MD instructions for further actions.</p>

                              <p className="font-bold">Non-TPA Demo-App</p>
                              <p>Basic hello-world application</p>

                              <p className="font-bold">Network Health Checker </p>
                              <p>Network Health Checker is used to test network connections inside a openshift namespace with curl and openssl.</p>

                              <p className="font-bold">Azure items (specific)</p>
                              <p>AKS (Paved road)</p>
                              <p>Azure Kubernetes Service is a managed Kubernetes service in Microsoft Azure. It simplifies deploying and managing containerized applications using Kubernetes. Templates are based on the "Paved road" and therefore compliant with the organization restrictions - <Button className="p-0" variant="link">Documentation</Button></p>
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select defaultValue="pipelines-only">
                      <SelectTrigger id="small-form-role">
                        <SelectValue placeholder="Select a branch" />
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
                      <FieldLabel htmlFor="small-form-role">Resource Generation</FieldLabel>
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
                    <Select defaultValue="init">
                      <SelectTrigger id="small-form-role">
                        <SelectValue placeholder="Select a branch" />
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
                    <FieldLabel htmlFor="small-form-role">Build Pipeline</FieldLabel>
                    <Select defaultValue="helm">
                      <SelectTrigger id="small-form-role">
                        <SelectValue placeholder="Select a branch" />
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
                      <FieldLabel htmlFor="small-form-role">Purpose Code</FieldLabel>
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
                      id="small-form-name"
                      placeholder="e.g. P12345"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="small-form-role">Asset indent</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Asset indent</PopoverTitle>
                            <PopoverDescription>
                              Asset-Repo-Ident (case-sensitive) as in <Button className="p-0" variant="link">ServiceNow</Button> . Do not use the module name.
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="small-form-name"
                      placeholder="e.g. IBBR"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="small-form-role">Application Name</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <InfoIcon className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <PopoverHeader>
                            <PopoverTitle>Application Name</PopoverTitle>
                            <PopoverDescription>
                              Application name uniquely identifies your service.
                              This will be part of your Git repository name.
                            </PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="small-form-name"
                      placeholder="e.g. ibbr-backend"
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
    </Example>
  )
}