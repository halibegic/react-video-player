import { usePlayerStore } from "@/stores/player-store";
import { mapLevels } from "@/utils/player";
import Hls, { type HlsConfig } from "hls.js";
import { useCallback, useEffect, useRef } from "react";

type PlayerHlsEngineProps = {
  url: string;
  isLive: boolean;
};

function PlayerHlsEngine({ url, isLive }: PlayerHlsEngineProps) {
  const hlsRef = useRef<Hls | null>(null);
  const level = usePlayerStore((s) => s.level);
  const levels = usePlayerStore((s) => s.levels);
  const setLevel = usePlayerStore((s) => s.setLevel);
  const setLevels = usePlayerStore((s) => s.setLevels);
  const techRef = usePlayerStore((s) => s.techRef);
  const setError = usePlayerStore((s) => s.setError);

  // Retry state for BUFFER_STALLED_ERROR in live mode
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 50;
  const retryDelayMs = 10000; // 10 seconds

  const handleQuality = useCallback(
    (value: number) => {
      if (!hlsRef.current) return;

      hlsRef.current.nextLevel = value;

      setLevel(null);

      if (levels) {
        const items = levels.map((item) => ({
          ...item,
          selected: item.value === value,
        }));

        setLevels(items);
      }
    },
    [levels, setLevel, setLevels, hlsRef]
  );

  const handleMediaAttached = useCallback((): void => {
    if (!hlsRef.current) return;

    console.log("[Player][HLS] MEDIA_ATTACHED");

    hlsRef.current.loadSource(url);
  }, [url]);

  const handleManifestLoaded = useCallback((): void => {
    if (!hlsRef.current) return;

    console.log("[Player][HLS] MANIFEST_LOADED");

    // Reset retry counter
    setError(null);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;

    // Set levels
    const _levels = hlsRef.current.levels;
    const _level = hlsRef.current.currentLevel;
    const _isAuto = hlsRef.current.autoLevelEnabled;

    setLevels(
      mapLevels({
        levels: _levels.map((item, index) => {
          const { bitrate, height, width } = item;

          return {
            bitrate,
            height,
            index,
            width,
          };
        }),
        level: _level,
        isAuto: _isAuto,
      })
    );
  }, [setError, setLevels]);

  const handleError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: string, data: any) => {
      console.error("[Player][HLS] ERROR", event, data);

      if (!hlsRef.current) return;

      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.log("[Player][HLS] NETWORK_ERROR", data);
          if (isLive) {
            if (data.details === "manifestLoadError") {
              if (retryCountRef.current < maxRetries) {
                // Clear any existing retry timeout
                if (retryTimeoutRef.current) {
                  clearTimeout(retryTimeoutRef.current);
                }

                retryCountRef.current += 1;

                retryTimeoutRef.current = setTimeout(() => {
                  if (hlsRef.current) {
                    try {
                      console.log("[Player][HLS] Retrying stream...");
                      hlsRef.current.loadSource(url);
                    } catch (error) {
                      console.error("[Player][HLS] Retry failed:", error);
                    }
                  }
                }, retryDelayMs);
              }
              setError({
                message: "Live event will be back shortly.",
                code: "MANIFEST_LOAD_ERROR",
                tech: "hls",
              });
            }
          } else {
            hlsRef.current.startLoad();
          }
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hlsRef.current.recoverMediaError();
          break;
        default:
          break;
      }
    },
    [isLive, url, setError]
  );

  const prepareHls = useCallback(() => {
    if (!techRef.current) return;

    const liveConfig = {
      backBufferLength: 10,
      startLevel: -1,
      maxBufferSize: 30 * 1024 * 1024, // 30MB
    } as HlsConfig;

    const vodConfig = {
      backBufferLength: 60,
      startLevel: -1,
      maxBufferSize: 30 * 1024 * 1024, // 30MB
    } as HlsConfig;

    const config = isLive ? liveConfig : vodConfig;

    try {
      console.log("[Player][HLS] URL", url);
      console.log("[Player][HLS] Config", JSON.stringify(config));
      console.log("[Player][HLS] Version", Hls.version);

      hlsRef.current = new Hls(config) as Hls;

      hlsRef.current.attachMedia(techRef.current);

      hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, handleMediaAttached);
      hlsRef.current.on(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);
      hlsRef.current.on(Hls.Events.ERROR, handleError);
    } catch (error) {
      throw new Error(`Error initializing Hls: ${error}`);
    }
  }, [
    handleManifestLoaded,
    handleMediaAttached,
    handleError,
    isLive,
    techRef,
    url,
  ]);

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.off(Hls.Events.MEDIA_ATTACHED, handleMediaAttached);
      hlsRef.current.off(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);
      hlsRef.current.off(Hls.Events.ERROR, handleError);

      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Clear retry timeout and reset counter
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;
  }, [handleManifestLoaded, handleMediaAttached, handleError]);

  useEffect(() => {
    if (level !== null) handleQuality(level);
  }, [level, handleQuality]);

  useEffect(() => {
    if (Hls.isSupported()) prepareHls();

    return cleanupHls;
  }, [cleanupHls, prepareHls]);

  return null;
}

export { PlayerHlsEngine };
