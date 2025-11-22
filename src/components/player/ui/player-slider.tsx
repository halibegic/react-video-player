import * as Slider from "@radix-ui/react-slider";
import { ComponentProps, ElementRef, forwardRef } from "react";
import styles from "./player-slider.module.css";

const PlayerSlider = forwardRef<
  ElementRef<typeof Slider.Root>,
  ComponentProps<typeof Slider.Root>
>(({ max = 100, min = 0, className, ...props }, ref) => {
  return (
    <Slider.Root
      ref={ref}
      min={min}
      max={max}
      aria-label="Player progress"
      className={[styles.sliderRoot, className].filter(Boolean).join(" ")}
      onKeyDown={(event) =>
        // Prevent the slider from being controlled by the keyboard
        // when the slider is focused by a click
        event.preventDefault()
      }
      {...props}
    >
      <Slider.Track className={styles.sliderTrack}>
        <Slider.Range className={styles.sliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.sliderThumb} />
    </Slider.Root>
  );
});

PlayerSlider.displayName = "PlayerSlider";

export { PlayerSlider };
