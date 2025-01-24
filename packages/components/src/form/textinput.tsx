import React, { forwardRef, type HTMLProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  className?: string;
  register?: UseFormRegisterReturn;
  onChange?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<
  HTMLInputElement,
  TextInputProps & HTMLProps<HTMLInputElement>
>(({ label, register, className, onChange, ...props }, ref) => {
  return (
    <label className={`m-0 mt-0 ${className ?? ''}`}>
      <span className="text-green-300 text-sm text-left uppercase">
        {label}
      </span>
      <input
        onKeyUp={onChange}
        {...props}
        {...(register ? register : {})}
        ref={ref}
      />
    </label>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
