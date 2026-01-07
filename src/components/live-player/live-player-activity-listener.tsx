import { PlayerActivityListener } from "@/components/player/player-activity-listener";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { extractQueryParams } from "@/utils/url";

type LivePlayerActivityListenerProps = {
  url: string;
};

function LivePlayerActivityListener({ url }: LivePlayerActivityListenerProps) {
  const { video_id } = extractQueryParams(url);
  const delay = useLivePlayerStore((s) => s.delay);

  return (
    <PlayerActivityListener
      kind={delay ? "catchup" : "live"}
      delay={delay}
      url={url}
      id={video_id ? Number(video_id) : undefined}
    />
  );
}

export { LivePlayerActivityListener };
