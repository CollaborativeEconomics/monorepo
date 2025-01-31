import React from "react"

interface ProgressProps {
  value: number
}

export default function Progress(props: ProgressProps) {
  let value = props.value
  if (typeof value !== "number" || Number.isNaN(value)) {
    value = 0
  }
  value = Math.ceil(Math.min(Math.max(value, 0), 100))
  const width = { width: `${value}%` }
  return (
    <div className="max-w-[500px] w-full mx-auto bg-gray-200 dark:bg-slate-500 rounded-full overflow-hidden">
      <div
        className="rounded text-white text-center bg-blue-700 px-2"
        style={width}
      >
        {value.toFixed(0)}%
      </div>
    </div>
  )
}
