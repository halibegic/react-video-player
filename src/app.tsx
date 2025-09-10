import { LivePlayer } from "@/components/live-player";
import { VodPlayer } from "@/components/vod-player";
import styled from "@emotion/styled";

function App() {
  return (
    <AppContainer>
      <Title>Vod Player</Title>
      <PlayerContainer>
        <VodPlayer url="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8" />
      </PlayerContainer>
      <Title>Live Player</Title>
      <PlayerContainer>
        <LivePlayer
          url="https://storage.googleapis.com/shaka-live-assets/player-source.m3u8"
          startDate={new Date(Date.now())}
          endDate={new Date(Date.now() + 30 * 60 * 1000)}
          messages={{
            eventFinished: "Live stream je završio.",
            eventNotStarted: "Live stream još nije počeo. Molimo pričekajte.",
            eventStartingSoon: "Počinje za nekoliko sekundi...",
            live: "Uživo",
          }}
        />
      </PlayerContainer>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: min(56.25%, 100vh);
`;

export default App;
