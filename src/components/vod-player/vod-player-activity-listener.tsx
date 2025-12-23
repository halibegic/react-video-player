import { PlayerActivityListener } from "@/components/player/player-activity-listener";

type VodPlayerActivityListenerProps = {
  url: string;
};

function VodPlayerActivityListener({ url }: VodPlayerActivityListenerProps) {
  return <PlayerActivityListener kind="vod" url={url} />;
}

export { VodPlayerActivityListener };
