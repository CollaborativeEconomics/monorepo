import React, { forwardRef, type HTMLProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  className?: string;
  name?: string;
  register?: UseFormRegisterReturn;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      register,
      className,
      name,
      ...props
    }: TextInputProps & HTMLProps<HTMLInputElement>,
    ref,
  ) => (
    <label className={`my-4 ${className ?? ''}`}>
      <span className="text-slate-300 text-sm uppercase text-left">
        {label}
      </span>
      <input {...props} {...register} ref={ref} name={name} />
    </label>
  ),
);
TextInput.displayName = 'TextInput';

export default TextInput;
