import { PauseIcon } from "@/components/player/ui/icons/pause-icon";
import { PlayIcon } from "@/components/player/ui/icons/play-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { usePlayerStore } from "@/stores/player-store";

function VodPlayerPlayback() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const play = usePlayerStore((s) => s.play);

  const handleToggle = () => {
    if (isPlaying) pause();
    else play();
  };

  return (
    <PlayerButton onClick={handleToggle}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </PlayerButton>
  );
}

export { VodPlayerPlayback };
