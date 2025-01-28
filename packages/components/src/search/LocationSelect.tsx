"use client"
import React, { useState, useEffect } from "react"
// import { Check, ChevronsUpDown } from 'lucide-react';

import { CheckCircledIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { cn } from "~/shadCnUtil"
import { Button } from "~/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"

interface LocationSelectProps {
  onChange?: (location: string) => void
}

export default function LocationSelect(props: LocationSelectProps) {
  const onChange = props?.onChange
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    async function loadLocations() {
      const res = await fetch("/api/locations")
      const list = await res.json()
      console.log("LOCS", list)
      if (list.success) {
        setLocations(list.data)
      }
    }
    loadLocations()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Select location..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found</CommandEmpty>
          <CommandGroup>
            {locations.map((item) => (
              <CommandItem
                key={item}
                onSelect={(currentValue: string) => {
                  console.log("LOC", currentValue, "OLD", value || "?")
                  setValue(item)
                  if (onChange) {
                    onChange(currentValue)
                  }
                  setOpen(false)
                }}
              >
                <CheckCircledIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item ? "opacity-100" : "opacity-0",
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
