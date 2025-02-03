import Image from "next/image"
import * as React from "react"
import type { InputProps } from "~/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"

interface SelectOption {
  value: string
  label: string
  icon: string
  disabled?: boolean
}

export interface SelectInputProps<T extends string, U extends SelectOption>
  extends InputProps {
  className?: string
  currentOption: T
  handleChange: (item: T) => void
  options: U[]
  placeHolderText: string
}

const DonationFormSelect = <T extends string, U extends SelectOption>({
  className,
  options,
  currentOption,
  placeHolderText,
  handleChange,
  ...props
}: SelectInputProps<T, U>) => {
  return (
    <Select onValueChange={handleChange} defaultValue={currentOption}>
      <SelectTrigger
        className={`dark:border-none h-10 text-lg w-full rounded-full border border-slate-300 bg-white dark:bg-slate-500 ring-offset-background focus-within:border-blue-700 focus-within:ring-1 ${className || ""}`}
      >
        <SelectValue
          className="dark:border-none bg-white placeholder-gray-600"
          placeholder={placeHolderText}
        />
      </SelectTrigger>

      <SelectContent className="bg-white">
        {options.map((option) => (
          <SelectItem
            className="dark:bg-slate-500 bg-white text-black dark:text-white"
            value={option.value}
            key={option.value}
            disabled={option.disabled}
          >
            <div className="flex flex-row gap-3">
              <Image
                src={option.icon}
                alt={option.label}
                width={30}
                height={30}
              />
              <div className="my-auto">{option.label}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

DonationFormSelect.displayName = "DonationFormSelect"

export { DonationFormSelect }
