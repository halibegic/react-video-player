import { WatchHistoryMaxPercent, WatchHistoryMinTime } from "@/config/player";
import { useInterval } from "@/hooks/use-interval";
import { usePlayerStore } from "@/stores/player-store";
import { useCallback, useEffect, useRef } from "react";

type VodPlayerWatchHistoryProps = {
  storageKey: string;
};

function VodPlayerWatchHistory({ storageKey }: VodPlayerWatchHistoryProps) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setStartTime = usePlayerStore((s) => s.setStartTime);
  const isReadyRef = useRef<boolean>(false);

  const setWatchHistory = useCallback(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        currentTime,
        duration,
      })
    );
  }, [currentTime, duration, storageKey]);

  const getWatchHistory = useCallback(() => {
    const history = window.localStorage.getItem(storageKey);

    if (history) {
      const data = JSON.parse(history);

      return {
        startTime: data.currentTime,
        progress: (data.currentTime / data.duration) * 100,
      };
    }

    return { startTime: null, progress: null };
  }, [storageKey]);

  const handleWatchHistory = useCallback(() => {
    if (currentTime < WatchHistoryMinTime) return;

    setWatchHistory();
  }, [currentTime, setWatchHistory]);

  const prepareData = useCallback(() => {
    if (isReadyRef.current) return;

    const { progress, startTime } = getWatchHistory();

    if (startTime && progress && progress < WatchHistoryMaxPercent) {
      setStartTime(startTime);

      isReadyRef.current = true;
    }
  }, [getWatchHistory, setStartTime]);

  useInterval(() => handleWatchHistory(), isPlaying ? 1000 : null);

  useEffect(() => {
    prepareData();
  }, [prepareData]);

  return null;
}

export { VodPlayerWatchHistory };
