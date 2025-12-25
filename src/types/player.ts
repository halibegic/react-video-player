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
  ended: void;
  error: unknown;
  fullscreenChange: { isFullscreen: boolean };
  loadedMetadata: { duration: number };
  loadStart: void;
  pause: void;
  play: void;
  playing: void;
  qualityChange: { level: string | null };
  resetIdle: void;
  restart: void;
  resume: void;
  seeked: void;
  seeking: void;
  stop: void;
  timeUpdate: { currentTime: number; duration: number };
  volumeChange: { volume: number };
  waiting: void;
};

export type { PlayerError, PlayerEvents, PlayerLevel };
