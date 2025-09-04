import { PlayerPlaybackIndicator } from "@/components/player/ui/player-playback-indicator";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";

function LivePlayerPlaybackIndicator() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const pauseTime = usePlayerStore((s) => s.pauseTime);
  const pauseTimeDiff = usePlayerStore((s) => s.pauseTimeDiff);
  const play = usePlayerStore((s) => s.play);
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      if (pauseTime) setDelay(delay + pauseTimeDiff());

      play();
    }
  };

  return <PlayerPlaybackIndicator onClick={handleToggle} />;
}

export { LivePlayerPlaybackIndicator };
