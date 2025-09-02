import { PlayerSlider } from "@/components/player/ui/player-slider";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";
import { useState } from "react";
import styled from "styled-components";

function VodPlayerProgress() {
  const [skipTime, setSkipTime] = useState<number>(-1);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  const progress = parseFloat(
    (duration
      ? ((skipTime !== -1 ? skipTime : currentTime) / duration) * 100
      : 0
    ).toFixed(1)
  );

  return (
    <ProgressRow>
      <ProgressTime>
        <CurrentTime>{formatTime(currentTime)}</CurrentTime>
      </ProgressTime>
      <ProgressSlider>
        <PlayerSlider value={progress} step={0.1} />
      </ProgressSlider>
      <ProgressTime>
        <Duration>{formatTime(duration)}</Duration>
      </ProgressTime>
    </ProgressRow>
  );
}

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressTime = styled.div``;

const ProgressSlider = styled.div`
  flex: 1;
`;

const Time = styled.p`
  margin: 0;
  color: #fff;
  font-size: 0.875rem;
`;
const CurrentTime = styled(Time)`
  padding-left: 0.25rem;
`;

const Duration = styled(Time)`
  padding-right: 0.25rem;
`;

export { VodPlayerProgress };
