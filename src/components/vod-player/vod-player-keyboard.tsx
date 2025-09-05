import { PlayerKeyboard } from "@/components/player/player-keyboard";
import { usePlayerStore } from "@/stores/player-store";
import { useCallback, useEffect } from "react";

function VodPlayerKeyboard() {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const play = usePlayerStore((s) => s.play);
  const seek = usePlayerStore((s) => s.seek);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      let handled = false;

      if (event.target instanceof HTMLInputElement || event.ctrlKey) return;

      switch (event.code) {
        case "ArrowLeft": // backward
          seek(currentTime - 10 >= 0 ? currentTime - 10 : 0);
          handled = true;
          break;

        case "ArrowRight": // forward
          seek(currentTime + 10 < duration ? currentTime + 10 : duration);
          handled = true;
          break;

        case "Space": // toggle play/pause
          if (isPlaying) pause();
          else play();
          handled = true;
          break;
      }

      if (handled) event.preventDefault();
    },
    [currentTime, duration, isPlaying, pause, play, seek]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return <PlayerKeyboard />;
}

export { VodPlayerKeyboard };
