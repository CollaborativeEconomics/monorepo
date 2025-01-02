import React, { forwardRef, type HTMLProps } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

interface TextInputProps {
  label?: string
  className?: string
  register: UseFormRegisterReturn
  onChange?: (event: any) => void
  renderRight?: React.ReactNode
}

const TextInput = forwardRef(
  (
    {
      label,
      className,
      onChange,
      register,
      renderRight = null,
      ...props
    }: TextInputProps & HTMLProps<HTMLInputElement>,
    ref,
  ) => {
    return (
      <label className={`my-4 ${className ?? ""}`}>
        <span className="text-slate-300 text-sm uppercase text-left">
          {label}
        </span>
        <div
          className="relative w-full overflow-hidden"
          style={{ borderRadius: "14px" }}
        >
          <input
            onKeyUp={onChange}
            className="w-full"
            {...props}
            {...register}
          />
          {renderRight && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-2 bg-blue-700">
              {renderRight}
            </div>
          )}
        </div>
      </label>
    )
  },
)

TextInput.displayName = "TextInput"

export default TextInput
