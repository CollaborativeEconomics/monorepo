'use client';
import { useState, useEffect } from 'react';
// import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/src/libs/shadCnUtil';
import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { CheckCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

export default function LocationSelect(props:any) {
  const onChange = props?.onChange;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function loadLocations(){
      const res = await fetch('/api/locations')
      const list = await res.json()
      setLocations(list)
      console.log('LOCS', list)
    }
    loadLocations()
  },[])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : 'Select location...'}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found</CommandEmpty>
          <CommandGroup>
            {locations.map(item => (
              <CommandItem
                key={item}
                onSelect={currentValue => {
                  console.log('LOC', currentValue, 'OLD', value||'?')
                  setValue(item);
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <CheckCircledIcon className={cn('mr-2 h-4 w-4', value === item ? 'opacity-100' : 'opacity-0')} />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
