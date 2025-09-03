import { ArrowRightIcon } from "@/components/player/ui/icons/arrow-right-icon";
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
      <span>{message || "Live"}</span>
      <ArrowRightIcon />
    </PlayerButton>
  ) : null;
}

export { LivePlayerGoLive };
