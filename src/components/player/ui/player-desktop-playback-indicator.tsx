import { usePlayerStore } from "@/stores/player-store";
import { ButtonHTMLAttributes, MouseEvent, useEffect, useRef } from "react";
import styles from "./player-desktop-playback-indicator.module.css";

type PlayerDesktopPlaybackIndicatorProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

function PlayerDesktopPlaybackIndicator({
  className,
  onClick,
  ...props
}: PlayerDesktopPlaybackIndicatorProps) {
  const toggleTimerRef = useRef<number | null>(null);
  const exitFullscreen = usePlayerStore((s) => s.exitFullscreen);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const requestFullscreen = usePlayerStore((s) => s.requestFullscreen);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (isToggleTimerActive()) {
      clearToggleTimer();
      if (isFullscreen) exitFullscreen();
      else requestFullscreen();
    } else {
      startToggleTimer(event);
    }
  };

  const startToggleTimer = (event: MouseEvent<HTMLButtonElement>) => {
    toggleTimerRef.current = window.setTimeout(() => {
      onClick?.(event);
      clearToggleTimer();
    }, 200);
  };

  const clearToggleTimer = () => {
    if (toggleTimerRef.current !== null) {
      window.clearTimeout(toggleTimerRef.current);
      toggleTimerRef.current = null;
    }
  };

  const isToggleTimerActive = () => toggleTimerRef.current !== null;

  useEffect(() => {
    return () => {
      clearToggleTimer();
    };
  }, []);

  return (
    <button
      onClick={handleToggle}
      className={[styles.toggleButton, className].filter(Boolean).join(" ")}
      aria-label="Player playback indicator"
      {...props}
    />
  );
}

export { PlayerDesktopPlaybackIndicator };
