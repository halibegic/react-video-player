import styles from "@/components/player/ui/player-notice.module.css";
import { usePlayerStore } from "@/stores/player-store";

function PlayerErrorNotice() {
  const error = usePlayerStore((s) => s.error);

  if (!error) return null;

  return (
    <div className={styles.playerNotice}>
      <h3 className={styles.playerNoticeTitle}>{error.message}</h3>
      {error.code ? (
        <p className={styles.playerNoticeText}>Code: {error.code}</p>
      ) : null}
      {error.tech ? (
        <p className={styles.playerNoticeText}>Engine: {error.tech}</p>
      ) : null}
    </div>
  );
}

export { PlayerErrorNotice };
