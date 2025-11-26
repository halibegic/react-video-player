import { PlayerGestures } from "@/components/player/ui/player-gestures";
import { usePlayerStore } from "@/stores/player-store";

function VodPlayerGestures() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const play = usePlayerStore((s) => s.play);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const seek = usePlayerStore((s) => s.seek);

  return (
    <PlayerGestures
      onClick={() => {
        if (isPlaying) pause();
        else play();
      }}
      onBackwardSeek={(seekAmount: number) => {
        const newTime = Math.max(0, currentTime - seekAmount);
        seek(newTime);
      }}
      onForwardSeek={(seekAmount: number) => {
        const newTime = Math.min(currentTime + seekAmount, duration);
        seek(newTime);
      }}
      maxBackwardTime={Math.floor(currentTime)}
      maxForwardTime={Math.floor(duration - currentTime)}
    />
  );
}

export { VodPlayerGestures };
