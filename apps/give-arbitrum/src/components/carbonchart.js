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
    width: "auto",
    maxWidth: "500px",
    margin: "0 auto",
  },
  ton: {
    boxSizing: "border-box",
    display: "inline-block",
    width: "auto",
    maxWidth: "40px",
    height: "20px",
    margin: "2px",
    border: "1px solid #666",
    borderRadius: "6px",
  },
  off: {
    boxSizing: "border-box",
    display: "inline-block",
    width: "auto",
    maxWidth: "40px",
    height: "20px",
    margin: "2px",
    border: "1px solid #666",
    borderRadius: "6px",
    backgroundColor: "#1a56db",
  },
  p10: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 10%, transparent 10%, transparent 100%)",
  },
  p20: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 20%, transparent 20%, transparent 100%)",
  },
  p30: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 30%, transparent 30%, transparent 100%)",
  },
  p40: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 40%, transparent 40%, transparent 100%)",
  },
  p50: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 50%, transparent 50%, transparent 100%)",
  },
  p60: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 60%, transparent 60%, transparent 100%)",
  },
  p70: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 70%, transparent 70%, transparent 100%)",
  },
  p80: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 80%, transparent 80%, transparent 100%)",
  },
  p90: {
    background:
      "linear-gradient(to right, #1a56db 0%, #1a56db 90%, transparent 90%, transparent 100%)",
  },
}
//const CarbonChart = ({
function CarbonChart({ title, goal = 100, value = 0, max100 = true }) {
  console.log("CHART", goal, value)
  const max = max100 ? 100 : goal
  const pct = {
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
  const fix = mod.toFixed(1)
  const dec = Number(fix) * max
  const prt = pct[dec]
  const rst = max - int - ext
  console.log("Tons", num, mod, dec, rst)
  const offs = Array(int).fill(0)
  const tons = Array(rst).fill(0)
  //console.log('Arrs', offs.length, tons.length)
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("div", { className: "text-center mb-4" }, title),
    React.createElement(
      "div",
      { style: style.chart },
      offs.map(() => {
        return React.createElement("div", {
          style: style.off,
          key: Math.random(),
        })
      }),
      dec > 0
        ? React.createElement("div", { style: prt })
        : React.createElement(React.Fragment, null),
      tons.map(() => {
        return React.createElement("div", {
          style: style.ton,
          key: Math.random(),
        })
      }),
    ),
  )
}
export default CarbonChart
