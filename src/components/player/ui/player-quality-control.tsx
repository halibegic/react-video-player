import { CheckIcon } from "@/components/icons/check-icon";
import { HdIcon } from "@/components/icons/hd-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import {
  PlayerMenu,
  PlayerMenuContent,
  PlayerMenuItem,
  PlayerMenuPortal,
  PlayerMenuTrigger,
} from "@/components/player/ui/player-menu";
import { usePlayerStore } from "@/stores/player-store";
import { useCallback, useState } from "react";

const IdleLockId = "settings";

function PlayerQualityControl() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = usePlayerStore((s) => s.containerRef);
  const addIdleLock = usePlayerStore((s) => s.addIdleLock);
  const removeIdleLock = usePlayerStore((s) => s.removeIdleLock);
  const levels = usePlayerStore((s) => s.levels);
  const setLevel = usePlayerStore((s) => s.setLevel);

  const handleIsOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);

      if (open) {
        addIdleLock(IdleLockId);
      } else {
        removeIdleLock(IdleLockId);
      }
    },
    [addIdleLock, removeIdleLock]
  );

  return (
    <PlayerMenu open={isOpen} onOpenChange={handleIsOpen}>
      <PlayerMenuTrigger asChild>
        <PlayerButton>
          <HdIcon />
        </PlayerButton>
      </PlayerMenuTrigger>
      <PlayerMenuPortal container={containerRef.current}>
        <PlayerMenuContent side="top" align="end">
          {levels?.map((level) => (
            <PlayerMenuItem
              key={level.sid}
              onClick={() => setLevel(level.value)}
            >
              {level.label}
              {level.selected && <CheckIcon />}
            </PlayerMenuItem>
          ))}
        </PlayerMenuContent>
      </PlayerMenuPortal>
    </PlayerMenu>
  );
}

export { PlayerQualityControl };
