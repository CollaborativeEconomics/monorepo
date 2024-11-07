import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

    const combinedClassName = `${baseStyles} ${className}`;

    return <button ref={ref} className={combinedClassName} {...props} />;
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
