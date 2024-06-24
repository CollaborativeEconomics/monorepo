import React, { HTMLAttributes } from 'react'
import Icon from './icon'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: string;
  loading?: boolean;
  iconClassStyle?: string;
  iconColor?: string;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      icon,
      onClick,
      className,
      loading,
      iconColor,
      iconClassStyle,
      ...props
    }: ButtonProps,
    ref
  ) => (
    <button
      className={`px-8 py-2 rounded-full uppercase flex flex-row justify-center ${className}`}
      {...{ onClick, ref }}
      {...props}
    >
      {loading ? <Icon icon="sync" className="animate-spin mr-6" /> : null}
      {icon ? (
        <Icon
          icon={icon}
          style={{ color: `${iconColor}` }}
          className={`mr-6 ${iconClassStyle}`}
        />
      ) : null}
      {text}
      {props.children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
