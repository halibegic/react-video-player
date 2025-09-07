import { usePlayerStore } from "@/stores/player-store";
import { type PlayerEvents } from "@/utils/player-events";
import { useEffect } from "react";

type PlayerEventListenerProps = {
  callback: (event: string, data: unknown) => void;
};

function PlayerEventListener({ callback }: PlayerEventListenerProps) {
  const eventEmitter = usePlayerStore((state) => state.eventEmitter);

  useEffect(() => {
    const handlePlay = () => callback("play", undefined);
    const handlePause = () => callback("pause", undefined);
    const handleEnded = () => callback("ended", undefined);
    const handleSeeking = () => callback("seeking", undefined);
    const handleSeeked = () => callback("seeked", undefined);
    const handleTimeUpdate = (data: PlayerEvents["timeUpdate"]) =>
      callback("timeUpdate", data);
    const handleVolumeChange = (data: PlayerEvents["volumeChange"]) =>
      callback("volumeChange", data);
    const handleFullscreenChange = (data: PlayerEvents["fullscreenChange"]) =>
      callback("fullscreenChange", data);
    const handleQualityChange = (data: PlayerEvents["qualityChange"]) =>
      callback("qualityChange", data);
    const handleLoadedMetadata = (data: PlayerEvents["loadedMetadata"]) =>
      callback("loadedMetadata", data);
    const handleLoadStart = () => callback("loadStart", undefined);
    const handlePlaying = () => callback("playing", undefined);
    const handleWaiting = () => callback("waiting", undefined);
    const handleError = () => callback("error", undefined);

    eventEmitter.on("play", handlePlay);
    eventEmitter.on("pause", handlePause);
    eventEmitter.on("ended", handleEnded);
    eventEmitter.on("seeking", handleSeeking);
    eventEmitter.on("seeked", handleSeeked);
    eventEmitter.on("timeUpdate", handleTimeUpdate);
    eventEmitter.on("volumeChange", handleVolumeChange);
    eventEmitter.on("fullscreenChange", handleFullscreenChange);
    eventEmitter.on("qualityChange", handleQualityChange);
    eventEmitter.on("loadedMetadata", handleLoadedMetadata);
    eventEmitter.on("loadStart", handleLoadStart);
    eventEmitter.on("playing", handlePlaying);
    eventEmitter.on("waiting", handleWaiting);
    eventEmitter.on("error", handleError);

    return () => {
      eventEmitter.off("play", handlePlay);
      eventEmitter.off("pause", handlePause);
      eventEmitter.off("ended", handleEnded);
      eventEmitter.off("seeking", handleSeeking);
      eventEmitter.off("seeked", handleSeeked);
      eventEmitter.off("timeUpdate", handleTimeUpdate);
      eventEmitter.off("volumeChange", handleVolumeChange);
      eventEmitter.off("fullscreenChange", handleFullscreenChange);
      eventEmitter.off("qualityChange", handleQualityChange);
      eventEmitter.off("loadedMetadata", handleLoadedMetadata);
      eventEmitter.off("loadStart", handleLoadStart);
      eventEmitter.off("playing", handlePlaying);
      eventEmitter.off("waiting", handleWaiting);
      eventEmitter.off("error", handleError);
    };
  }, [callback, eventEmitter]);

  return null;
}

export { PlayerEventListener };
