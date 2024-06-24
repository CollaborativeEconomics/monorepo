import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  className?: string;
  register: UseFormRegisterReturn;
  onChange?: (event:any)=>void;
}

const TextInput = forwardRef(
  (
    {
      label,
      register,
      className,
      onChange,
      ...props
    }: TextInputProps & HTMLProps<HTMLInputElement>,
    ref
  ) => {
    return (
      <label className={`m-0 mt-0 ${className ?? ''}`}>
        <span className="text-green-300 text-sm text-left uppercase">
          {label}
        </span>
        <input onKeyUp={onChange} {...props} {...register} />
      </label>
    )
  }
)

TextInput.displayName = 'TextInput';

export default TextInput;
