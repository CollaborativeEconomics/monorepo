'use client';
// NOTE: components relies on this package, so we can't import ui components from there

import React from 'react';
import { Button } from './Button';
interface BaseLoginButtonProps {
  icon: string;
  name: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export function BaseLoginButton({
  onClick,
  icon,
  name,
  className,
  type = 'button',
}: BaseLoginButtonProps) {
  return (
    <Button type={type} className={`gap-2 ${className}`} onClick={onClick}>
      <img src={icon} alt={`${name} icon`} className="w-5 h-5" />
      <span>Login with {name}</span>
    </Button>
  );
}
