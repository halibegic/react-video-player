import { PlayerPlaybackIndicator } from "@/components/player/ui/player-playback-indicator";
import { usePlayerStore } from "@/stores/player-store";

function LivePlayerPlaybackIndicator() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);

  const handleToggle = () => {
    if (!isPlaying) play();
  };

  return <PlayerPlaybackIndicator onClick={handleToggle} />;
}

export { LivePlayerPlaybackIndicator };
