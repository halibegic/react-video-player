import {
  ProgressSlider,
  TipContainer,
  TipContent,
} from "@/components/player/ui/player-progress.styles";
import { PlayerSlider } from "@/components/player/ui/player-slider";
import { useInterval } from "@/hooks/use-interval";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";
import { offset } from "@/utils/dom";
import {
  getLiveCurrentTime,
  getLiveDelay,
  getLiveDurationTime,
} from "@/utils/player";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

const idleLockId = "vod-player-progress-bar";

function LivePlayerProgress() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isTipVisible, setIsTipVisible] = useState<boolean>(false);
  const [tipTime, setTipTime] = useState<number>(-1);
  const [skipTime, setSkipTime] = useState<number>(-1);
  const delay = useLivePlayerStore((s) => s.delay);
  const startTime = useLivePlayerStore((s) => s.startTime);
  const endTime = useLivePlayerStore((s) => s.endTime);
  const setDelay = useLivePlayerStore((s) => s.setDelay);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const addIdleLock = usePlayerStore((s) => s.addIdleLock);
  const removeIdleLock = usePlayerStore((s) => s.removeIdleLock);

  const calculateTime = useCallback(() => {
    setCurrentTime(getLiveCurrentTime(startTime, delay));
    setDuration(getLiveDurationTime(startTime, endTime));
  }, [delay, endTime, startTime]);

  const progress = parseFloat(
    (duration
      ? ((skipTime !== -1 ? skipTime : currentTime) / duration) * 100
      : 0
    ).toFixed(1)
  );

  const handleSliderChange = (value: number[]) => {
    setSkipTime(duration * (value[0] / 100));

    addIdleLock(idleLockId);
  };

  const handleSliderCommit = () => {
    if (skipTime !== -1) {
      const delay = getLiveDelay(startTime, skipTime);

      setDelay(delay);

      setSkipTime(-1);

      removeIdleLock(idleLockId);
    }
  };

  const handleShowTip = () => setIsTipVisible(true);

  const handleHideTip = () => setIsTipVisible(false);

  const handleMoveTip = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const slider = sliderRef.current;
      const tip = tipRef.current;

      if (slider && tip) {
        const sliderOffset = offset(slider);
        const tipOffset = offset(tip);

        const delta = (event.pageX || event.clientX) - sliderOffset.left;
        const percentage = delta / sliderOffset.width;

        if (percentage < 0) return;

        let left = delta - tipOffset.width / 2;

        if (left < 0) left = 0;

        if (left > sliderOffset.width - tipOffset.width) left = -1;

        tip.style.left = left > -1 ? `${left}px` : "auto";
        tip.style.right = left > -1 ? "auto" : "0px";

        setTipTime(percentage * duration);
      }

      handleShowTip();
    },
    [duration]
  );

  useInterval(() => calculateTime(), isPlaying ? 1000 : null);

  useEffect(() => {
    calculateTime();
  }, [calculateTime]);

  return (
    <ProgressSlider>
      <PlayerSlider
        ref={sliderRef}
        value={[progress]}
        onPointerLeave={handleHideTip}
        onPointerDown={handleHideTip}
        onPointerMove={handleMoveTip}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        step={0.1}
      />
      <TipContainer ref={tipRef} $isVisible={isTipVisible}>
        <TipContent>{formatTime(tipTime)}</TipContent>
      </TipContainer>
    </ProgressSlider>
  );
}

export { LivePlayerProgress };
