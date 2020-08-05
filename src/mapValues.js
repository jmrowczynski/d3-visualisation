const mapValues = (currentValue, maxValue) => {
  const MIN_RESULT = 40;

  return (MIN_RESULT * currentValue) / maxValue + MIN_RESULT;
};

export default mapValues;
