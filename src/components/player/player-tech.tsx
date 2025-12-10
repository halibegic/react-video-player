import { PlayerHlsEngine } from "@/components/player/player-hls-engine";
import { usePlayerStore } from "@/stores/player-store";
import { RefObject, useRef, type VideoHTMLAttributes } from "react";
import styles from "./player-tech.module.css";

type PlayerTechProps = {
  url: string;
  isLive: boolean;
  isMuted?: boolean;
  messages: {
    unableToPlay: string;
  };
};

function PlayerTech({
  url,
  isLive,
  isMuted = false,
  messages,
}: PlayerTechProps) {
  const handleDurationChange = usePlayerStore((s) => s.handleDurationChange);
  const handleEnd = usePlayerStore((s) => s.handleEnd);
  const handleLoadedMetadata = usePlayerStore((s) => s.handleLoadedMetadata);
  const handleLoadStart = usePlayerStore((s) => s.handleLoadStart);
  const handlePause = usePlayerStore((s) => s.handlePause);
  const handlePlay = usePlayerStore((s) => s.handlePlay);
  const handlePlaying = usePlayerStore((s) => s.handlePlaying);
  const handleSeeked = usePlayerStore((s) => s.handleSeeked);
  const handleSeeking = usePlayerStore((s) => s.handleSeeking);
  const handleTimeUpdate = usePlayerStore((s) => s.handleTimeUpdate);
  const handleWaiting = usePlayerStore((s) => s.handleWaiting);
  const handleVolumeChange = usePlayerStore((s) => s.handleVolumeChange);
  const handleError = usePlayerStore((s) => s.handleError);
  const techRef = usePlayerStore((s) => s.techRef);
  const timeUpdateRef = useRef<number | null>(null);

  const handleNonLiveHandlers = (): Partial<
    VideoHTMLAttributes<HTMLVideoElement>
  > => {
    if (isLive)
      return {
        onTimeUpdate: handleThrottledTimeUpdate,
      };

    return {
      onDurationChange: handleDurationChange,
      onSeeked: handleSeeked,
      onSeeking: handleSeeking,
      onTimeUpdate: handleThrottledTimeUpdate,
    };
  };

  // Throttle the time update event to fire at most once per second
  // to prevent performance issues caused by frequent updates.
  const handleThrottledTimeUpdate = () => {
    if (!timeUpdateRef.current || Date.now() - timeUpdateRef.current >= 1000) {
      handleTimeUpdate();
      timeUpdateRef.current = Date.now();
    }
  };

  const nonLiveHandlers = handleNonLiveHandlers();

  return (
    <>
      <PlayerHlsEngine isLive={isLive} url={url} messages={messages} />
      <video
        ref={techRef as RefObject<HTMLVideoElement>}
        className={styles.playerVideo}
        playsInline
        autoPlay
        controls={false}
        muted={isMuted}
        preload="auto"
        crossOrigin="anonymous"
        onEnded={handleEnd}
        onError={handleError}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onPause={handlePause}
        onPlay={handlePlay}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onVolumeChange={handleVolumeChange}
        tabIndex={-1}
        {...nonLiveHandlers}
      />
    </>
  );
}

export { PlayerTech };
