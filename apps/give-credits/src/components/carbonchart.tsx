interface ChartType {
  title?: string;
  goal?: number;
  value: number;
  max100?: boolean;
}

// https://stackoverflow.com/questions/50960084/how-to-extend-cssproperties-in-react-project
//const style: { [key: string]: React.CSSProperties } = {
const style = {
  label: {
    color: '#000',
    textAlign: 'center',
    marginBottom: '14px',
  },
  value: {
    fontWeight: '400',
    fontSize: '1',
  },
  chart: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '4px',
    width: 'auto',
  },
  ton: {
    boxSizing: 'border-box',
    display: 'inline-block',
    width: 'auto',
    maxWidth: '40px',
    height: '20px',
    margin: '2px',
    border: '1px solid #666',
    borderRadius: '6px',
  },
  off: {
    boxSizing: 'border-box',
    display: 'inline-block',
    width: 'auto',
    maxWidth: '40px',
    height: '20px',
    margin: '2px',
    border: '1px solid #666',
    borderRadius: '6px',
    backgroundColor: '#1a56db',
  },
  p10: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 10%, transparent 10%, transparent 100%)',
  },
  p20: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 20%, transparent 20%, transparent 100%)',
  },
  p30: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 30%, transparent 30%, transparent 100%)',
  },
  p40: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 40%, transparent 40%, transparent 100%)',
  },
  p50: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 50%, transparent 50%, transparent 100%)',
  },
  p60: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 60%, transparent 60%, transparent 100%)',
  },
  p70: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 70%, transparent 70%, transparent 100%)',
  },
  p80: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 80%, transparent 80%, transparent 100%)',
  },
  p90: {
    background:
      'linear-gradient(to right, #1a56db 0%, #1a56db 90%, transparent 90%, transparent 100%)',
  },
} as const;

//const CarbonChart = ({
function CarbonChart({
  title,
  goal = 100,
  value = 0,
  max100 = true,
}: ChartType) {
  console.log('CHART', goal, value);
  const maxValue = max100 ? 100 : goal;
  const percentStyles: Record<number, React.CSSProperties> = {
    10: { ...style.ton, ...style.p10 },
    20: { ...style.ton, ...style.p20 },
    30: { ...style.ton, ...style.p30 },
    40: { ...style.ton, ...style.p40 },
    50: { ...style.ton, ...style.p50 },
    60: { ...style.ton, ...style.p60 },
    70: { ...style.ton, ...style.p70 },
    80: { ...style.ton, ...style.p80 },
    90: { ...style.ton, ...style.p90 },
  };

  const number = value;
  const integerPart = Math.trunc(number);
  const modulus = number % 1;
  const remainder = modulus ? 1 : 0;
  const fixedDecimal = modulus.toFixed(1);
  const decimalPart = Number(fixedDecimal) * maxValue;
  const partialStyle = percentStyles[decimalPart];
  const remaining = maxValue - integerPart - remainder;

  console.log('Tons', number, modulus, decimalPart, remaining);
  const offsetBlocks = Array(integerPart).fill(0);
  const remainingBlocks = Array(remaining).fill(0);

  return (
    <>
      <div className="text-center mb-4">{title}</div>
      <div style={style.chart}>
        {offsetBlocks.map(() => {
          return <div style={style.off} key={Math.random()} />;
        })}
        {decimalPart > 0 ? <div style={partialStyle} /> : <></>}
        {remainingBlocks.map(() => {
          return <div style={style.ton} key={Math.random()} />;
        })}
      </div>
    </>
  );
}

export default CarbonChart;
