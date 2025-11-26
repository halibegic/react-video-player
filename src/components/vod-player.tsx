import { PlayerErrorNotice } from "@/components/player/player-error-check";
import { PlayerEventListener } from "@/components/player/player-event-listener";
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
import { VodPlayerKeyboard } from "@/components/vod-player/vod-player-keyboard";
import { usePlayerStore } from "@/stores/player-store";
import { RefObject, useEffect } from "react";

type VodPlayerProps = {
  url: string;
  startTime?: number;
  onEvent?: (event: string, data: unknown) => void;
};

function VodPlayer(props: VodPlayerProps) {
  return (
    <PlayerProvider>
      <Player {...props} />
    </PlayerProvider>
  );
}

function Player({ url, onEvent, startTime }: VodPlayerProps) {
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
      <PlayerTech url={url} isLive={false} />
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
      {onEvent && <PlayerEventListener callback={onEvent} />}
    </div>
  );
}

export { VodPlayer };
export type { VodPlayerProps };
