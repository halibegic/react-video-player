import { LivePlayerEventCheck } from "@/components/live-player/live-player-event-check";
import { LivePlayerGoLive } from "@/components/live-player/live-player-go-live";
import { LivePlayerPlayback } from "@/components/live-player/live-player-playback";
import { LivePlayerPlaybackIndicator } from "@/components/live-player/live-player-playback-indicator";
import { LivePlayerProgress } from "@/components/live-player/live-player-progress";
import { LivePlayerProvider } from "@/components/live-player/live-player-provider";
import { LivePlayerRemainingTime } from "@/components/live-player/live-player-remaining-time";
import { LivePlayerTech } from "@/components/live-player/live-player-tech";
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
import { usePlayerStore } from "@/stores/player-store";
import { RefObject } from "react";

type LivePlayerProps = {
  url: string;
  startDate: Date | string;
  endDate: Date | string;
  messages?: {
    eventFinished: string;
    eventNotStarted: string;
    eventStartingSoon: string;
    live: string;
  };
};

function LivePlayer({ url, startDate, endDate, messages }: LivePlayerProps) {
  return (
    <LivePlayerProvider
      startDate={new Date(startDate)}
      endDate={new Date(endDate)}
    >
      <Player url={url} messages={messages} />
    </LivePlayerProvider>
  );
}

function Player({ url, messages }: Pick<LivePlayerProps, "url" | "messages">) {
  const containerRef = usePlayerStore((s) => s.containerRef);

  return (
    <PlayerContainer ref={containerRef as RefObject<HTMLDivElement>}>
      <LivePlayerEventCheck
        eventFinishedMessage={messages?.eventFinished}
        eventNotStartedMessage={messages?.eventNotStarted}
        eventStartingSoonMessage={messages?.eventStartingSoon}
      >
        <LivePlayerTech url={url} />
        <PlayerLoading />
        <PlayerIdleCheck>
          <LivePlayerPlaybackIndicator />
          <ControlsBottom>
            <ControlsContainer>
              <LivePlayerProgress />
              <ControlsRow>
                <ControlsSectionStart>
                  <LivePlayerPlayback />
                  <PlayerVolume />
                  <LivePlayerRemainingTime />
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
    </PlayerContainer>
  );
}

export { LivePlayer };
export type { LivePlayerProps };
