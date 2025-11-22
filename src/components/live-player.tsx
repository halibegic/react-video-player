import { LivePlayerEventCheck } from "@/components/live-player/live-player-event-check";
import { LivePlayerKeyboard } from "@/components/live-player/live-player-keyboard";
import { LivePlayerProvider } from "@/components/live-player/live-player-provider";
import { LivePlayerTech } from "@/components/live-player/live-player-tech";
import { LivePlayerDesktopPlaybackIndicator } from "@/components/live-player/ui/live-player-desktop-playback-indicator";
import { LivePlayerGoLive } from "@/components/live-player/ui/live-player-go-live";
import { LivePlayerPlayback } from "@/components/live-player/ui/live-player-playback";
import { LivePlayerProgress } from "@/components/live-player/ui/live-player-progress";
import { LivePlayerStartOver } from "@/components/live-player/ui/live-player-start-over";
import { PlayerErrorNotice } from "@/components/player/player-error-check";
import { PlayerEventListener } from "@/components/player/player-event-listener";
import {
  ControlsBottom,
  ControlsContainer,
  ControlsRow,
  ControlsSectionEnd,
  ControlsSectionStart,
  PlayerContainer,
} from "@/components/player/ui/player-controls.styles";
import { PlayerFullscreen } from "@/components/player/ui/player-fullscreen";
import { PlayerIdleCheck } from "@/components/player/ui/player-idle-check";
import { PlayerLoading } from "@/components/player/ui/player-loading";
import { PlayerQualityControl } from "@/components/player/ui/player-quality-control";
import { PlayerVolume } from "@/components/player/ui/player-volume";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePlayerStore } from "@/stores/player-store";
import { RefObject } from "react";

type LivePlayerProps = {
  url: string;
  messages?: {
    eventFinished: string;
    eventNotStarted: string;
    eventStartingSoon: string;
    live: string;
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const containerRef = usePlayerStore((s) => s.containerRef);

  return (
    <PlayerContainer ref={containerRef as RefObject<HTMLDivElement>}>
      <LivePlayerEventCheck
        url={url}
        eventFinishedMessage={messages?.eventFinished}
        eventNotStartedMessage={messages?.eventNotStarted}
        eventStartingSoonMessage={messages?.eventStartingSoon}
      >
        <LivePlayerTech url={url} />
        <PlayerErrorNotice />
        <PlayerLoading />
        <PlayerIdleCheck>
          {isDesktop ? <LivePlayerDesktopPlaybackIndicator /> : null}
          <ControlsBottom>
            <ControlsContainer>
              <LivePlayerProgress />
              <ControlsRow>
                <ControlsSectionStart>
                  <LivePlayerPlayback />
                  <LivePlayerStartOver />
                  <PlayerVolume />
                </ControlsSectionStart>
                <ControlsSectionEnd>
                  <LivePlayerGoLive message={messages?.live} />
                  <PlayerQualityControl />
                  <PlayerFullscreen />
                </ControlsSectionEnd>
              </ControlsRow>
            </ControlsContainer>
          </ControlsBottom>
        </PlayerIdleCheck>
      </LivePlayerEventCheck>
      <LivePlayerKeyboard />
      {onEvent && <PlayerEventListener callback={onEvent} />}
    </PlayerContainer>
  );
}

export { LivePlayer };
export type { LivePlayerProps };
