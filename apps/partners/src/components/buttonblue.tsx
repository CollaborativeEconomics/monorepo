import React, { type PropsWithChildren, type HTMLAttributes } from 'react';

interface ButtonBlueProps extends HTMLAttributes<HTMLButtonElement> {
  id?: string;
  type?: "button" | "submit" | "reset" | undefined;
  text: string;
  disabled?: boolean;
}

const ButtonBlue = React.forwardRef<HTMLButtonElement, ButtonBlueProps>(
  ({ text, className, disabled, onClick, ...props }: ButtonBlueProps, ref) => (
    <button
      disabled={disabled}
      className={`mx-auto my-4 px-12 py-2 rounded-full uppercase flex flex-row justify-center bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 ${className}`}
      {...{ onClick, ref }}
      {...props}
    >
      {text}
      {props.children}
    </button>
  ),
);
ButtonBlue.displayName = 'ButtonBlue';

export default ButtonBlue;
