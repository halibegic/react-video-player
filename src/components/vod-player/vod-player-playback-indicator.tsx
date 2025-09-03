import { PlayerPlaybackIndicator } from "@/components/player/ui/player-playback-indicator";
import { usePlayerStore } from "@/stores/player-store";

function VodPlayerPlaybackIndicator() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const play = usePlayerStore((s) => s.play);

  const handleToggle = () => {
    if (isPlaying) pause();
    else play();
  };

  return <PlayerPlaybackIndicator onClick={handleToggle} />;
}

export { VodPlayerPlaybackIndicator };
