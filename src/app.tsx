import { LivePlayer } from "@/components/live-player";
import { VodPlayer } from "@/components/vod-player";
import styled from "styled-components";

function App() {
  return (
    <AppContainer>
      <Title>Vod Player</Title>
      <PlayerContainer>
        <VodPlayer
          url="https://fitnessanny-vod-staging.morescreens.com/vod_hls/barre_ingest_test_,480p,576p,720p,1080p,.mp4.urlset/playlist.m3u8?authority_instance_id=fitnessanny-test-auth&video_id=42&token=c1322cc89b446f4bff4735b1d96cb66cef5f8d10"
          watchHistory={{
            enabled: true,
            storageKey: "big-buck-bunny-watch-history",
          }}
        />
      </PlayerContainer>
      <Title>Live Player</Title>
      <PlayerContainer>
        <LivePlayer
          url="https://fitnessanny-live-staging.morescreens.com/ANNY_1_004/live/playlist.m3u8?authority_instance_id=fitnessanny-test-auth&video_id=42&token=c1322cc89b446f4bff4735b1d96cb66cef5f8d10"
          startDate={new Date(Date.now() - 30 * 60 * 1000)}
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
