import { usePlayerStore } from "@/stores/player-store";
import Hls, { type HlsConfig } from "hls.js";
import { useCallback, useEffect, useRef } from "react";

type PlayerHlsTechProps = {
  url: string;
  isLive: boolean;
};

function PlayerHlsTech({ url, isLive }: PlayerHlsTechProps) {
  const hlsRef = useRef<Hls | null>(null);
  const techRef = usePlayerStore((s) => s.techRef);

  const handleMediaAttached = useCallback((): void => {
    if (!hlsRef.current) return;

    console.log("[Player][Event]", "MEDIA_ATTACHED");

    hlsRef.current.loadSource(url);
  }, [url]);

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
    } catch (error) {
      throw new Error(`Error initializing Hls: ${error}`);
    }
  }, [handleMediaAttached, isLive, techRef, url]);

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.off(Hls.Events.MEDIA_ATTACHED, handleMediaAttached);

      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, [handleMediaAttached]);

  useEffect(() => {
    if (Hls.isSupported()) prepareHls();

    return cleanupHls;
  }, [cleanupHls, prepareHls]);

  return null;
}

export default PlayerHlsTech;
