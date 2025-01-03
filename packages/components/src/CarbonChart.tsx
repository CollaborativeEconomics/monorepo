import React from "react"

interface ChartType {
  title?: string
  goal?: number
  value: number
  max100?: boolean
}

// https://stackoverflow.com/questions/50960084/how-to-extend-cssproperties-in-react-project
//const style: { [key: string]: React.CSSProperties } = {
const style = {
  label: {
    color: "#000",
    textAlign: "center",
    marginBottom: "14px",
  },
  value: {
    fontWeight: "400",
    fontSize: "1",
  },
  chart: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gridTemplateRows: "repeat(5, 1fr)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    width: "500px",
    margin: "0 auto",
  },
  ton: {
    boxSizing: "border-box",
    display: "inline-block",
    width: "40px",
    height: "20px",
    margin: "0px 4px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f6f6f6",
  },
  off: {
    boxSizing: "border-box",
    display: "inline-block",
    width: "40px",
    height: "20px",
    margin: "0px 4px",
    // border: '1px solid #00440044',
    borderRadius: "6px",
    // backgroundColor: '#00aa00', // 1a56db blue
  },
  p10: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 10%, #fff 10%, #fff 100%)",
  },
  p20: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 20%, #fff 20%, #fff 100%)",
  },
  p30: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 30%, #fff 30%, #fff 100%)",
  },
  p40: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 40%, #fff 40%, #fff 100%)",
  },
  p50: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 50%, #fff 50%, #fff 100%)",
  },
  p60: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 60%, #fff 60%, #fff 100%)",
  },
  p70: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 70%, #fff 70%, #fff 100%)",
  },
  p80: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 80%, #fff 80%, #fff 100%)",
  },
  p90: {
    background:
      "linear-gradient(to right, #00aa00 0%, #00aa00 90%, #fff 90%, #fff 100%)",
  },
} as const

function CarbonChart({ title, goal = 100, value, max100 = true }: ChartType) {
  console.log("CHART", goal, value)
  const max = max100 ? 100 : goal
  const pct: Record<number, Record<string, string>> = {
    10: { ...style.ton, ...style.p10 },
    20: { ...style.ton, ...style.p20 },
    30: { ...style.ton, ...style.p30 },
    40: { ...style.ton, ...style.p40 },
    50: { ...style.ton, ...style.p50 },
    60: { ...style.ton, ...style.p60 },
    70: { ...style.ton, ...style.p70 },
    80: { ...style.ton, ...style.p80 },
    90: { ...style.ton, ...style.p90 },
  }
  const num = value
  const int = Math.trunc(num)
  const mod = num % 1
  const ext = mod ? 1 : 0
  //const fix = mod.toFixed(1);
  const fix = Math.trunc(mod * 10) / 10
  const dec = Number(fix) * max
  const prt = pct[dec]
  const rst = max - int - ext
  const offs = Array(int).fill(0)
  const tons = Array(rst).fill(0)
  console.log("Tons", num, int, mod, fix, dec, rst)
  //console.log('Arrs', offs.length, tons.length)
  function keyRand() {
    return Math.random().toString().substr(2)
  }

  return (
    <>
      <div className="text-center mb-4">{title}</div>
      <div className="max-w-[480px]">
        {offs.map((i) => {
          return (
            <div
              style={style.off}
              key={keyRand()}
              className="bg-gradient-to-br from-lime-500 to-lime-700 border-lime-700 rounded-lg shadow-lg border"
            />
          )
        })}
        {dec > 0 ? <div style={prt} /> : null}
        {tons.map((i) => {
          return (
            <div
              style={style.ton}
              key={keyRand()}
              className="bg-gradient-to-br from-slate-100 to-slate-200"
            />
          )
        })}
      </div>
    </>
  )
}

export default CarbonChart
