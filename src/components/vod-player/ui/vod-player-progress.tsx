import {
  ProgressSlider,
  ProgressSliderClassName,
  TipContainer,
  TipContainerClassName,
  TipContainerVisibleClassName,
  TipContainerHiddenClassName,
  TipContent,
  TipContentClassName,
} from "@/components/player/ui/player-progress.styles";
import { PlayerSlider } from "@/components/player/ui/player-slider";
import { usePlayerStore } from "@/stores/player-store";
import { formatTime } from "@/utils/date-time";
import { offset } from "@/utils/dom";
import { PointerEvent, useCallback, useRef, useState } from "react";

const IdleLockId = "vod-player-progress-bar";

function VodPlayerProgress() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [isTipVisible, setIsTipVisible] = useState<boolean>(false);
  const [tipTime, setTipTime] = useState<number>(-1);
  const [skipTime, setSkipTime] = useState<number>(-1);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const seek = usePlayerStore((s) => s.seek);
  const addIdleLock = usePlayerStore((s) => s.addIdleLock);
  const removeIdleLock = usePlayerStore((s) => s.removeIdleLock);

  const progress = parseFloat(
    (duration
      ? ((skipTime !== -1 ? skipTime : currentTime) / duration) * 100
      : 0
    ).toFixed(1)
  );

  const handleSliderChange = (value: number[]) => {
    setSkipTime(duration * (value[0] / 100));

    addIdleLock(IdleLockId);
  };

  const handleSliderCommit = () => {
    if (skipTime !== -1) {
      seek(skipTime);

      setSkipTime(-1);

      removeIdleLock(IdleLockId);
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

  return (
    <div className={ProgressSliderClassName}>
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
      <div
        ref={tipRef}
        className={`${TipContainerClassName} ${
          isTipVisible ? TipContainerVisibleClassName : TipContainerHiddenClassName
        }`}
      >
        <p className={TipContentClassName}>{formatTime(tipTime)}</p>
      </div>
    </div>
  );
}

export { VodPlayerProgress };
