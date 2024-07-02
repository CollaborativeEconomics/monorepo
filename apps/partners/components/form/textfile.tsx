import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextFileProps {
  id?: string;
  label?: string;
  className?: string;
  register: UseFormRegisterReturn;
}

const TextFile = forwardRef(
  (
    {
      id,
      label,
      register,
      className,
      ...props
    }: TextFileProps & HTMLProps<HTMLInputElement>,
    ref
  ) => (
    <label className={`m-0 mt-4 ${className ?? ''}`}>
      <span className="text-slate-300 text-sm text-left uppercase">{label}</span>
      <input type="file" id={id} ref={ref} {...props} {...register} className="file:rounded-lg" />
    </label>
  )
);

TextFile.displayName = 'TextFile';

export default TextFile;
