interface ActionProps {
  text?: string
  onClick?: any
  className?: string
  disabled?: boolean
}

function Action({ text, onClick, className, disabled, ...props }: ActionProps) {
  return (
    <>
      <button
        disabled={disabled}
        className={`px-8 py-2 rounded uppercase flex flex-row left mb-2 w-full left bg-white/0 hover:bg-white/20 ${className}`}
        onClick={onClick}
        {...props}
      >
        {text}
      </button>
    </>
  )
}

export default Action
