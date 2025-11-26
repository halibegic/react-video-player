import { usePlayerStore } from "@/stores/player-store";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import styles from "./player-idle-check.module.css";

const HideTimeout = 5 * 1000;

function PlayerIdleCheck({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isIdle = usePlayerStore((s) => s.isIdle);
  const setIsIdle = usePlayerStore((s) => s.setIsIdle);
  const timerRef = useRef<number | null>(null);
  const idleLocks = usePlayerStore((s) => s.idleLocks);
  const isLocked = idleLocks.size;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    timerRef.current = window.setTimeout(() => setIsIdle(true), HideTimeout);
  }, [clearTimer]);

  useEffect(() => {
    setIsIdle(false);

    startTimer();

    return () => {
      clearTimer();
    };
  }, [clearTimer, startTimer]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const handleClick = (event: MouseEvent) => {
      if (isIdle) {
        event.stopPropagation();

        setIsIdle(false);

        startTimer();
      }
    };

    const handleMove = () => {
      if (isIdle) setIsIdle(false);

      startTimer();
    };

    element.addEventListener("click", handleClick);
    element.addEventListener("mousemove", handleMove);

    return () => {
      element.removeEventListener("click", handleClick);
      element.removeEventListener("mousemove", handleMove);
    };
  }, [containerRef, isIdle, setIsIdle, startTimer]);

  const isIdleState = isIdle && !isLocked;
  const containerClassName = `${styles.idleCheckContainer} ${
    isIdleState
      ? styles.idleCheckContainerIdle
      : styles.idleCheckContainerActive
  }`;

  return (
    <div ref={containerRef} className={containerClassName}>
      {children}
    </div>
  );
}

export { PlayerIdleCheck };
