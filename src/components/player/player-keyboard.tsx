import { usePlayerStore } from "@/stores/player-store";
import { useCallback, useEffect } from "react";

function PlayerKeyboard() {
  const exitFullscreen = usePlayerStore((s) => s.exitFullscreen);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const isFullscreenReady = usePlayerStore((s) => s.isFullscreenReady);
  const requestFullscreen = usePlayerStore((s) => s.requestFullscreen);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const volume = usePlayerStore((s) => s.volume);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      let handled = false;

      if (event.target instanceof HTMLInputElement || event.ctrlKey) return;

      switch (event.code) {
        case "ArrowUp": // volume up
          setVolume(volume + 10 < 100 ? volume + 10 : 100);
          handled = true;
          break;

        case "ArrowDown": // volume down
          setVolume(volume - 10 > 0 ? volume - 10 : 0);
          handled = true;
          break;

        case "KeyM": // mute
          setVolume(volume === 0 ? 100 : 0);
          handled = true;
          break;

        case "KeyF": // toggle fullscreen
          if (isFullscreenReady) {
            if (isFullscreen) exitFullscreen();
            else requestFullscreen();
            handled = true;
          }
          break;
      }

      if (handled) event.preventDefault();
    },
    [
      exitFullscreen,
      isFullscreen,
      isFullscreenReady,
      requestFullscreen,
      setVolume,
      volume,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return null;
}

export { PlayerKeyboard };
