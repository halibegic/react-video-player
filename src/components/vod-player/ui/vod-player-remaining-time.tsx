import {
  RemainingTime,
  RemainingTimeClassName,
  Separator,
  SeparatorClassName,
  Time,
  TimeClassName,
} from "@/components/player/ui/player-remaining-time.styles";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";

function VodPlayerRemainingTime() {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  return (
    <div className={RemainingTimeClassName}>
      <p className={TimeClassName}>{formatTime(currentTime)}</p>
      <p className={SeparatorClassName} />
      <p className={TimeClassName}>{formatTime(duration)}</p>
    </div>
  );
}

export { VodPlayerRemainingTime };
