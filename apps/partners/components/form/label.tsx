import React, { HTMLProps } from 'react';

interface LabelProps {
  text: string;
  className?: string;
}

const Label = ({
  text,
  className,
  ...rest
}: LabelProps & HTMLProps<HTMLLabelElement>) => (
  <label className={`mb-6 uppercase text-slate-300 ${className ?? ''}`} {...rest}>{text}</label>
);

export default Label;
