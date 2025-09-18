import {
  PlayerButton,
  PlayerButtonProps,
} from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";

type LivePlayerGoLiveProps = PlayerButtonProps & {
  message?: string;
};

function LivePlayerGoLive({ message, ...props }: LivePlayerGoLiveProps) {
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleLive = () => setDelay(0);

  return delay ? (
    <PlayerButton onClick={handleLive} shape="square" {...props}>
      {message || "Skip to live"}
    </PlayerButton>
  ) : null;
}

export { LivePlayerGoLive };
