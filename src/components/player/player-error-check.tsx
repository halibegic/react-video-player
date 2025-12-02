import styles from "@/components/player/ui/player-notice.module.css";
import { usePlayerStore } from "@/stores/player-store";

function PlayerErrorNotice() {
  const error = usePlayerStore((s) => s.error);

  if (!error) return null;

  const isLiveManifestError = error.code === "LIVE_MANIFEST_LOAD_ERROR";

  return (
    <div
      className={`${styles.playerNotice} ${
        isLiveManifestError ? styles.playerNoticeLowZIndex : ""
      }`}
    >
      <h3 className={styles.playerNoticeTitle}>{error.message}</h3>
    </div>
  );
}

export { PlayerErrorNotice };
