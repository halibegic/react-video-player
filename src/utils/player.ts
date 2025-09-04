import { PlayerLevel } from "@/types/player";

const getLiveDelay = (startTime: number, skipTime = 0): number => {
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

const formatBytes = (bytes: number, decimals = 0) => {
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
};

type Level = {
  bitrate: number;
  height: number;
  index: number;
  width: number;
};

type MapLevelsProps = {
  isAuto: boolean;
  level: number | undefined | null;
  levels: Level[];
};

function mapLevels({
  isAuto,
  level,
  levels,
}: MapLevelsProps): PlayerLevel[] | null {
  const size = levels.length;
  const items: PlayerLevel[] = [];

  if (size > 1) {
    items.push({
      sid: "quality-level-auto",
      label: "Auto",
      value: -1,
      selected: isAuto || -1 === level,
    });
  }

  levels.sort(function (x, y) {
    const a = x.height || x.bitrate || 0;
    const b = y.height || y.bitrate || 0;

    return a === b ? 0 : a > b ? 1 : -1;
  });

  levels.map((item) => {
    const { bitrate, height, index } = item;

    items.push({
      sid: `quality-level-${index}`,
      label: height ? `${height}p` : formatBytes(bitrate),
      value: index,
      selected: size === 1 || (!isAuto && index === level),
    });
  });

  return items;
}

export { getLiveCurrentTime, getLiveDelay, getLiveDurationTime, mapLevels };
