import {
  CurrentTime,
  Duration,
  RemainingTime,
  Separator,
} from "@/components/player/ui/player-remaining-time.styles";
import { useInterval } from "@/hooks/use-interval";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";
import { getLiveCurrentTime, getLiveDurationTime } from "@/utils/player";
import { useCallback, useEffect, useState } from "react";

function LivePlayerRemainingTime() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const delay = useLivePlayerStore((s) => s.delay);
  const startTime = useLivePlayerStore((s) => s.startTime);
  const endTime = useLivePlayerStore((s) => s.endTime);

  const calculateTime = useCallback(() => {
    setCurrentTime(getLiveCurrentTime(startTime, delay));
    setDuration(getLiveDurationTime(startTime, endTime));
  }, [delay, endTime, startTime]);

  useInterval(() => calculateTime(), isPlaying ? 1000 : null);

  useEffect(() => {
    calculateTime();
  }, [calculateTime]);

  return delay ? (
    <RemainingTime>
      <CurrentTime>{formatTime(currentTime)}</CurrentTime>
      <Separator />
      <Duration>{formatTime(duration)}</Duration>
    </RemainingTime>
  ) : null;
}

export { LivePlayerRemainingTime };
