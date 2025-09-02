import { useDebounce } from "@/components/hooks/use-debounce";
import { usePlayerStore } from "@/stores/player-store";
import type { HTMLAttributes } from "react";
import styled, { keyframes } from "styled-components";

type PlayerLoadingProps = HTMLAttributes<HTMLDivElement>;

function PlayerLoading({ style, ...props }: PlayerLoadingProps) {
  const isLoading = usePlayerStore((s) => s.isLoading);
  const isVisible = useDebounce(isLoading, 50);

  return isVisible ? (
    <LoadingContainer style={style} {...props}>
      <Spinner />
    </LoadingContainer>
  ) : null;
}

const LoadingContainer = styled.div<PlayerLoadingProps>`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const spinKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

export { PlayerLoading };
