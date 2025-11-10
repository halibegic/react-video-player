import { StartOverIcon } from "@/components/icons/start-over-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { getLiveDelay } from "@/utils/player";

function LivePlayerStartOver() {
  const startDate = useLivePlayerStore((s) => s.startDate);
  const setDelay = useLivePlayerStore((s) => s.setDelay);
  const startTime = startDate ? startDate.getTime() : 0;

  const handleStartOver = () => setDelay(getLiveDelay(startTime));

  return (
    <PlayerButton onClick={handleStartOver}>
      <StartOverIcon />
    </PlayerButton>
  );
}

export { LivePlayerStartOver };
