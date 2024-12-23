'use client';

import React from 'react';

interface InputWithContentProps {
  className?: string;
  type: string;
  id: string;
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputWithContent({
  className,
  type,
  id,
  text,
  onChange,
}: InputWithContentProps) {
  return (
    <div className={`input-with-content ${className}`}>
      <input type={type} id={id} onChange={onChange} />
      <span>{text}</span>
    </div>
  );
}
