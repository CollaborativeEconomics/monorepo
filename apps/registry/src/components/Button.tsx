interface ButtonProps {
  text?: string;
  onClick?: any;
  className?: string;
  disabled?: boolean;
}

function Button({
  text,
  onClick,
  className,
  disabled,
  ...props
}:ButtonProps) {
  return <>
    <button
      disabled={disabled}
      className={`px-8 py-2 rounded-full uppercase flex flex-row justify-center mb-2 w-full center bg-white/10 hover:bg-white/20 ${className}`}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  </>
}

export default Button