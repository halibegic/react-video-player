import { PlayerActivityListener } from "@/components/player/player-activity-listener";
import { extractQueryParams } from "@/utils/url";

type VodPlayerActivityListenerProps = {
  url: string;
};

function VodPlayerActivityListener({ url }: VodPlayerActivityListenerProps) {
  const { video_id } = extractQueryParams(url);
  return (
    <PlayerActivityListener
      kind="vod"
      url={url}
      id={video_id ? Number(video_id) : undefined}
    />
  );
}

export { VodPlayerActivityListener };
