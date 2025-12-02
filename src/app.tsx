import { LivePlayer } from "@/components/live-player";
import { VodPlayer } from "@/components/vod-player";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}>Vod Player</h1>
      <div className={styles.playerContainer}>
        <VodPlayer
          url="https://stream.mux.com/XY5biw91UUVPs5qKWQHAI4rF301ayox01Q901jZPewe2S00.m3u8"
          messages={{
            unableToPlay:
              "Stream ne može biti reprodukovan. Molimo pokušajte kasnije.",
          }}
        />
      </div>
      <h1 className={styles.appTitle}>Live Player</h1>
      <div className={styles.playerContainer}>
        <LivePlayer
          url="https://storage.googleapis.com/shaka-live-assets/player-source.m3u8"
          messages={{
            eventFinished: "Live stream je završio.",
            eventNotStarted: "Live stream još nije počeo. Molimo pričekajte.",
            eventStartingSoon: "Počinje za nekoliko sekundi...",
            live: "Uživo",
            unableToPlay:
              "Stream ne može biti reprodukovan. Molimo pokušajte kasnije.",
          }}
        />
      </div>
    </div>
  );
}

export default App;
