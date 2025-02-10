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
    // border: "1px solid #ccc",
    // borderRadius: "6px",
    // backgroundColor: "#f6f6f6",
  },
  off: {
    boxSizing: "border-box",
    display: "inline-block",
    width: "40px",
    height: "20px",
    margin: "0px 4px",
    // border: '1px solid #00440044',
    // borderRadius: "6px",
    // backgroundColor: '#00aa00', // 1a56db blue
  },
  // lime-500: #7ccf00, lime-700: #64a800
  // slate-100: rgba(241,245,249,0.2), slate-200: rgba(226,232,240,0.2)
  p10: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 10%,rgba(241,245,249,0.2) 10%,rgba(226,232,240,0.2))",
  },
  p20: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 20%,rgba(241,245,249,0.2) 20%,rgba(226,232,240,0.2))",
  },
  p30: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 30%,rgba(241,245,249,0.2) 30%,rgba(226,232,240,0.2))",
  },
  p40: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 40%,rgba(241,245,249,0.2) 40%,rgba(226,232,240,0.2))",
  },
  p50: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 50%,rgba(241,245,249,0.2) 50%,rgba(226,232,240,0.2))",
  },
  p60: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 60%,rgba(241,245,249,0.2) 60%,rgba(226,232,240,0.2))",
  },
  p70: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 70%,rgba(241,245,249,0.2) 70%,rgba(226,232,240,0.2))",
  },
  p80: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 80%,rgba(241,245,249,0.2) 80%,rgba(226,232,240,0.2))",
  },
  p90: {
    backgroundImage:
      "linear-gradient(90deg,#7ccf00 0%,#64a800 90%,rgba(241,245,249,0.2) 90%,rgba(226,232,240,0.2))",
  },
} as const

function CarbonChart({ title, goal = 100, value, max100 = true }: ChartType) {
  console.log("CHART", goal, value)
  const max = max100 ? 100 : goal
  const pct: Record<number, Record<string, string>> = {
    10: style.p10,
    20: style.p20,
    30: style.p30,
    40: style.p40,
    50: style.p50,
    60: style.p60,
    70: style.p70,
    80: style.p80,
    90: style.p90,
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
        {/* full */}
        {offs.map((i) => {
          return (
            <div
              style={style.off}
              key={keyRand()}
              className="bg-gradient-to-br from-lime-500 to-lime-700 border-lime-700 shadow-lg border rounded-sm"
            />
          )
        })}
        {/* partial */}
        {dec > 0 ? (
          <div
            style={{ ...style.ton, ...prt }}
            className="rounded-sm shadow-lg border border-slate-400"
          />
        ) : null}
        {/* empty */}
        {tons.map((i) => {
          return (
            <div
              style={style.ton}
              key={keyRand()}
              className="bg-gradient-to-br from-slate-100/20 to-slate-200/20 rounded-sm shadow-lg border border-slate-400"
            />
          )
        })}
      </div>
    </>
  )
}

export default CarbonChart
