import React, { ChangeEvent, HTMLProps, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxProps {
  label: string;
  check?: boolean;
  register: UseFormRegisterReturn;
}

// const mergeRefs = (...refs) => {
//   return (node) => {
//     for (const ref of refs) {
//       ref.current = node;
//     }
//   };
// };

const Checkbox = ({
  label,
  check,
  register: { onChange, name, ...register },
  className,
  ...rest
}: CheckboxProps & HTMLProps<HTMLInputElement>) => {
  const [checked, setChecked] = useState(check);
  const classes = "rounded-full flex w-fit flex-row align-middle justify-start items-center text-white text-sm lineheight12 px-0 py-1 mb-0 ml-2 " + className

  return (
    <label
      htmlFor={name}
      className={classes}
    >
      <span className="material-icons mr-2 self-center">
        {checked ? 'check_box' : 'check_box_outline_blank'}
      </span>
      {label}
      <input
        type="checkbox"
        id={name}
        name={name}
        className="hidden"
        hidden
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event);
          setChecked(event.target.checked);
        }}
        {...rest}
        {...register}
      />
    </label>
  );
};

export default Checkbox;
