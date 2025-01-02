interface SeparatorProps {
  className?: string
}

function Separator({ className }: SeparatorProps) {
  return (
    <>
      <hr className={`my-4 w-full border-t-neutral-500 ${className}`} />
    </>
  )
}

export default Separator
