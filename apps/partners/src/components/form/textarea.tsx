import React, { forwardRef, type HTMLProps, useState } from "react"

interface TextAreaProps {
  label: string
  className?: string
  maxLength?: number
  value?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      className,
      maxLength,
      value = "",
      ...props
    }: TextAreaProps & HTMLProps<HTMLTextAreaElement>,
    ref,
  ) => {
    const [charCount, setCharCount] = useState(value.length)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <label className={`my-4 ${className}`}>
        <span className="uppercase text-slate-300 text-sm">{label}</span>
        <textarea
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {maxLength && (
          <div className="text-sm text-slate-400">
            {charCount}/{maxLength} characters
          </div>
        )}
      </label>
    )
  },
)

export default TextArea
