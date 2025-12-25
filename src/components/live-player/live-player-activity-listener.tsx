import { PlayerActivityListener } from "@/components/player/player-activity-listener";
import { useLivePlayerStore } from "@/stores/live-player-store";

type LivePlayerActivityListenerProps = {
  url: string;
};

function LivePlayerActivityListener({ url }: LivePlayerActivityListenerProps) {
  const delay = useLivePlayerStore((s) => s.delay);

  return (
    <PlayerActivityListener
      kind={delay ? "catchup" : "live"}
      delay={delay}
      url={url}
    />
  );
}

export { LivePlayerActivityListener };
