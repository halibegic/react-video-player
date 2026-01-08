import { useInterval } from "@/hooks/use-interval";
import { usePlayerStore } from "@/stores/player-store";
import { diffDate, getLogDate, getTimeZone } from "@/utils/date-time";
import { useCallback, useEffect, useRef, useState } from "react";
import packageJson from "../../../package.json";

const ACTIVITY_LOG_INTERVAL = 11000;

const LOG_LEVEL = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARNING: 4,
  ERROR: 5,
} as const;

type LogType = "client" | "watch";

type LogParams = {
  type: LogType;
  message: string;
  level?: number;
  duration?: number | null;
  valueStr1?: string;
  valueStr2?: string;
};

type PlayerActivityListenerProps = {
  title?: string;
  id?: number;
  kind: "live" | "catchup" | "vod";
  delay?: number;
  url: string;
};

function PlayerActivityListener({
  title,
  id,
  kind,
  delay,
  url,
}: PlayerActivityListenerProps) {
  const logDateRef = useRef<Date | null>(null);
  const isPlayingRef = useRef(false);
  const [watchInterval, setWatchInterval] = useState<number | null>(null);
  const eventEmitter = usePlayerStore((state) => state.eventEmitter);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const environment = url.includes("staging") ? "stg" : "prd";
  const apiUrl =
    environment === "stg"
      ? "https://collector-staging.spectar.tv/ingest"
      : "https://collector.spectar.tv/ingest";
  const installation =
    environment === "stg"
      ? "spectar_fitnessanny_staging"
      : "spectar_fitnessanny_production";

  // Keep isPlaying ref in sync
  isPlayingRef.current = isPlaying;

  const handleLog = useCallback(
    async ({
      type,
      message,
      level = LOG_LEVEL.INFO,
      duration,
      valueStr1,
      valueStr2,
    }: LogParams) => {
      const data: Record<string, unknown> = {
        content_kind: kind,
        datetime: {
          date: getLogDate(),
          timezone: getTimeZone(),
        },
        installation,
        level_num: level,
        log_source: "fitnessanny_player",
        capp_version: packageJson.version,
        message,
        target_index:
          type === "client" ? "client_log" : "watching_activity_log",
      };

      if (title) data.title = title;
      if (id) data.value_int1 = id;
      if (valueStr1) data.value_str1 = valueStr1;
      if (valueStr2) data.value_str2 = valueStr2;

      // Watch log specific
      if (type === "watch") {
        if (duration) data.interval_duration = duration;
        if (delay) data.catchup_time = delay;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    [apiUrl, delay, id, installation, kind, title]
  );

  const handleWatchDate = useCallback((date?: Date | null) => {
    logDateRef.current = date ?? new Date();
  }, []);

  const handleWatchDuration = useCallback(
    async (duration?: number | null) => {
      if (!duration && logDateRef.current) {
        duration = diffDate(logDateRef.current, new Date(), "milliseconds");
      }

      console.log("[Player][Activity]", "Watching", duration);

      await handleLog({ type: "watch", message: "WATCHING", duration });
    },
    [handleLog]
  );

  useInterval(() => {
    handleWatchDuration(watchInterval);
    handleWatchDate();
  }, watchInterval);

  useEffect(() => {
    const handlePlay = () => {
      setWatchInterval(ACTIVITY_LOG_INTERVAL);
      handleLog({ type: "watch", message: "PLAY" });
      handleWatchDate();
    };

    const handlePause = () => {
      setWatchInterval(null);
      handleLog({ type: "watch", message: "PAUSE" });
      handleWatchDuration();
      handleWatchDate();
    };

    const handleResume = () => {
      setWatchInterval(ACTIVITY_LOG_INTERVAL);
      handleLog({ type: "watch", message: "RESUME" });
      handleWatchDate();
    };

    const handleRestart = () => {
      setWatchInterval(null);
      if (isPlayingRef.current) {
        handleLog({ type: "watch", message: "STOP" });
        handleWatchDuration();
      }
      setWatchInterval(ACTIVITY_LOG_INTERVAL);
      handleLog({ type: "watch", message: "PLAY" });
      handleWatchDate();
    };

    const handleStop = () => {
      setWatchInterval(null);
      handleLog({ type: "watch", message: "STOP" });
      if (isPlayingRef.current) handleWatchDuration();
      handleWatchDate();
    };

    const handleQualityChange = ({ level }: { level: string | null }) => {
      if (!level) return;

      handleLog({
        type: "client",
        message: "QUALITY_CHANGE",
        level: LOG_LEVEL.DEBUG,
        valueStr1: level,
      });
    };

    const handleError = (error: unknown) => {
      let code = "UNKNOWN_ERROR";
      let errorMessage = "Unknown error occurred";

      if (error instanceof MediaError) {
        if (error.code) code = `${error.code}`;
        if (error.message) errorMessage = `${error.message}`;
      }

      handleLog({
        type: "client",
        message: "ERROR",
        level: LOG_LEVEL.WARNING,
        valueStr1: code,
        valueStr2: errorMessage,
      });
    };

    eventEmitter.on("play", handlePlay);
    eventEmitter.on("pause", handlePause);
    eventEmitter.on("resume", handleResume);
    eventEmitter.on("restart", handleRestart);
    eventEmitter.on("ended", handleStop);
    eventEmitter.on("qualityChange", handleQualityChange);
    eventEmitter.on("error", handleError);

    return () => {
      eventEmitter.off("play", handlePlay);
      eventEmitter.off("pause", handlePause);
      eventEmitter.off("resume", handleResume);
      eventEmitter.off("restart", handleRestart);
      eventEmitter.off("ended", handleStop);
      eventEmitter.off("qualityChange", handleQualityChange);
      eventEmitter.off("error", handleError);
    };
  }, [eventEmitter, handleLog, handleWatchDate, handleWatchDuration]);

  return null;
}

export { PlayerActivityListener };
export type { PlayerActivityListenerProps };
