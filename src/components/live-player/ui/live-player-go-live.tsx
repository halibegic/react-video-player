import {
  PlayerButton,
  PlayerButtonProps,
} from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";
import styles from "./live-player-go-live.module.css";

type LivePlayerGoLiveProps = PlayerButtonProps & {
  message?: string;
};

function LivePlayerGoLive({ message, ...props }: LivePlayerGoLiveProps) {
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleLive = () => {
    if (!delay) return;
    setDelay(0);
  };

  const indicatorClassName = delay
    ? `${styles.liveIndicator} ${styles.liveIndicatorHasDelay}`
    : `${styles.liveIndicator} ${styles.liveIndicatorNoDelay}`;

  return (
    <PlayerButton onClick={handleLive} shape="square" {...props}>
      <div className={indicatorClassName} />
      {message || "Live"}
    </PlayerButton>
  );
}

export { LivePlayerGoLive };
