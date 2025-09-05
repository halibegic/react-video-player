import { usePlayerStore } from "@/stores/player-store";
import { mapLevels } from "@/utils/player";
import Hls, { type HlsConfig } from "hls.js";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const isStarted = usePlayerStore((s) => s.isStarted);

  // Single failover state: tracks if we've already attempted a retry
  const [hasRetried, setHasRetried] = useState(false);

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
  }, [setLevels]);

  const handleError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: string, data: any) => {
      console.error("[Player][HLS] ERROR", event, data);

      if (!hlsRef.current) return;

      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          if (data.fatal) hlsRef.current.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          if (data.fatal) hlsRef.current.recoverMediaError();
          else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            if (isLive && !hasRetried) {
              setHasRetried(true);

              console.log(
                "[Player][HLS] Stream failed, attempting failover retry..."
              );

              try {
                console.log("[Player][HLS] Retrying stream...");
                hlsRef.current.loadSource(url);
              } catch (error) {
                console.error("[Player][HLS] Failover retry failed:", error);
              }
            }
          }
          break;
      }
    },
    [isLive, hasRetried, url]
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

    setHasRetried(false);
  }, [handleManifestLoaded, handleMediaAttached, handleError]);

  useEffect(() => {
    if (level !== null) handleQuality(level);
  }, [level, handleQuality]);

  useEffect(() => {
    if (isStarted) setHasRetried(false);
  }, [isStarted]);

  useEffect(() => {
    if (Hls.isSupported()) prepareHls();

    return cleanupHls;
  }, [cleanupHls, prepareHls]);

  return null;
}

export { PlayerHlsEngine };
