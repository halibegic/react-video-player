import { PlayerDesktopPlaybackIndicator } from "@/components/player/ui/player-desktop-playback-indicator";
import { usePlayerStore } from "@/stores/player-store";

function VodPlayerDesktopPlaybackIndicator() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const play = usePlayerStore((s) => s.play);

  const handleToggle = () => {
    if (isPlaying) pause();
    else play();
  };

  return <PlayerDesktopPlaybackIndicator onClick={handleToggle} />;
}

export { VodPlayerDesktopPlaybackIndicator };
