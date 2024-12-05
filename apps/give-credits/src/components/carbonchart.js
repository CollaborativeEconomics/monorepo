import React from 'react';

const baseBoxStyles = {
  boxSizing: 'border-box',
  display: 'inline-block',
  width: 'auto',
  maxWidth: '40px',
  height: '20px',
  minWidth: '20px',
  margin: '2px',
  border: '1px solid #666',
  borderRadius: '6px',
};

const Box = ({ state = 'empty', fillPercentage = 0 }) => {
  const getStyles = () => {
    switch (state) {
      case 'filled':
        return {
          ...baseBoxStyles,
          backgroundColor: '#1a56db',
        };
      case 'partial':
        return {
          ...baseBoxStyles,
          background: `linear-gradient(to right, #1a56db 0%, #1a56db ${fillPercentage}%, transparent ${fillPercentage}%, transparent 100%)`,
        };
      default:
        return baseBoxStyles;
    }
  };

  return <div style={getStyles()} />;
};

const styles = {
  container: {
    width: '100%',
    overflow: 'scroll',
    display: 'flex',
    justifyContent: 'center',
  },
  chart: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gridTemplateRows: 'repeat(5, 1fr)',
    gridColumnGap: '0px',
    gridRowGap: '0px',
    width: 'fit-content',
    maxWidth: '500px',
    margin: '0 auto',
  },
};

const CarbonChart = ({ title, goal = 100, value = 0, max100 = true }) => {
  const maxValue = max100 ? 100 : goal;

  const fullBoxes = Math.floor(value);
  const partialValue = value % 1;
  const hasPartialBox = partialValue > 0;
  const partialBoxPercentage = Math.round(partialValue * 10) * 10;
  const emptyBoxes = maxValue - fullBoxes - (hasPartialBox ? 1 : 0);

  const renderFullBoxes = () => {
    return Array(fullBoxes)
      .fill(null)
      .map((_, index) => <Box key={`full-${index}`} state="filled" />);
  };

  const renderPartialBox = () => {
    if (!hasPartialBox) return null;
    return (
      <Box
        key="partial"
        state="partial"
        fillPercentage={partialBoxPercentage}
      />
    );
  };

  const renderEmptyBoxes = () => {
    return Array(emptyBoxes)
      .fill(null)
      .map((_, index) => <Box key={`empty-${index}`} state="empty" />);
  };

  return (
    <>
      <div className="text-center mb-4">{title}</div>
      <div style={styles.container}>
        <div style={styles.chart}>
          {renderFullBoxes()}
          {renderPartialBox()}
          {renderEmptyBoxes()}
        </div>
      </div>
    </>
  );
};

export default CarbonChart;
