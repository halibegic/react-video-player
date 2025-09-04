import { StartOverIcon } from "@/components/icons/start-over-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { getLiveDelay } from "@/utils/player";

function LivePlayerStartOver() {
  const startTime = useLivePlayerStore((s) => s.startTime);
  const setDelay = useLivePlayerStore((s) => s.setDelay);

  const handleStartOver = () => setDelay(getLiveDelay(startTime));

  return (
    <PlayerButton onClick={handleStartOver}>
      <StartOverIcon />
    </PlayerButton>
  );
}

export { LivePlayerStartOver };
