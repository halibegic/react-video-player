import { LivePlayerEventCheck } from "@/components/live-player/live-player-event-check";
import { LivePlayerGoLive } from "@/components/live-player/live-player-go-live";
import { LivePlayerKeyboard } from "@/components/live-player/live-player-keyboard";
import { LivePlayerPlayback } from "@/components/live-player/live-player-playback";
import { LivePlayerPlaybackIndicator } from "@/components/live-player/live-player-playback-indicator";
import { LivePlayerProgress } from "@/components/live-player/live-player-progress";
import { LivePlayerProvider } from "@/components/live-player/live-player-provider";
import { LivePlayerStartOver } from "@/components/live-player/live-player-start-over";
import { LivePlayerTech } from "@/components/live-player/live-player-tech";
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
import { usePlayerStore } from "@/stores/player-store";
import { getStartDateFromHlsUrl } from "@/utils/hls-parser";
import { RefObject, useEffect, useState } from "react";

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

function LivePlayer({ url, messages, onEvent }: LivePlayerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStartDate = async () => {
      try {
        const detectedStartDate = await getStartDateFromHlsUrl(url);

        if (detectedStartDate) setStartDate(detectedStartDate);
      } catch (error) {
        console.error("Failed to detect start time from URL:", error);
      }
    };

    fetchStartDate();
  }, [url]);

  if (!startDate) return null;

  return (
    <LivePlayerProvider startDate={startDate}>
      <Player url={url} messages={messages} onEvent={onEvent} />
    </LivePlayerProvider>
  );
}

function Player({
  url,
  messages,
  onEvent,
}: Pick<LivePlayerProps, "url" | "messages" | "onEvent">) {
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
