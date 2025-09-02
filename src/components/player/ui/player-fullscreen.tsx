import { PlayerButton } from "@/components/player/ui/player-button";
import { usePlayerStore } from "@/stores/player-store";
import { isiOS } from "@/utils/device";
import { isActiveFullscreen, onFullscreenChange } from "@/utils/fullscreen";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useCallback, useEffect } from "react";

const PlayerFullscreen = () => {
  const containerRef = usePlayerStore((s) => s.containerRef);
  const exitFullscreen = usePlayerStore((s) => s.exitFullscreen);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const requestFullscreen = usePlayerStore((s) => s.requestFullscreen);
  const setIsFullscreen = usePlayerStore((s) => s.setIsFullscreen);
  const setIsFullscreenReady = usePlayerStore((s) => s.setIsFullscreenReady);
  const techRef = usePlayerStore((s) => s.techRef);

  const handleFullscreenChange = useCallback(
    (event: Event) => {
      event.stopPropagation();
      setIsFullscreen(isActiveFullscreen());
    },
    [setIsFullscreen]
  );

  const handleFullscreen = () => {
    if (isFullscreen) exitFullscreen();
    else requestFullscreen();
  };

  useEffect(() => {
    const element = isiOS ? techRef.current : containerRef.current;

    if (!element) return;

    return onFullscreenChange(element, handleFullscreenChange);
  }, [containerRef, handleFullscreenChange, techRef]);

  useEffect(() => {
    setIsFullscreenReady(true);
  }, [setIsFullscreenReady]);

  return (
    <PlayerButton onClick={handleFullscreen}>
      {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </PlayerButton>
  );
};

export { PlayerFullscreen };
