import React, { type HTMLProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface Option {
  id: string;
  name: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  name?: string;
  selected?: string;
  options?: Option[];
  register?: UseFormRegisterReturn;
}

const Select = ({
  id,
  label,
  name,
  options,
  register,
  selected,
  ...rest
}: SelectProps & HTMLProps<HTMLSelectElement>) => (
  <label className="my-4">
    <span className="text-slate-300 text-sm text-left uppercase">{label}</span>
    <select id={id} {...rest} {...register} name={name}>
      {options ? (
        options.map(item => {
          if (item.id === selected) {
            return (
              <option value={item.id} key={item.id} selected>
                {item.name}
              </option>
            );
          }
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
);

export default Select;
