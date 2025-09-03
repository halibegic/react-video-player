import {
  CurrentTime,
  Duration,
  RemainingTime,
  Separator,
} from "@/components/player/ui/player-remaining-time.styles";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";

function VodPlayerRemainingTime() {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  return (
    <RemainingTime>
      <CurrentTime>{formatTime(currentTime)}</CurrentTime>
      <Separator />
      <Duration>{formatTime(duration)}</Duration>
    </RemainingTime>
  );
}

export { VodPlayerRemainingTime };
