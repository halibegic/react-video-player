import { PlayerGestures } from "@/components/player/ui/player-gestures";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";

function LivePlayerGestures() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const getPauseTimeDiff = usePlayerStore((s) => s.getPauseTimeDiff);
  const play = usePlayerStore((s) => s.play);
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);
  const startDate = useLivePlayerStore((s) => s.startDate);
  const startTime = startDate ? startDate.getTime() : 0;

  return (
    <PlayerGestures
      onClick={() => {
        if (isPlaying) {
          pause();
        } else {
          const pauseTimeDiff = getPauseTimeDiff();
          if (pauseTimeDiff) setDelay(delay + pauseTimeDiff);

          play();
        }
      }}
      onBackwardSeek={(seekAmount: number) => {
        const newDelay = delay + seekAmount;
        setDelay(newDelay);
      }}
      onForwardSeek={(seekAmount: number) => {
        const newDelay = Math.max(0, delay - seekAmount);
        setDelay(newDelay);
      }}
      maxBackwardTime={Math.floor(startTime)}
      maxForwardTime={Math.floor(delay)}
    />
  );
}

export { LivePlayerGestures };
