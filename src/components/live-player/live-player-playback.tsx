import { PauseIcon } from "@/components/icons/pause-icon";
import { PlayIcon } from "@/components/icons/play-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";

function LivePlayerPlayback() {
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

  return (
    <PlayerButton onClick={handleToggle}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </PlayerButton>
  );
}

export { LivePlayerPlayback };
