import { PauseIcon } from "@/components/player/ui/icons/pause-icon";
import { PlayIcon } from "@/components/player/ui/icons/play-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { usePlayerStore } from "@/stores/player-store";
import { useEffect, useState } from "react";

function LivePlayerPlayback() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isStarted = usePlayerStore((s) => s.isStarted);
  const play = usePlayerStore((s) => s.play);

  const handleToggle = () => {
    if (!isPlaying) play();
  };

  useEffect(() => {
    setIsVisible(!isStarted && !isPlaying);
  }, [isStarted, isPlaying]);

  return isVisible ? (
    <PlayerButton onClick={handleToggle}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </PlayerButton>
  ) : null;
}

export { LivePlayerPlayback };
