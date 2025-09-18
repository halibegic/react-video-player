import { VolumeMaxIcon } from "@/components/icons/volume-max-icon";
import { VolumeMinIcon } from "@/components/icons/volume-min-icon";
import { VolumeMuteIcon } from "@/components/icons/volume-mute-icon";
import { PlayerButton } from "@/components/player/ui/player-button";
import { PlayerSlider } from "@/components/player/ui/player-slider";
import { usePlayerStore } from "@/stores/player-store";
import styled from "@emotion/styled";

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
    <VolumeContainer>
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
      <VolumeSlider>
        <PlayerSlider
          value={[volume]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
      </VolumeSlider>
    </VolumeContainer>
  );
}

const VolumeSlider = styled.div`
  width: 0;
  opacity: 0;
  transition: all 0.2s ease-in-out;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 3rem;
  transition: all 0.2s ease-in-out;

  @media (min-width: 768px) {
    &:hover {
      width: 6rem;

      ${VolumeSlider} {
        width: 100%;
        opacity: 1;
      }
    }
  }
`;

export { PlayerVolume };
