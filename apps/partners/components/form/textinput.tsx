import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  className?: string;
  register: UseFormRegisterReturn;
}

const TextInput = forwardRef(
  (
    {
      label,
      register,
      className,
      ...props
    }: TextInputProps & HTMLProps<HTMLInputElement>,
    ref
  ) => (
    <label className={`my-4 ${className ?? ''}`}>
      <span className="text-slate-300 text-sm uppercase text-left">
        {label}
      </span>
      <input ref={ref} {...props} {...register} />
    </label>
  )
);
TextInput.displayName = 'TextInput';

export default TextInput;
