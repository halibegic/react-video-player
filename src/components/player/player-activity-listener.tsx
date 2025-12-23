import { useInterval } from "@/hooks/use-interval";
import { usePlayerStore } from "@/stores/player-store";
import { diffDate, getLogDate, getTimeZone } from "@/utils/date-time";
import { useCallback, useEffect, useRef, useState } from "react";
import packageJson from "../../../package.json";

const ACTIVITY_LOG_INTERVAL = 11000;

type PlayerActivityListenerProps = {
  title?: string;
  kind: "live" | "catchup" | "vod";
  delay?: number;
  url: string;
};

function PlayerActivityListener({
  title,
  kind,
  delay,
  url,
}: PlayerActivityListenerProps) {
  const logDateRef = useRef<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const eventEmitter = usePlayerStore((state) => state.eventEmitter);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const environment = url.includes("staging") ? "stg" : "prd";
  const apiUrl =
    environment === "stg"
      ? "https://collector-staging.spectar.tv/ingest"
      : "https://collector.spectar.tv/ingest";

  const handleLog = useCallback(
    async (message: string, duration?: number | null) => {
      const data: Record<string, unknown> = {
        content_kind: kind,
        datetime: {
          date: getLogDate(),
          timezone: getTimeZone(),
        },
        level_num: 3, // INFO
        log_source: "fitnessanny_player",
        capp_version: packageJson.version,
        message,
        target_index: "watching_activity_log",
      };

      if (title) data.title = title;
      if (duration) data.interval_duration = duration;
      if (delay) data.catchup_time = delay;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    [apiUrl, delay, kind, title]
  );

  const handleLogDate = (date?: Date | null) => {
    if (!date) date = new Date();

    logDateRef.current = date;
  };

  const handlePlay = useCallback(async () => {
    console.log("[Player][Activity]", "Play");

    await handleLog("PLAY");
  }, [handleLog]);

  const handlePause = useCallback(async () => {
    console.log("[Player][Activity]", "Pause");

    await handleLog("PAUSE");
  }, [handleLog]);

  const handleResume = useCallback(async () => {
    console.log("[Player][Activity]", "Resume");

    await handleLog("RESUME");
  }, [handleLog]);

  const handleStop = useCallback(async () => {
    console.log("[Player][Activity]", "Stop");

    await handleLog("STOP");
  }, [handleLog]);

  const handleWatching = useCallback(
    async (duration?: number | null) => {
      if (!duration && logDateRef.current) {
        duration = diffDate(logDateRef.current, new Date(), "milliseconds");
      }

      console.log("[Player][Activity]", "Watching", duration);

      await handleLog("WATCHING", duration);
    },
    [handleLog]
  );

  useInterval(() => {
    handleWatching(refreshInterval);
    handleLogDate();
  }, refreshInterval);

  useEffect(() => {
    const onPlay = () => {
      setRefreshInterval(ACTIVITY_LOG_INTERVAL);
      handlePlay();
      handleLogDate();
    };
    const onPause = () => {
      setRefreshInterval(null);
      handlePause();
      handleWatching();
      handleLogDate();
    };

    const onResume = () => {
      setRefreshInterval(ACTIVITY_LOG_INTERVAL);
      handleResume();
      handleLogDate();
    };

    const onRestart = () => {
      setRefreshInterval(null);
      if (isPlaying) {
        handleStop();
        handleWatching();
      }
      setRefreshInterval(ACTIVITY_LOG_INTERVAL);
      handlePlay();
      handleLogDate();
    };

    const onStop = () => {
      setRefreshInterval(null);
      handleStop();
      if (isPlaying) handleWatching();
      handleLogDate();
    };

    const onError = () => {};

    eventEmitter.on("play", onPlay);
    eventEmitter.on("pause", onPause);
    eventEmitter.on("resume", onResume);
    eventEmitter.on("restart", onRestart);
    eventEmitter.on("ended", onStop);
    eventEmitter.on("error", onError);

    return () => {
      eventEmitter.off("play", onPlay);
      eventEmitter.off("pause", onPause);
      eventEmitter.off("resume", onResume);
      eventEmitter.off("restart", onRestart);
      eventEmitter.off("ended", onStop);
      eventEmitter.off("error", onError);
    };
  }, [
    eventEmitter,
    handlePause,
    handlePlay,
    handleResume,
    handleStop,
    handleWatching,
    isPlaying,
  ]);

  return null;
}

export { PlayerActivityListener };
export type { PlayerActivityListenerProps };
