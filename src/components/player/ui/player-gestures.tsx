import { useMediaQuery } from "@/hooks/use-media-query";
import { usePlayerStore } from "@/stores/player-store";
import {
  ButtonHTMLAttributes,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./player-gestures.module.css";

const SEEK_INCREMENT = 10;
const ACCUMULATION_TIMEOUT = 500;

type PlayerGesturesProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  maxForwardTime?: number;
  maxBackwardTime?: number;
  onForwardSeek?: (time: number) => void;
  onBackwardSeek?: (time: number) => void;
};

function PlayerGestures({
  className,
  onClick,
  onForwardSeek,
  onBackwardSeek,
  maxForwardTime,
  maxBackwardTime,
  ...props
}: PlayerGesturesProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const toggleTimerRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ time: number; x: number } | null>(null);
  const preventClickRef = useRef<boolean>(false);
  const preventClickTimeoutRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const indicatorTimeoutRef = useRef<number | null>(null);
  const accumulationTimeoutRef = useRef<number | null>(null);
  const accumulatedSeekRef = useRef<number>(0);
  const seekDirectionRef = useRef<"forward" | "backward" | null>(null);
  const [seekIndicator, setSeekIndicator] = useState<{
    visible: boolean;
    text: string;
  }>({ visible: false, text: "" });
  const exitFullscreen = usePlayerStore((s) => s.exitFullscreen);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const requestFullscreen = usePlayerStore((s) => s.requestFullscreen);

  // Desktop: single click = play/pause, double click = fullscreen
  // Mobile: single tap = nothing, double tap = seek
  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    // On mobile, prevent clicks from touch events
    if (!isDesktop && preventClickRef.current) {
      return;
    }

    // Desktop: handle double click for fullscreen
    if (isDesktop) {
      if (isToggleTimerActive()) {
        clearToggleTimer();
        if (isFullscreen) exitFullscreen();
        else requestFullscreen();
      } else {
        startToggleTimer(event);
      }
    }
  };

  const handleTouchStart = () => {
    // On mobile, prevent click events from firing after touch
    if (!isDesktop) {
      preventClickRef.current = true;
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    // Only handle touch on mobile
    if (isDesktop || !buttonRef.current) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const now = Date.now();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tapX = touch.clientX - buttonRect.left;
    const tapY = touch.clientY - buttonRect.top;

    // Check if tap is within button bounds
    if (
      tapX < 0 ||
      tapX > buttonRect.width ||
      tapY < 0 ||
      tapY > buttonRect.height
    ) {
      return;
    }

    const lastTap = lastTapRef.current;
    const isDoubleTap =
      lastTap &&
      now - lastTap.time < 300 && // 300ms window for double tap
      Math.abs(tapX - lastTap.x) < 50; // Allow some horizontal movement

    if (isDoubleTap) {
      event.preventDefault();
      event.stopPropagation();

      // Prevent click event from firing
      preventClickRef.current = true;
      if (preventClickTimeoutRef.current) {
        window.clearTimeout(preventClickTimeoutRef.current);
      }
      preventClickTimeoutRef.current = window.setTimeout(() => {
        preventClickRef.current = false;
        preventClickTimeoutRef.current = null;
      }, 400);

      // Mobile: double tap accumulates seek
      const buttonCenter = buttonRect.width / 2;
      const isBackward = tapX < buttonCenter;

      // Check if this is a new seek direction or continuing
      if (
        seekDirectionRef.current === null ||
        seekDirectionRef.current !== (isBackward ? "backward" : "forward")
      ) {
        // New direction - reset accumulation
        accumulatedSeekRef.current = 0;
        seekDirectionRef.current = isBackward ? "backward" : "forward";
      }

      // Increment accumulated seek value
      const maxTime = isBackward ? maxBackwardTime : maxForwardTime;
      accumulatedSeekRef.current = Math.min(
        accumulatedSeekRef.current + SEEK_INCREMENT,
        maxTime ?? Infinity
      );

      // Show indicator with accumulated value
      const indicatorText = isBackward
        ? `-${accumulatedSeekRef.current}s`
        : `+${accumulatedSeekRef.current}s`;
      showSeekIndicator(indicatorText);

      // Clear existing accumulation timeout
      if (accumulationTimeoutRef.current) {
        window.clearTimeout(accumulationTimeoutRef.current);
      }

      // Set new timeout to trigger seek after user stops tapping
      accumulationTimeoutRef.current = window.setTimeout(() => {
        const accumulatedTime = accumulatedSeekRef.current;
        if (accumulatedTime > 0) {
          if (seekDirectionRef.current === "backward") {
            onBackwardSeek?.(accumulatedTime);
          } else {
            onForwardSeek?.(accumulatedTime);
          }
          // Reset accumulation
          accumulatedSeekRef.current = 0;
          seekDirectionRef.current = null;
          // Hide indicator
          setSeekIndicator({ visible: false, text: "" });
          if (indicatorTimeoutRef.current) {
            window.clearTimeout(indicatorTimeoutRef.current);
            indicatorTimeoutRef.current = null;
          }
        }
        accumulationTimeoutRef.current = null;
      }, ACCUMULATION_TIMEOUT);

      lastTapRef.current = null;
    } else {
      // First tap - record it and prevent click for a short time
      lastTapRef.current = { time: now, x: tapX };

      // Keep preventing click until we know if it's a double tap
      preventClickRef.current = true;
      if (preventClickTimeoutRef.current) {
        window.clearTimeout(preventClickTimeoutRef.current);
      }
      preventClickTimeoutRef.current = window.setTimeout(() => {
        // If no second tap, allow clicks again after timeout
        preventClickRef.current = false;
        preventClickTimeoutRef.current = null;
        lastTapRef.current = null;
      }, 350); // Slightly longer than double tap window
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

  const showSeekIndicator = (text: string) => {
    setSeekIndicator({ visible: true, text });

    // Clear any existing timeout
    if (indicatorTimeoutRef.current) {
      window.clearTimeout(indicatorTimeoutRef.current);
    }

    // Hide indicator after accumulation timeout plus a small buffer
    // This ensures it stays visible while user is tapping
    indicatorTimeoutRef.current = window.setTimeout(() => {
      setSeekIndicator({ visible: false, text: "" });
      indicatorTimeoutRef.current = null;
    }, ACCUMULATION_TIMEOUT + 200);
  };

  useEffect(() => {
    return () => {
      clearToggleTimer();
      if (preventClickTimeoutRef.current) {
        window.clearTimeout(preventClickTimeoutRef.current);
      }
      if (indicatorTimeoutRef.current) {
        window.clearTimeout(indicatorTimeoutRef.current);
      }
      if (accumulationTimeoutRef.current) {
        window.clearTimeout(accumulationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={[styles.toggleButton, className].filter(Boolean).join(" ")}
        aria-label="Player gestures"
        {...props}
      />
      {seekIndicator.visible && (
        <div
          className={`${styles.seekIndicator} ${
            seekIndicator.visible ? styles.seekIndicatorVisible : ""
          } ${
            seekIndicator.text.startsWith("-")
              ? styles.seekIndicatorLeft
              : styles.seekIndicatorRight
          }`}
        >
          {seekIndicator.text}
        </div>
      )}
    </>
  );
}

export { PlayerGestures };
