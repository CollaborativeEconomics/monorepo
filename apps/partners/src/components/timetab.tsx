import React, { type HTMLProps } from "react"
import styles from "../styles/dashboard.module.css"

interface TimeTabProps {
  className?: string
  setTimeframe: (timeframe: "year" | "month" | "week") => void
  timeframe: "year" | "month" | "week"
}

const TimeTab = ({
  className,
  setTimeframe,
  timeframe,
}: TimeTabProps & HTMLProps<HTMLDivElement>) => {
  function onYear() {
    console.log("onYear")
    setTimeframe("year")
  }

  function onMonth() {
    console.log("onMonth")
    setTimeframe("month")
  }

  function onWeek() {
    console.log("onWeek")
    setTimeframe("week")
  }

  return (
    <div className={styles.timeTab}>
      <button
        type="button"
        id="timeYear"
        className={`${styles.buttonTime} ${
          timeframe === "year" ? "selected" : ""
        }`}
        onClick={onYear}
      >
        Year
      </button>
      <button
        type="button"
        id="timeMonth"
        className={`${styles.buttonTime} ${
          timeframe === "month" ? "selected" : ""
        }`}
        onClick={onMonth}
      >
        Month
      </button>
      <button
        type="button"
        id="timeWeek"
        className={`${styles.buttonTime} ${
          timeframe === "week" ? "selected" : ""
        }`}
        onClick={onWeek}
      >
        Week
      </button>
    </div>
  )
}

export default TimeTab
