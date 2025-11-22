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

// This replaces date-fns-tz's toZonedTime for better browser compatibility.
function dateToTimeZone(date: Date, timeZone: string): Date {
  // Check if Intl.DateTimeFormat is available (IE11+)
  if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
    try {
      // Use formatToParts to get date components in target timezone
      const targetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const targetParts = targetFormatter.formatToParts(date);
      const year = parseInt(
        targetParts.find((p) => p.type === "year")?.value || "0",
        10
      );
      const month =
        parseInt(
          targetParts.find((p) => p.type === "month")?.value || "0",
          10
        ) - 1;
      const day = parseInt(
        targetParts.find((p) => p.type === "day")?.value || "0",
        10
      );
      const hour = parseInt(
        targetParts.find((p) => p.type === "hour")?.value || "0",
        10
      );
      const minute = parseInt(
        targetParts.find((p) => p.type === "minute")?.value || "0",
        10
      );
      const second = parseInt(
        targetParts.find((p) => p.type === "second")?.value || "0",
        10
      );

      // Create a date with these components in local timezone
      // This mimics toZonedTime behavior: same time values, different timezone context
      return new Date(year, month, day, hour, minute, second);
    } catch (error) {
      console.warn(
        `Failed to convert date to timezone ${timeZone}, returning original date:`,
        error
      );
      return date;
    }
  }

  // Fallback for very old browsers: return the date as-is
  // This is not ideal but maintains functionality
  console.warn(
    "Intl.DateTimeFormat not available, timezone conversion may be inaccurate"
  );
  return date;
}

export { dateToTimeZone, formatTime, millisecondsToSeconds };
