function convertTime(value: number, fromUnit: string, toUnit: string): number {
  const unitMap: { [key: string]: number } = {
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
    milliseconds: 0.001,
  };

  return value * (unitMap[fromUnit] / unitMap[toUnit]);
}

function millisecondsToSeconds(value: number): number {
  return convertTime(value, "milliseconds", "seconds");
}

export { millisecondsToSeconds };
