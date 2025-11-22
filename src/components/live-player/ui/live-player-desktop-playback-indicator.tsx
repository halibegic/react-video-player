import { PlayerDesktopPlaybackIndicator } from "@/components/player/ui/player-desktop-playback-indicator";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";

function LivePlayerDesktopPlaybackIndicator() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const getPauseTimeDiff = usePlayerStore((s) => s.getPauseTimeDiff);
  const play = usePlayerStore((s) => s.play);
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      const pauseTimeDiff = getPauseTimeDiff();
      if (pauseTimeDiff) setDelay(delay + pauseTimeDiff);

      play();
    }
  };

  return <PlayerDesktopPlaybackIndicator onClick={handleToggle} />;
}

export { LivePlayerDesktopPlaybackIndicator };
