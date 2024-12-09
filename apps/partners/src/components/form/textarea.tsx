import React, { type HTMLProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  label: string;
  register: UseFormRegisterReturn;
}

const TextArea = ({
  label,
  register,
  ...rest
}: TextAreaProps & HTMLProps<HTMLTextAreaElement>) => (
  <label className="my-4">
    <span className="uppercase text-slate-300 text-sm">{label}</span>
    <textarea {...rest} {...register} />
  </label>
);

export default TextArea;
