import { PlayerProvider } from "@/components/player/player-provider";
import { PlayerTech } from "@/components/player/player-tech";
import { PlayerFullscreen } from "@/components/player/ui/player-fullscreen";
import { PlayerLoading } from "@/components/player/ui/player-loading";
import { usePlayerStore } from "@/stores/player-store";
import styled from "styled-components";

type LivePlayerProps = {
  url: string;
};

function LivePlayer(props: LivePlayerProps) {
  return (
    <PlayerProvider>
      <Player {...props} />
    </PlayerProvider>
  );
}

function Player({ url }: LivePlayerProps) {
  const containerRef = usePlayerStore((s) => s.containerRef);

  return (
    <PlayerContainer ref={containerRef}>
      <PlayerTech url={url} isLive={true} />
      <PlayerLoading />
      <ControlsOverlay>
        <ControlsContainer>
          <ControlsRow>
            <ControlsSectionStart></ControlsSectionStart>
            <ControlsSectionCenter></ControlsSectionCenter>
            <ControlsSectionEnd>
              <PlayerFullscreen />
            </ControlsSectionEnd>
          </ControlsRow>
        </ControlsContainer>
      </ControlsOverlay>
    </PlayerContainer>
  );
}

const PlayerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
  overflow: hidden;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: 10;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding-top: 1rem;

  @media (min-width: 768px) {
    padding-top: 2rem;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  line-height: 1;
  font-size: 0;

  @media (min-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const ControlsRow = styled.div`
  margin: auto 0;
  display: flex;
  width: 100%;
  align-items: center;
`;

const ControlsSection = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const ControlsSectionStart = styled(ControlsSection)`
  justify-content: flex-start;
`;

const ControlsSectionCenter = styled(ControlsSection)`
  justify-content: center;
`;

const ControlsSectionEnd = styled(ControlsSection)`
  justify-content: flex-end;
`;

export { LivePlayer };
export type { LivePlayerProps };
