import { PlayerErrorNotice } from "@/components/player/player-error-check";
import { PlayerEventListener } from "@/components/player/player-event-listener";
import { PlayerProvider } from "@/components/player/player-provider";
import { PlayerTech } from "@/components/player/player-tech";
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
import { VodPlayerPlayback } from "@/components/vod-player/ui/vod-player-playback";
import { VodPlayerPlaybackIndicator } from "@/components/vod-player/ui/vod-player-playback-indicator";
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
    <PlayerContainer ref={containerRef as RefObject<HTMLDivElement>}>
      <PlayerTech url={url} isLive={false} />
      <PlayerErrorNotice />
      <PlayerLoading />
      <PlayerIdleCheck>
        <VodPlayerPlaybackIndicator />
        <ControlsBottom>
          <ControlsContainer>
            <VodPlayerProgress />
            <ControlsRow>
              <ControlsSectionStart>
                <VodPlayerPlayback />
                <PlayerVolume />
                <VodPlayerRemainingTime />
              </ControlsSectionStart>
              <ControlsSectionEnd>
                <PlayerQualityControl />
                <PlayerFullscreen />
              </ControlsSectionEnd>
            </ControlsRow>
          </ControlsContainer>
        </ControlsBottom>
      </PlayerIdleCheck>
      <VodPlayerKeyboard />
      {onEvent && <PlayerEventListener callback={onEvent} />}
    </PlayerContainer>
  );
}

export { VodPlayer };
export type { VodPlayerProps };
