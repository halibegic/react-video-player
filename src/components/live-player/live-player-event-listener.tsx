import {
  PlayerEventListener,
  PlayerEventListenerProps,
} from "@/components/player/player-event-listener";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { getLiveCurrentTime } from "@/utils/player";
import { useEffect } from "react";

function LivePlayerEventListener({ callback }: PlayerEventListenerProps) {
  const delay = useLivePlayerStore((s) => s.delay);
  const startDate = useLivePlayerStore((s) => s.startDate);
  const startTime = startDate ? startDate.getTime() : 0;
  const eventEmitter = usePlayerStore((state) => state.eventEmitter);

  useEffect(() => {
    const handleTimeUpdate = () =>
      callback("timeUpdate", {
        currentTime: getLiveCurrentTime(startTime, delay),
        duration: -1,
      });

    eventEmitter.on("timeUpdate", handleTimeUpdate);

    return () => {
      eventEmitter.off("timeUpdate", handleTimeUpdate);
    };
  }, [callback, delay, eventEmitter, startTime]);

  return <PlayerEventListener callback={callback} />;
}

export { LivePlayerEventListener };
