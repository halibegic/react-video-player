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
import { VodPlayerPlayback } from "@/components/vod-player/vod-player-playback";
import { VodPlayerPlaybackIndicator } from "@/components/vod-player/vod-player-playback-indicator";
import { VodPlayerProgress } from "@/components/vod-player/vod-player-progress";
import { VodPlayerRemainingTime } from "@/components/vod-player/vod-player-remaining-time";
import { VodPlayerWatchHistory } from "@/components/vod-player/vod-player-watch-history";
import { usePlayerStore } from "@/stores/player-store";

type VodPlayerProps = {
  url: string;
  watchHistory?: {
    enabled: boolean;
    storageKey: string;
  };
};

function VodPlayer({ url, watchHistory }: VodPlayerProps) {
  return (
    <PlayerProvider>
      <Player url={url} />
      {watchHistory?.enabled && (
        <VodPlayerWatchHistory storageKey={watchHistory.storageKey} />
      )}
    </PlayerProvider>
  );
}

function Player({ url }: Pick<VodPlayerProps, "url">) {
  const containerRef = usePlayerStore((s) => s.containerRef);

  return (
    <PlayerContainer ref={containerRef}>
      <PlayerTech url={url} isLive={false} />
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
    </PlayerContainer>
  );
}

export { VodPlayer };
export type { VodPlayerProps };
