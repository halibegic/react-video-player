import PlayerHlsEngine from "@/components/player/player-hls-engine";
import { usePlayerStore } from "@/stores/player-store";
import { useRef, type VideoHTMLAttributes } from "react";
import styled from "styled-components";

type PlayerTechProps = {
  url: string;
  isLive: boolean;
  isMuted?: boolean;
};

function PlayerTech({ url, isLive, isMuted = false }: PlayerTechProps) {
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
  const techRef = usePlayerStore((s) => s.techRef);
  const timeUpdateRef = useRef<number | null>(null);

  const handleNonLiveHandlers = (): Partial<
    VideoHTMLAttributes<HTMLVideoElement>
  > => {
    if (isLive) return {};

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
      <PlayerHlsEngine isLive={isLive} url={url} />
      <Video
        ref={techRef}
        playsInline
        autoPlay
        controls={false}
        muted={isMuted}
        preload="auto"
        crossOrigin="anonymous"
        onEnded={handleEnd}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onPause={handlePause}
        onPlay={handlePlay}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        tabIndex={-1}
        {...nonLiveHandlers}
      />
    </>
  );
}

const Video = styled.video`
  position: relative;
  width: 100%;
  height: 100%;

  @media (min-width: 768px) {
    pointer-events: none;
  }
`;

export { PlayerTech };
