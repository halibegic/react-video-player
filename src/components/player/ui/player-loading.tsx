import { PlayerSpinner } from "@/components/player/ui/player-spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { usePlayerStore } from "@/stores/player-store";
import type { HTMLAttributes } from "react";
import styled from "styled-components";

type PlayerLoadingProps = HTMLAttributes<HTMLDivElement>;

function PlayerLoading({ style, ...props }: PlayerLoadingProps) {
  const isLoading = usePlayerStore((s) => s.isLoading);
  const isVisible = useDebounce(isLoading, 100);

  return isVisible ? (
    <LoadingContainer style={style} {...props}>
      <PlayerSpinner />
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

export { PlayerLoading };
