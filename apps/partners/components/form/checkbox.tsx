import React, { type ChangeEvent, type HTMLProps, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

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
  ...rest
}: CheckboxProps & HTMLProps<HTMLInputElement>) => {
  //console.log({ rest });
  const [checked, setChecked] = useState(check);
  // const event = useRef(null);

  return (
    <label
      htmlFor={name}
      className="rounded-xl bg-blue-100 flex w-fit flex-row align-middle justify-start text-white px-4 py-1 mb-6"
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
