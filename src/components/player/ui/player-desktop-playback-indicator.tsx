import { usePlayerStore } from "@/stores/player-store";
import styled from "@emotion/styled";
import { ButtonHTMLAttributes, MouseEvent, useEffect, useRef } from "react";

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
    <ToggleButton
      onClick={handleToggle}
      className={className}
      aria-label="Player playback indicator"
      {...props}
    />
  );
}

const ToggleButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  cursor: default;
  align-items: center;
  justify-content: center;
  outline: none;
  background: none;
  border: none;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

export { PlayerDesktopPlaybackIndicator };
