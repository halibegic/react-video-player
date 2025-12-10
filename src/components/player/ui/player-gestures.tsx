import { useMediaQuery } from "@/hooks/use-media-query";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";
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
  const isTouch = useMediaQuery("(pointer: coarse)");

  if (!isTouch) {
    return (
      <DesktopGesture className={className} onClick={onClick} {...props} />
    );
  }

  return (
    <MobileGesture
      className={className}
      maxForwardTime={maxForwardTime}
      maxBackwardTime={maxBackwardTime}
      onForwardSeek={onForwardSeek}
      onBackwardSeek={onBackwardSeek}
      {...props}
    />
  );
}

type DesktopGestureProps = Pick<PlayerGesturesProps, "onClick" | "className"> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

function DesktopGesture({ className, onClick, ...props }: DesktopGestureProps) {
  const doubleClickTimerRef = useRef<number | null>(null);
  const exitFullscreen = usePlayerStore((s) => s.exitFullscreen);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const requestFullscreen = usePlayerStore((s) => s.requestFullscreen);
  const resetIdle = usePlayerStore((s) => s.resetIdle);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDoubleClickTimerActive()) {
      clearDoubleClickTimer();
      if (isFullscreen) exitFullscreen();
      else requestFullscreen();
    } else {
      startDoubleClickTimer(event);
    }
  };

  const startDoubleClickTimer = (event: MouseEvent<HTMLButtonElement>) => {
    doubleClickTimerRef.current = window.setTimeout(() => {
      onClick?.(event);
      clearDoubleClickTimer();
    }, 200);
  };

  const clearDoubleClickTimer = () => {
    if (doubleClickTimerRef.current !== null) {
      window.clearTimeout(doubleClickTimerRef.current);
      doubleClickTimerRef.current = null;
    }
  };

  const isDoubleClickTimerActive = () => doubleClickTimerRef.current !== null;

  const handleMouseMove = () => {
    resetIdle();
  };

  useEffect(() => {
    return () => {
      clearDoubleClickTimer();
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className={[styles.playbackButton, className].filter(Boolean).join(" ")}
      aria-label="Player gestures"
      {...props}
    />
  );
}

type MobileGestureProps = Pick<
  PlayerGesturesProps,
  | "maxForwardTime"
  | "maxBackwardTime"
  | "onForwardSeek"
  | "onBackwardSeek"
  | "className"
> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

function MobileGesture({
  className,
  maxForwardTime,
  maxBackwardTime,
  onForwardSeek,
  onBackwardSeek,
  ...props
}: MobileGestureProps) {
  const lastTapRef = useRef<{ time: number; x: number } | null>(null);
  const timersRef = useRef<{
    single: number | null;
    indicator: number | null;
    accumulate: number | null;
  }>({
    single: null,
    indicator: null,
    accumulate: null,
  });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const accumulatedSeekRef = useRef<number>(0);
  const seekDirectionRef = useRef<"forward" | "backward" | null>(null);
  const [seekIndicator, setSeekIndicator] = useState<{
    visible: boolean;
    direction: "forward" | "backward" | null;
    time: number;
  }>({ visible: false, direction: null, time: 0 });
  const isIdle = usePlayerStore((s) => s.isIdle);
  const setIsIdle = usePlayerStore((s) => s.setIsIdle);
  const resetIdle = usePlayerStore((s) => s.resetIdle);

  const getDirection = (
    tapX: number,
    rectWidth: number
  ): "forward" | "backward" => (tapX < rectWidth / 2 ? "backward" : "forward");

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

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
    const timeSinceLastTap = lastTap ? now - lastTap.time : Infinity;

    // Check if we're already accumulating in this direction
    const direction = getDirection(tapX, buttonRect.width);
    const isContinuingAccumulation =
      seekDirectionRef.current !== null &&
      seekDirectionRef.current === direction &&
      lastTap !== null &&
      timeSinceLastTap < 700 &&
      Math.abs(tapX - lastTap.x) < 100; // More lenient position check for continued taps

    // Check if this is an initial double tap
    const isInitialDoubleTap =
      lastTap !== null &&
      seekDirectionRef.current === null &&
      timeSinceLastTap < 300 &&
      Math.abs(tapX - lastTap.x) < 50;

    // Double tap / accumulation logic
    if (isInitialDoubleTap || isContinuingAccumulation) {
      event.preventDefault();
      event.stopPropagation();

      // Clear single tap timeout since this is a double tap
      if (timersRef.current.single) {
        window.clearTimeout(timersRef.current.single);
        timersRef.current.single = null;
      }

      // Reset idle timer to prevent controls from hiding while tapping
      resetIdle();

      // Check if this is a new seek direction or continuing
      if (
        seekDirectionRef.current === null ||
        seekDirectionRef.current !== direction
      ) {
        // New direction - reset accumulation
        accumulatedSeekRef.current = 0;
        seekDirectionRef.current = direction;
      }

      // Increment accumulated seek value
      const maxTime =
        direction === "backward" ? maxBackwardTime : maxForwardTime;
      accumulatedSeekRef.current = Math.min(
        accumulatedSeekRef.current + SEEK_INCREMENT,
        maxTime ?? Infinity
      );

      // Show indicator with accumulated value
      showSeekIndicator(direction, accumulatedSeekRef.current);

      // Clear existing accumulation timeout
      if (timersRef.current.accumulate) {
        window.clearTimeout(timersRef.current.accumulate);
      }

      // Set new timeout to trigger seek after user stops tapping
      timersRef.current.accumulate = window.setTimeout(() => {
        const accumulatedTime = accumulatedSeekRef.current;
        if (accumulatedTime > 0) {
          if (seekDirectionRef.current === "backward") {
            onBackwardSeek?.(accumulatedTime);
          } else {
            onForwardSeek?.(accumulatedTime);
          }
          // Reset idle timer after seek completes
          resetIdle();
        }
        // Always reset accumulation state (even if accumulatedTime is 0)
        // to prevent the state machine from getting stuck
        accumulatedSeekRef.current = 0;
        seekDirectionRef.current = null;
        lastTapRef.current = null;
        // Hide indicator
        hideSeekIndicator();
        timersRef.current.accumulate = null;
      }, 500);

      // Keep the last tap info for continued accumulation
      lastTapRef.current = { time: now, x: tapX };
    } else {
      // Single tap logic
      // First tap - record it and wait to see if it's a double tap
      lastTapRef.current = { time: now, x: tapX };

      // Clear existing single tap timeout
      if (timersRef.current.single) {
        window.clearTimeout(timersRef.current.single);
      }

      // Wait to see if this is a double tap
      // Use shorter timeout if we're already accumulating, otherwise wait for initial double tap
      const timeout = seekDirectionRef.current !== null ? 700 : 350;

      timersRef.current.single = window.setTimeout(() => {
        // If no second tap, this was a single tap - toggle idle state
        // But only if we're not already accumulating
        if (seekDirectionRef.current === null) {
          timersRef.current.single = null;

          // Single tap: toggle idle state to show/hide controls
          const currentIsIdle = isIdle;
          setIsIdle(!currentIsIdle);

          // If we're showing controls (was idle, now not idle), reset the timer
          if (currentIsIdle) {
            resetIdle();
          }
        }

        lastTapRef.current = null;
      }, timeout);
    }
  };

  const showSeekIndicator = (
    direction: "forward" | "backward",
    time: number
  ) => {
    // Don't show indicator if time is 0
    if (time === 0) return;

    setSeekIndicator({ visible: true, direction, time });

    // Clear any existing timeout
    if (timersRef.current.indicator) {
      window.clearTimeout(timersRef.current.indicator);
    }

    // Hide indicator after accumulation timeout plus a small buffer
    // This ensures it stays visible while user is tapping
    timersRef.current.indicator = window.setTimeout(() => {
      hideSeekIndicator();
    }, 700);
  };

  const hideSeekIndicator = () => {
    setSeekIndicator({ visible: false, direction: null, time: 0 });
    if (timersRef.current.indicator) {
      window.clearTimeout(timersRef.current.indicator);
      timersRef.current.indicator = null;
    }
  };

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      if (timers?.single) {
        window.clearTimeout(timers.single);
      }
      if (timers?.indicator) {
        window.clearTimeout(timers.indicator);
      }
      if (timers?.accumulate) {
        window.clearTimeout(timers.accumulate);
      }
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onTouchEnd={handleTouchEnd}
        className={[styles.playbackButton, className].filter(Boolean).join(" ")}
        aria-label="Player gestures"
        {...props}
      />
      {seekIndicator.visible && (
        <div
          className={`${styles.seekIndicator} ${styles.seekIndicatorVisible} ${
            seekIndicator.direction === "backward"
              ? styles.seekIndicatorLeft
              : styles.seekIndicatorRight
          }`}
        >
          {seekIndicator.direction === "backward" ? "-" : "+"}
          {formatTime(seekIndicator.time)}
        </div>
      )}
    </>
  );
}

export { PlayerGestures };
