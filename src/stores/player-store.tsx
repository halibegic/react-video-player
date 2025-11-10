import type { StateCreator, StoreApi } from "zustand";
import { create, useStore } from "zustand";

import { PlayerError, PlayerLevel } from "@/types/player";
import { millisecondsToSeconds } from "@/utils/date-time";
import { isiOS } from "@/utils/device";
import { exitFullscreen, requestFullscreen } from "@/utils/fullscreen";
import { createPlayerEventEmitter } from "@/utils/player-events";
import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
  type RefObject,
} from "react";

// Slices

// Playback slice

type PlaybackState = {
  currentTime: number;
  duration: number;
  isEnded: boolean;
  isLoading: boolean;
  isLoop: boolean;
  isMetaLoaded: boolean;
  isPlaying: boolean;
  isReady: boolean;
  isStarted: boolean;
  pauseTime: number;
  seekTime: number;
  startTime: number;
  volume: number;
};

type PlaybackActions = {
  destroy: () => void;
  getPauseTimeDiff: () => number;
  handleDurationChange: () => void;
  handleEnd: () => void;
  handleLoadedMetadata: () => void;
  handleLoadStart: () => void;
  handlePause: () => void;
  handlePlay: () => void;
  handlePlaying: () => void;
  handleSeeked: () => void;
  handleSeeking: () => void;
  handleTimeUpdate: () => void;
  handleWaiting: () => void;
  handleVolumeChange: () => void;
  handleError: (event: unknown) => void;
  pause: () => void;
  play: () => void;
  seek: (time: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoop: (isLoop: boolean) => void;
  setStartTime: (startTime: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
};

type PlaybackSlice = PlaybackState & PlaybackActions;

// Idle lock slice

type IdleLockState = {
  idleLocks: Set<string>;
};

type IdleLockActions = {
  addIdleLock: (lockId: string) => void;
  removeIdleLock: (lockId: string) => void;
};

type IdleLockSlice = IdleLockState & IdleLockActions;

// Quality slice

type QualityState = {
  level: number | null;
  levels: PlayerLevel[] | null;
};

type QualityActions = {
  setLevel: (level: number | null) => void;
  setLevels: (levels: PlayerLevel[] | null) => void;
};

type QualitySlice = QualityState & QualityActions;

// Fullscreen slice

type FullscreenState = {
  isFullscreen: boolean;
  isFullscreenReady: boolean;
};

type FullscreenActions = {
  exitFullscreen: () => void;
  requestFullscreen: () => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsFullscreenReady: (isFullscreenReady: boolean) => void;
};

type FullscreenSlice = FullscreenState & FullscreenActions;

// Error slice

type ErrorState = {
  error: PlayerError | null;
};

type ErrorActions = {
  setError: (error: PlayerError | null) => void;
};

type ErrorSlice = ErrorState & ErrorActions;

// Refs slice type (general references like video and container)

type RefState = {
  techRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
};

type RefSlice = RefState;

// Event emitter slice type

type EventEmitterState = {
  eventEmitter: ReturnType<typeof createPlayerEventEmitter>;
};

type EventEmitterSlice = EventEmitterState;

type PlayerStore = PlaybackSlice &
  IdleLockSlice &
  QualitySlice &
  FullscreenSlice &
  ErrorSlice &
  RefSlice &
  EventEmitterSlice;

// Playback slice creator

const createPlaybackSlice: StateCreator<
  PlaybackSlice & IdleLockSlice & RefSlice & EventEmitterSlice,
  [],
  [],
  PlaybackSlice
> = (set, get) => ({
  currentTime: 0,
  duration: 0,
  isEnded: false,
  isLoading: false,
  isLoop: false,
  isMetaLoaded: false,
  isPlaying: false,
  isReady: false,
  isStarted: false,
  pauseTime: 0,
  seekTime: -1,
  startTime: -1,
  volume: 100,
  destroy: () => {},
  handleDurationChange: () => {
    const video = get().techRef.current;

    if (!video) return;

    set({ duration: video.duration });
  },
  handleEnd: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("ended");

    set({
      isEnded: true,
      isLoading: false,
      isMetaLoaded: false,
      isPlaying: false,
    });
  },
  handleLoadedMetadata: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("loadedMetadata", {
      duration: video.duration,
    });

    video.loop = get().isLoop;

    video.volume = video.muted ? 0 : 1;

    if (get().startTime !== -1) video.currentTime = get().startTime;

    set({
      currentTime: get().startTime !== -1 ? get().startTime : video.currentTime,
      duration: video.duration,
      startTime: -1,
      isMetaLoaded: true,
      volume: video.muted ? 0 : 100,
    });
  },
  handleLoadStart: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("loadStart");

    set({ isReady: true });

    video
      .play()
      .then(() => {
        set({
          isEnded: false,
          isLoading: false,
          isPlaying: true,
          isStarted: true,
          pauseTime: 0,
        });
      })
      .catch((error: unknown) => {
        set(() => {
          console.info("Player failed to autoplay", error);

          return {
            isStarted: false,
            isEnded: false,
            isLoading: false,
            isPlaying: false,
          };
        });
      });
  },
  handlePause: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("pause");

    set({
      isPlaying: false,
      pauseTime: Date.now(),
    });
  },
  handlePlay: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("play");

    set({
      isPlaying: true,
      pauseTime: 0,
    });
  },

  handlePlaying: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("playing");

    set({ isLoading: false });
  },
  handleSeeked: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("seeked");

    set({ isLoading: false });
  },
  handleSeeking: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("seeking");

    set({ isLoading: true });
  },
  handleTimeUpdate: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("timeUpdate", {
      currentTime: video.currentTime,
      duration: video.duration,
    });

    set({ currentTime: video.currentTime });
  },
  handleWaiting: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("waiting");

    set({ isLoading: true });
  },
  handleVolumeChange: () => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("volumeChange", { volume: video.volume });
  },
  handleError: (event) => {
    const video = get().techRef.current;

    if (!video) return;

    get().eventEmitter.emit("error", event);
  },
  pause: () => {
    const video = get().techRef.current;

    if (!video) return;

    video.pause();

    set({
      isEnded: false,
      isPlaying: false,
      pauseTime: Date.now(),
    });
  },
  getPauseTimeDiff: () => {
    if (!get().isStarted || !get().pauseTime) return 0;

    return parseInt(
      millisecondsToSeconds(Date.now() - get().pauseTime).toFixed(0)
    );
  },
  play: () => {
    const video = get().techRef.current;

    if (!video) return;

    video.play();

    set({
      isEnded: false,
      isPlaying: true,
      isStarted: true,
      pauseTime: 0,
    });
  },
  seek: (time: number) => {
    const video = get().techRef.current;

    if (!video) return;

    video.currentTime = time;

    if (video.paused || video.ended) video.play();

    set({
      seekTime: -1,
      currentTime: time,
      isStarted: true,
      isEnded: false,
      isPlaying: true,
    });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLoop: (isLoop) => {
    const video = get().techRef.current;

    if (!video) return;

    video.loop = isLoop;

    set({ isLoop });
  },
  setStartTime: (startTime) => set({ startTime }),
  setVolume: (volume: number) => {
    const video = get().techRef.current;

    if (!video) return;

    video.muted = volume === 0;
    video.volume = volume / 100;

    set({ volume });
  },
  stop: () => {
    const video = get().techRef.current;

    if (!video) return;

    set({
      isPlaying: false,
      isLoading: false,
    });
  },
});

// Idle lock slice creator

const createIdleLockSlice: StateCreator<
  IdleLockSlice,
  [],
  [],
  IdleLockSlice
> = (set) => ({
  idleLocks: new Set<string>(),
  addIdleLock: (lockId) =>
    set((state) => ({
      idleLocks: new Set(state.idleLocks).add(lockId),
    })),
  removeIdleLock: (lockId) =>
    set((state) => {
      const newLocks = new Set(state.idleLocks);
      newLocks.delete(lockId);
      return { idleLocks: newLocks };
    }),
});

// Quality slice creator

const createQualitySlice: StateCreator<
  QualitySlice & EventEmitterSlice,
  [],
  [],
  QualitySlice
> = (set, get) => ({
  level: null,
  levels: null,
  setLevels: (levels) => set({ levels }),
  setLevel: (level) => {
    if (level) get().eventEmitter.emit("qualityChange", { level });

    set({ level });
  },
});

// Fullscreen slice creator

const createFullscreenSlice: StateCreator<
  FullscreenSlice & RefSlice & EventEmitterSlice,
  [],
  [],
  FullscreenSlice
> = (set, get) => ({
  isFullscreen: false,
  isFullscreenReady: false,
  exitFullscreen: () => {
    get().eventEmitter.emit("fullscreenChange", { isFullscreen: false });

    exitFullscreen(document);

    set({ isFullscreen: false });
  },
  requestFullscreen: () => {
    const video = get().techRef.current;
    const container = get().containerRef.current;

    if (!video || !container) return;

    get().eventEmitter.emit("fullscreenChange", { isFullscreen: true });

    const element = isiOS ? video : container;

    if (element) requestFullscreen(element);

    set({ isFullscreen: true });
  },
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setIsFullscreenReady: (isFullscreenReady: boolean) =>
    set({ isFullscreenReady }),
});

// Error slice creator

const createErrorSlice: StateCreator<ErrorSlice, [], [], ErrorSlice> = (
  set
) => ({
  error: null,
  setError: (error) => set({ error }),
});

// Event emitter slice creator

const createEventEmitterSlice: StateCreator<
  EventEmitterSlice,
  [],
  [],
  EventEmitterSlice
> = () => ({
  eventEmitter: createPlayerEventEmitter(),
});

// Refs slice creator

type CreatePropsSlice = (
  args: RefSlice
) => StateCreator<RefSlice, [], [], RefSlice>;

const createRefSlice: CreatePropsSlice = (props: RefSlice) => () => ({
  ...props,
});

const createPlayerStore = (
  techRef: RefObject<HTMLVideoElement | null>,
  containerRef: RefObject<HTMLDivElement | null>
) =>
  create<PlayerStore>()((...a) => ({
    ...createPlaybackSlice(...a),
    ...createIdleLockSlice(...a),
    ...createFullscreenSlice(...a),
    ...createQualitySlice(...a),
    ...createErrorSlice(...a),
    ...createEventEmitterSlice(...a),
    ...createRefSlice({
      techRef,
      containerRef,
    })(...a),
  }));

const PlayerStoreContext = createContext<StoreApi<PlayerStore> | null>(null);

function PlayerStoreProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<ReturnType<typeof createPlayerStore> | null>(null);
  const techRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!storeRef.current)
    storeRef.current = createPlayerStore(techRef, containerRef);

  return (
    <PlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayerStoreContext.Provider>
  );
}

const usePlayerStore = <T,>(selector: (state: PlayerStore) => T): T => {
  const store = useContext(PlayerStoreContext);

  if (!store)
    throw new Error("usePlayerStore must be used within PlayerStoreProvider");

  return useStore(store, selector);
};

// eslint-disable-next-line react-refresh/only-export-components
export { PlayerStoreProvider, usePlayerStore };
