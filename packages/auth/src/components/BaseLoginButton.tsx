'use client';
import { Button } from '@cfce/universe-components/ui';

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
    <Button
      type={type}
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      onClick={onClick}
    >
      <img src={icon} alt={`${name} icon`} className="w-5 h-5" />
      <span>Continue with {name}</span>
    </Button>
  );
}
