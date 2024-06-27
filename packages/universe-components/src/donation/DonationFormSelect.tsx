import * as React from 'react'
import Image from 'next/image'
import { InputProps } from '../ui/input.js'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '../ui/select.js'

interface SelectOption {
  value: string;
  image: string;
  coinSymbol?: string,
  chainEnabled?: boolean
}
//import { Dictionary } from '@/lib/chains/utils'


export interface SelectInputProps extends InputProps {
  className?: string
  currentOption: string
  handleChange: (data: any ) => void
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
          className={`h-10 text-lg w-full rounded-full border border-2 border-slate-300 bg-white ring-offset-background focus-within:border-blue-700 focus-within:ring-1 ${className || ''}`}
        >
          <SelectValue
            className="bg-white placeholder-gray-600"
            placeholder={placeHolderText}
          />
        </SelectTrigger>
        
        <SelectContent className="bg-white">
          {options.map((option) => {
            if(!option?.chainEnabled){ return }
            return (
              <SelectItem
                className="bg-white text-black"
                value={option.value}
                key={option.value}
              >
                <div className="flex flex-row gap-3">
                  <Image src={option.image} width={30} height={30} alt="Selected image" onError={(e) => e.currentTarget.style.display = 'none'} />
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
