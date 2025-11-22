import styles from "@/components/player/ui/player-remaining-time.module.css";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";

function VodPlayerRemainingTime() {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  return (
    <div className={styles.remainingTimeContainer}>
      <p className={styles.remainingTime}>{formatTime(currentTime)}</p>
      <p className={styles.remainingSeparator} />
      <p className={styles.remainingTime}>{formatTime(duration)}</p>
    </div>
  );
}

export { VodPlayerRemainingTime };
