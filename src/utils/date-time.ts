import { toZonedTime } from "date-fns-tz";

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

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) return "0:00";

  const pad = (s: number): string => (s < 10 ? "0" : "") + s;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours === 0) return `${minutes}:${pad(secs)}`;

  return `${hours}:${pad(minutes)}:${pad(secs)}`;
};

function dateToTimeZone(date: Date, timeZone: string): Date {
  return toZonedTime(date, timeZone);
}

export { dateToTimeZone, formatTime, millisecondsToSeconds };
