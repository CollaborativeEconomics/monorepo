import React, { forwardRef, type HTMLProps } from 'react';

interface TextAreaProps {
  label: string;
  className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      className,
      ...props
    }: TextAreaProps & HTMLProps<HTMLTextAreaElement>,
    ref,
  ) => (
    <label className={`my-4 ${className}`}>
      <span className="uppercase text-slate-300 text-sm">{label}</span>
      <textarea ref={ref} {...props} />
    </label>
  ),
);

export default TextArea;
