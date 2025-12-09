import { LivePlayerEventCheck } from "@/components/live-player/live-player-event-check";
import { LivePlayerEventListener } from "@/components/live-player/live-player-event-listener";
import { LivePlayerKeyboard } from "@/components/live-player/live-player-keyboard";
import { LivePlayerProvider } from "@/components/live-player/live-player-provider";
import { LivePlayerTech } from "@/components/live-player/live-player-tech";
import { LivePlayerViewerCount } from "@/components/live-player/live-player-viewer-count";
import { LivePlayerGestures } from "@/components/live-player/ui/live-player-gestures";
import { LivePlayerGoLive } from "@/components/live-player/ui/live-player-go-live";
import { LivePlayerPlayback } from "@/components/live-player/ui/live-player-playback";
import { LivePlayerProgress } from "@/components/live-player/ui/live-player-progress";
import { LivePlayerStartOver } from "@/components/live-player/ui/live-player-start-over";
import { LivePlayerViewers } from "@/components/live-player/ui/live-player-viewers";
import { PlayerErrorNotice } from "@/components/player/player-error-check";
import styles from "@/components/player/ui/player-controls.module.css";
import { PlayerFullscreen } from "@/components/player/ui/player-fullscreen";
import { PlayerIdleCheck } from "@/components/player/ui/player-idle-check";
import { PlayerLoading } from "@/components/player/ui/player-loading";
import { PlayerQualityControl } from "@/components/player/ui/player-quality-control";
import { PlayerVolume } from "@/components/player/ui/player-volume";
import { usePlayerStore } from "@/stores/player-store";
import { RefObject, useEffect } from "react";
import packageJson from "../../package.json";

type LivePlayerProps = {
  url: string;
  messages?: {
    eventFinished: string;
    eventNotStarted: string;
    eventStartingSoon: string;
    live: string;
    unableToPlay: string;
  };
  onEvent?: (event: string, data: unknown) => void;
};

function LivePlayer(props: LivePlayerProps) {
  return (
    <LivePlayerProvider>
      <Player {...props} />
    </LivePlayerProvider>
  );
}

function Player({ url, messages, onEvent }: LivePlayerProps) {
  const containerRef = usePlayerStore((s) => s.containerRef);

  useEffect(() => {
    console.log(`[Player][Live] Version: ${packageJson.version}`);
  }, []);

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement>}
      className={styles.playerContainer}
    >
      <LivePlayerEventCheck
        url={url}
        messages={{
          eventNotStarted: messages?.eventNotStarted,
          eventStartingSoon: messages?.eventStartingSoon,
        }}
      >
        <LivePlayerTech
          url={url}
          messages={{
            eventFinished: messages?.eventFinished,
            unableToPlay: messages?.unableToPlay,
          }}
        />
        <PlayerErrorNotice />
        <PlayerLoading />
        <LivePlayerGestures />
        <PlayerIdleCheck>
          <div className={styles.controlsTop}>
            <div className={styles.controlsContainer}>
              <div className={styles.controlsRow}>
                <LivePlayerViewers />
              </div>
            </div>
          </div>
          <div className={styles.controlsBottom}>
            <div className={styles.controlsContainer}>
              <LivePlayerProgress />
              <div className={styles.controlsRow}>
                <div
                  className={`${styles.controlsSection} ${styles.controlsSectionStart}`}
                >
                  <LivePlayerPlayback />
                  <LivePlayerStartOver />
                  <PlayerVolume />
                </div>
                <div
                  className={`${styles.controlsSection} ${styles.controlsSectionEnd}`}
                >
                  <LivePlayerGoLive message={messages?.live} />
                  <PlayerQualityControl />
                  <PlayerFullscreen />
                </div>
              </div>
            </div>
          </div>
        </PlayerIdleCheck>
      </LivePlayerEventCheck>
      <LivePlayerKeyboard />
      <LivePlayerViewerCount url={url} />
      {onEvent && <LivePlayerEventListener callback={onEvent} />}
    </div>
  );
}

export { LivePlayer };
export type { LivePlayerProps };
