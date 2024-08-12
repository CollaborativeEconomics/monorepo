import { cn } from '@/shadCnUtil';
import React from 'react';
import type { InputProps } from './input';

export interface SwitchProps extends InputProps {
  valueBasis: boolean;
  handleToggle: () => void;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, valueBasis, handleToggle, id }, ref) => {
    return (
      <div className={cn('inline-flex items-center px-4', className)} ref={ref}>
        <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
          <input
            id={id}
            type="checkbox"
            checked={valueBasis}
            onChange={handleToggle}
            className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-gray-100 checked:bg-blue-500 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
          />
          <label
            htmlFor={id}
            className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-100 peer-checked:before:bg-gray-100"
          >
            <div
              className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
              data-ripple-dark="true"
            />
          </label>
        </div>
      </div>
    );
  },
);
Switch.displayName = 'switch';

export { Switch };
