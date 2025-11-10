type PlayerError = {
  message: string;
  code: string;
  tech: "hls" | "native";
};

type PlayerLevel = {
  bitrate?: number;
  height?: number;
  label: string;
  selected: boolean;
  sid: string;
  value: number;
  width?: number;
};

type PlayerEvents = {
  play: void;
  pause: void;
  ended: void;
  seeking: void;
  seeked: void;
  timeUpdate: { currentTime: number; duration: number };
  volumeChange: { volume: number };
  fullscreenChange: { isFullscreen: boolean };
  qualityChange: { level: number | null };
  loadedMetadata: { duration: number };
  loadStart: void;
  playing: void;
  waiting: void;
  error: unknown;
};

export type { PlayerError, PlayerEvents, PlayerLevel };
