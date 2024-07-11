import React, { HTMLProps } from 'react'

interface TitleProps {
  text?: string;
  className?: string;
}

const Title = ({
  text,
  className,
  children,
  ...rest
}: TitleProps & HTMLProps<HTMLLabelElement>) => (
  <label className={`my-0 pb-12 text-2xl text-center uppercase ${className ?? ''}`} {...rest}>{children||text}</label>
)

export default Title
