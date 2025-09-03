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

    console.log("[Player][Event]", "MEDIA_ATTACHED");

    hlsRef.current.loadSource(url);
  }, [url]);

  const handleManifestLoaded = useCallback((): void => {
    if (!hlsRef.current) return;

    console.log("[Player][Event]", "MANIFEST_LOADED");

    // Levels
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

  const prepareHls = useCallback(() => {
    if (!techRef.current) return;

    const liveConfig = {
      backBufferLength: 10,
      startLevel: -1,
    } as HlsConfig;

    const vodConfig = {
      backBufferLength: 60,
      startLevel: -1,
    } as HlsConfig;

    const config = isLive ? liveConfig : vodConfig;

    try {
      console.log("[Player] URL", url);
      console.log("[Player] Config", JSON.stringify(config));
      console.log("[Player] Version", Hls.version);

      hlsRef.current = new Hls(config) as Hls;

      hlsRef.current.attachMedia(techRef.current);

      hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, handleMediaAttached);
      hlsRef.current.on(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);
    } catch (error) {
      throw new Error(`Error initializing Hls: ${error}`);
    }
  }, [handleManifestLoaded, handleMediaAttached, isLive, techRef, url]);

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.off(Hls.Events.MEDIA_ATTACHED, handleMediaAttached);
      hlsRef.current.off(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);

      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, [handleManifestLoaded, handleMediaAttached]);

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
