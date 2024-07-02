'use client'

import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from 'utils/shadCnUtil'

interface Props {
  timestamp: Date | number
  className?: string
}

export default function DateDisplay(props: Props) {
  return (
    <DateStyle className={props.className}>
      <CalendarDays size={17} />{' '}
      <p className="truncate">
        {convertTimestampToDateString(props.timestamp)}
      </p>
    </DateStyle>
  )
}

const DateStyle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'h-2 inline-flex gap-2 items-center text-slate-500',
      className
    )}
    {...props}
  />
))
DateStyle.displayName = 'DateDisplay'

function convertTimestampToDateString(timestamp: Date | number): string {
  const timestampDate = new Date(timestamp)
  return timestampDate.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const TimestampToDateString = React.forwardRef<HTMLParagraphElement, Props>(
  ({ className, timestamp, ...props }, ref) => (
    <p ref={ref} className={cn('', className)}>
      {convertTimestampToDateString(timestamp)}
    </p>
  )
)
TimestampToDateString.displayName = 'TimestampToDateString'

export { DateDisplay, TimestampToDateString }
