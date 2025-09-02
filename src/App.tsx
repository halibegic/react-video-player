import { LivePlayer } from "@/components/live-player";
import { VodPlayer } from "@/components/vod-player";

function App() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-4">Vod Player (HLS)</h1>
      <div className="relative w-full pt-[min(56.25%,100vh)]">
        <VodPlayer url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
      </div>
      <h1 className="text-2xl font-bold my-4">Live Player (DASH)</h1>
      <div className="relative w-full pt-[min(56.25%,100vh)]">
        <LivePlayer url="https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd" />
      </div>
    </div>
  );
}

export default App;
