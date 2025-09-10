import { usePlayerStore } from "@/stores/player-store";
import styled from "@emotion/styled";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const HideTimeout = 5 * 1000;

function PlayerIdleCheck({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState<boolean>(false);
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

  return (
    <IdleCheckContainer ref={containerRef} $isIdle={isIdle && !isLocked}>
      {children}
    </IdleCheckContainer>
  );
}

const IdleCheckContainer = styled.div<{ $isIdle: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  cursor: ${({ $isIdle }) => ($isIdle ? "none" : "auto")};
  opacity: ${({ $isIdle }) => ($isIdle ? 0 : 1)};
`;

export { PlayerIdleCheck };
