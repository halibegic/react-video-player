import { useLivePlayerStore } from "@/stores/live-player-store";
import styles from "./live-player-viewers.module.css";

function LivePlayerViewers() {
  const viewerCount = useLivePlayerStore((s) => s.viewerCount);

  if (!viewerCount) return null;

  return (
    <div className={styles.viewersContainer}>
      <span className={styles.viewersIndicator} />
      <svg
        className={styles.viewersIcon}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z"
          fill="currentColor"
        />
        <path
          d="M8 8C5.79086 8 4 9.79086 4 12V13H12V12C12 9.79086 10.2091 8 8 8Z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.viewersCount}>
        {viewerCount.toLocaleString()}
      </span>
    </div>
  );
}

export { LivePlayerViewers };
