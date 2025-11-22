import { PlayerSpinner } from "@/components/player/ui/player-spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { usePlayerStore } from "@/stores/player-store";
import type { HTMLAttributes } from "react";
import styles from "./player-loading.module.css";

type PlayerLoadingProps = HTMLAttributes<HTMLDivElement>;

function PlayerLoading({ style, ...props }: PlayerLoadingProps) {
  const isLoading = usePlayerStore((s) => s.isLoading);
  const isVisible = useDebounce(isLoading, 100);

  return isVisible ? (
    <div className={styles.loadingContainer} style={style} {...props}>
      <PlayerSpinner />
    </div>
  ) : null;
}

export { PlayerLoading };
