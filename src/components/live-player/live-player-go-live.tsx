import {
  PlayerButton,
  PlayerButtonProps,
} from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";
import styled from "@emotion/styled";

type LivePlayerGoLiveProps = PlayerButtonProps & {
  message?: string;
};

function LivePlayerGoLive({ message, ...props }: LivePlayerGoLiveProps) {
  const delay = useLivePlayerStore((s) => s.delay);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleLive = () => {
    if (!delay) return;
    setDelay(0);
  };

  return (
    <PlayerButton onClick={handleLive} shape="square" {...props}>
      <LiveIndicator $hasDelay={!!delay} />
      {message || "Live"}
    </PlayerButton>
  );
}

const LiveIndicator = styled.div<{ $hasDelay: boolean }>`
  width: 0.4rem;
  height: 0.4rem;
  background: ${({ $hasDelay }) => ($hasDelay ? "gray" : "red")};
  border-radius: 0.2rem;
  transition: background 0.2s ease;
`;

export { LivePlayerGoLive };
