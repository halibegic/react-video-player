import {
  PlayerEventListener,
  PlayerEventListenerProps,
} from "@/components/player/player-event-listener";
import { usePlayerStore } from "@/stores/player-store";
import { PlayerEvents } from "@/types/player";
import { useEffect } from "react";

function VodPlayerEventListener({ callback }: PlayerEventListenerProps) {
  const eventEmitter = usePlayerStore((state) => state.eventEmitter);

  useEffect(() => {
    const handleTimeUpdate = (data: PlayerEvents["timeUpdate"]) =>
      callback("timeUpdate", data);

    eventEmitter.on("timeUpdate", handleTimeUpdate);

    return () => {
      eventEmitter.off("timeUpdate", handleTimeUpdate);
    };
  }, [callback, eventEmitter]);

  return <PlayerEventListener callback={callback} />;
}

export { VodPlayerEventListener };
