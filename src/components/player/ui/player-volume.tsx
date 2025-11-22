import { VolumeMaxIcon } from "@/components/icons/volume-max-icon";
import { VolumeMinIcon } from "@/components/icons/volume-min-icon";
import { VolumeMuteIcon } from "@/components/icons/volume-mute-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { PlayerSlider } from "@/components/player/ui/player-slider";
import { usePlayerStore } from "@/stores/player-store";
import styles from "./player-volume.module.css";

const IdleLockId = "volume";

function PlayerVolume() {
  const setVolume = usePlayerStore((s) => s.setVolume);
  const volume = usePlayerStore((s) => s.volume);
  const addIdleLock = usePlayerStore((s) => s.addIdleLock);
  const removeIdleLock = usePlayerStore((s) => s.removeIdleLock);

  const handleSliderChange = (value: number[]) => {
    setVolume(value[0]);

    addIdleLock(IdleLockId);
  };

  const handleSliderCommit = () => {
    removeIdleLock(IdleLockId);
  };

  const handleMute = () => setVolume(!volume ? 100 : 0);

  return (
    <div className={styles.volumeContainer}>
      <PlayerButton onClick={handleMute} className="shrink-0">
        {volume ? (
          volume > 50 ? (
            <VolumeMaxIcon />
          ) : (
            <VolumeMinIcon />
          )
        ) : (
          <VolumeMuteIcon />
        )}
      </PlayerButton>
      <div className={styles.volumeSlider}>
        <PlayerSlider
          value={[volume]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
      </div>
    </div>
  );
}

export { PlayerVolume };
