import React, { type HTMLProps } from "react"

interface TitleProps {
  text?: string
  className?: string
}

const Title = ({
  text,
  className,
  children,
  ...rest
}: TitleProps & HTMLProps<HTMLLabelElement>) => (
  <label
    className={`my-12 py-0 text-white text-4xl text-center ${className ?? ""}`}
    {...rest}
  >
    {children || text}
  </label>
)

export default Title
