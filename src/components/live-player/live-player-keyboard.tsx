"use client";

import { PlayerKeyboard } from "@/components/player/player-keyboard";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { useCallback, useEffect } from "react";

function LivePlayerKeyboard() {
  const delay = useLivePlayerStore((s) => s.delay);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);
  const getPauseTimeDiff = usePlayerStore((s) => s.getPauseTimeDiff);
  const play = usePlayerStore((s) => s.play);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      let handled = false;

      if (event.target instanceof HTMLInputElement || event.ctrlKey) return;

      switch (event.code) {
        case "ArrowLeft": // backward
          setDelay(delay + 10);
          handled = true;
          break;

        case "ArrowRight": // forward
          setDelay(delay - 10 > 0 ? delay - 10 : 0);
          handled = true;
          break;

        case "Space": // toggle play/pause
          if (isPlaying) {
            pause();
          } else {
            const pauseTimeDiff = getPauseTimeDiff();
            if (pauseTimeDiff) setDelay(delay + pauseTimeDiff);

            play();
          }
          handled = true;
          break;
      }

      if (handled) event.preventDefault();
    },
    [delay, getPauseTimeDiff, isPlaying, pause, play, setDelay]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return <PlayerKeyboard />;
}

export { LivePlayerKeyboard };
