"use client"

import * as React from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"

type Dependency = {
    value: string
    label: string
}

const DEPENDENCIES: Dependency[] = [
    { value: "native", label: "GraalVM Native Support" },
    { value: "dgs-codegen", label: "GraphQL DGS Code Generation" },
    { value: "devtools", label: "Spring Boot DevTools" },
    { value: "lombok", label: "Lombok" },
    {
        value: "configuration-processor",
        label: "Spring Configuration Processor",
    },
    { value: "docker-compose", label: "Docker Compose Support" },
    { value: "modulith", label: "Spring Modulith" },
]

export function MultiSelect() {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>([])

    const toggleValue = (value: string) => {
        setSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        )
    }

    const selectAll = () => {
        setSelected(
            selected.length === DEPENDENCIES.length
                ? []
                : DEPENDENCIES.map((d) => d.value)
        )
    }

    /** 🔑 Single source of truth */
    const removeValue = (value: string) => {
        setSelected((prev) => prev.filter((v) => v !== value))
    }

    return (
        <div className="space-y-2">
            {/* Dropdown */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        Select dependencies
                        {selected.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                                ({selected.length})
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[320px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search dependencies..." />
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup>
                            <CommandItem
                                onSelect={selectAll}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    checked={selected.length === DEPENDENCIES.length}
                                />
                                <span>(Select All)</span>
                            </CommandItem>

                            {DEPENDENCIES.map((dep) => {
                                const isSelected = selected.includes(dep.value)

                                return (
                                    <CommandItem
                                        key={dep.value}
                                        onSelect={() => toggleValue(dep.value)}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox checked={isSelected} />
                                        <span className="flex-1">{dep.label}</span>
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected dependencies */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-md border p-2">
                    {selected.map((value) => {
                        const dep = DEPENDENCIES.find((d) => d.value === value)
                        if (!dep) return null

                        return (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="flex max-w-[220px] items-center gap-1"
                                title={dep.label}
                                onClick={() => removeValue(value)}
                            >
                                <span className="truncate">{dep.label}</span>
                                <X
                                    className="h-3 w-3 shrink-0 cursor-pointer z-10"
                                    onClick={() => removeValue(value)}
                                />
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
