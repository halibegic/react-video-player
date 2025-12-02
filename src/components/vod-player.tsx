import { PlayerErrorNotice } from "@/components/player/player-error-check";
import { PlayerProvider } from "@/components/player/player-provider";
import { PlayerTech } from "@/components/player/player-tech";
import styles from "@/components/player/ui/player-controls.module.css";
import { PlayerFullscreen } from "@/components/player/ui/player-fullscreen";
import { PlayerIdleCheck } from "@/components/player/ui/player-idle-check";
import { PlayerLoading } from "@/components/player/ui/player-loading";
import { PlayerQualityControl } from "@/components/player/ui/player-quality-control";
import { PlayerVolume } from "@/components/player/ui/player-volume";
import { VodPlayerGestures } from "@/components/vod-player/ui/vod-player-gestures";
import { VodPlayerPlayback } from "@/components/vod-player/ui/vod-player-playback";
import { VodPlayerProgress } from "@/components/vod-player/ui/vod-player-progress";
import { VodPlayerRemainingTime } from "@/components/vod-player/ui/vod-player-remaining-time";
import { VodPlayerEventListener } from "@/components/vod-player/vod-player-event-listener";
import { VodPlayerKeyboard } from "@/components/vod-player/vod-player-keyboard";
import { usePlayerStore } from "@/stores/player-store";
import { RefObject, useEffect } from "react";

type VodPlayerProps = {
  url: string;
  startTime?: number;
  messages?: {
    unableToPlay: string;
  };
  onEvent?: (event: string, data: unknown) => void;
};

function VodPlayer(props: VodPlayerProps) {
  return (
    <PlayerProvider>
      <Player {...props} />
    </PlayerProvider>
  );
}

function Player({ url, messages, onEvent, startTime }: VodPlayerProps) {
  const setStartTime = usePlayerStore((s) => s.setStartTime);
  const containerRef = usePlayerStore((s) => s.containerRef);

  useEffect(() => {
    if (startTime) setStartTime(startTime);
  }, [startTime, setStartTime]);

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement>}
      className={styles.playerContainer}
    >
      <PlayerTech url={url} isLive={false} messages={messages} />
      <PlayerErrorNotice />
      <PlayerLoading />
      <PlayerIdleCheck>
        <VodPlayerGestures />
        <div className={styles.controlsBottom}>
          <div className={styles.controlsContainer}>
            <VodPlayerProgress />
            <div className={styles.controlsRow}>
              <div
                className={`${styles.controlsSection} ${styles.controlsSectionStart}`}
              >
                <VodPlayerPlayback />
                <PlayerVolume />
                <VodPlayerRemainingTime />
              </div>
              <div
                className={`${styles.controlsSection} ${styles.controlsSectionEnd}`}
              >
                <PlayerQualityControl />
                <PlayerFullscreen />
              </div>
            </div>
          </div>
        </div>
      </PlayerIdleCheck>
      <VodPlayerKeyboard />
      {onEvent && <VodPlayerEventListener callback={onEvent} />}
    </div>
  );
}

export { VodPlayer };
export type { VodPlayerProps };
