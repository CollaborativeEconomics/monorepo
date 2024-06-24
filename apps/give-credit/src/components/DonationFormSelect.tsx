import * as React from 'react'
import { InputProps } from './ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from './ui/select'

interface SelectOption {
  value: string;
  image: string;
  symbol?: string,
  enabled?: boolean
}

export interface SelectInputProps extends InputProps {
  className?: string
  currentOption: string
  handleChange: any
  options: SelectOption[]
  placeHolderText: string
}

const DonationFormSelect = React.forwardRef<HTMLInputElement, SelectInputProps>(
  (
    {
      className,
      options,
      currentOption,
      placeHolderText,
      handleChange,
      ...props
    },
    ref
  ) => {
    return (
      <Select onValueChange={handleChange} defaultValue={currentOption}>
        <SelectTrigger
          className={`dark:border-none h-10 text-lg w-full rounded-full border border-slate-300 bg-white dark:bg-slate-500 ring-offset-background focus-within:border-blue-700 focus-within:ring-1 ${className || ''}`}
        >
          <SelectValue
            className="dark:border-none bg-white placeholder-gray-600"
            placeholder={placeHolderText}
          />
        </SelectTrigger>
        
        <SelectContent className="bg-white">
          {options.map((option) => {
            if(!option?.enabled){ return }
            return (
              <SelectItem
                className="bg-white text-black dark:text-white"
                value={option.value}
                key={option.value}
              >
                <div className="flex flex-row gap-3">
                  {/* TODO: FIX: IMAGE NOT FOUND IS CAUSING MULTIPLE PAGE RELOADS WITH COIN ID AS INIT ID */}
                  <img src={option.image} width="30px" />
                  <div className="my-auto">{option.value}</div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    )
  }
)
//DonationFormSelect.displayName = 'select'

DonationFormSelect.displayName = 'DonationFormSelect'

export { DonationFormSelect }
