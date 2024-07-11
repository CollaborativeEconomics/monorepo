'use client';

import { useEffect, useState } from 'react';
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

/*
const categories = [
  { value: 'poverty', label: 'No Poverty' },
  { value: 'hunger', label: 'Zero Hunger' },
  { value: 'health_well_being', label: 'Good Health and Well-being' },
  { value: 'education', label: 'Quality Education' },
  { value: 'gender_equality', label: 'Gender Equality' },
  { value: 'water', label: 'Clean Water and Sanitation' },
  { value: 'clean_energy', label: 'Affordable and Clean Energy' },
  { value: 'economic_growth', label: 'Decent Work and Economic Growth' },
  { value: 'innovation', label: 'Industry, Innovation, and Infrastructure' },
  { value: 'reduced_inequality', label: 'Reduced Inequality' },
  { value: 'sustainable_communities', label: 'Sustainable Cities and Communities' },
  { value: 'responsible_consumption', label: 'Responsible Consumption and Production' },
  { value: 'climate_action', label: 'Climate Action' },
  { value: 'life_below_water', label: 'Life Below Water' },
  { value: 'life_on_land', label: 'Life on Land' },
  { value: 'peace_justice', label: 'Peace, Justice, and Strong Institutions' },
  { value: 'partnerships', label: 'Partnerships for the Goals' },
];
*/

type CategoryType = {
  value: string;
  label: string;
};

export default function CategorySelect(props: any) {
  const onChange = props?.onChange;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState([]);
  // TODO: get from properties
  const distinct = 'initiatives'; // organizations

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch('/api/categories?distinct=' + distinct);
      let list = await res.json();
      list = list.map(category => ({
        value: category.slug,
        label: category.title,
      }));
      console.log('CATS', list);
      setCategories(list);
    }
    loadCategories();
  }, []);

  function findCategory(value: string) {
    const found = categories.find(
      (item: CategoryType) => item?.value === value,
    );
    return found ? found['label'] : '';
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? findCategory(value) : 'Select category...'}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map(item => {
              return (
                <CommandItem
                  key={item?.value}
                  onSelect={currentValue => {
                    console.log('CAT', currentValue, 'OLD', value || '?');
                    setValue(item?.value);
                    onChange(item?.value);
                    setOpen(false);
                  }}
                >
                  <CheckCircledIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item?.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item?.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
