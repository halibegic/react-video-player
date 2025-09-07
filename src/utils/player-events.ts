import mitt, { type Emitter } from "mitt";

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

// Factory function to create a new event emitter instance
const createPlayerEventEmitter = (): Emitter<PlayerEvents> => {
  return mitt<PlayerEvents>();
};

export { createPlayerEventEmitter };
export type { PlayerEvents };
