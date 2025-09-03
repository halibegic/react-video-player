const getLiveDelay = (startTime: number, skipTime: number): number => {
  return parseInt(
    Math.max(0, (Date.now() - (startTime + skipTime * 1000)) / 1000).toFixed(0)
  );
};

const getLiveCurrentTime = (startTime: number, delay: number): number => {
  return Math.max(0, (Date.now() - startTime - delay * 1000) / 1000);
};

const getLiveDurationTime = (startTime: number, endTime: number): number => {
  return Math.max(0, (endTime - startTime) / 1000);
};

export { getLiveCurrentTime, getLiveDelay, getLiveDurationTime };
