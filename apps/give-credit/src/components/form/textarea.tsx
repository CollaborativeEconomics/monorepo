import React, { HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextareaProps {
  label: string;
  register: UseFormRegisterReturn;
}

const Textarea = ({
  label,
  register,
  ...rest
}: TextareaProps & HTMLProps<HTMLTextAreaElement>) => (
  <label className="mt-4 mb-6">
    <span className="text-slate-300 text-sm text-left uppercase">{label}</span>
    <textarea {...rest} {...register} />
  </label>
);

export default Textarea;
