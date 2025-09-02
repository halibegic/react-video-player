import { LivePlayer } from "@/components/live-player";
import { VodPlayer } from "@/components/vod-player";
import styled from "styled-components";

function App() {
  return (
    <AppContainer>
      <Title>Vod Player (HLS)</Title>
      <PlayerContainer>
        <VodPlayer url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
      </PlayerContainer>
      <Title>Live Player (DASH)</Title>
      <PlayerContainer>
        <LivePlayer url="https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd" />
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
