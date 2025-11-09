import {
  RemainingTime,
  Separator,
  Time,
} from "@/components/player/ui/player-remaining-time.styles";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";

function VodPlayerRemainingTime() {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  return (
    <RemainingTime>
      <Time>{formatTime(currentTime)}</Time>
      <Separator />
      <Time>{formatTime(duration)}</Time>
    </RemainingTime>
  );
}

export { VodPlayerRemainingTime };
