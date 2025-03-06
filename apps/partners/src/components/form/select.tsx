import React, { type HTMLProps, forwardRef } from 'react';

interface Option {
  id: string;
  name: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  name?: string;
  selectedValue?: string;
  options?: Option[];
  handler?: (val: string) => void;
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps & HTMLProps<HTMLSelectElement>
>(({ id, label, name, options, selectedValue, handler, ...props }, ref) => (
  <label className="my-4">
    <span className="text-slate-300 text-sm text-left uppercase">{label}</span>
    <select
      id={id}
      {...props}
      name={name}
      ref={ref}
      defaultValue={selectedValue}
      onChange={e => {
        return handler ? handler(e.target.value) : null;
      }}
    >
      {options ? (
        options.map(item => {
          //if (item.id === selectedValue) {
          //  return (
          //    <option value={item.id} key={item.id} selected>
          //      {item.name}
          //    </option>
          //  );
          //}
          return (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          );
        })
      ) : (
        <option value="0" key={0}>
          No items
        </option>
      )}
    </select>
  </label>
));

Select.displayName = 'Select';

export default Select;
