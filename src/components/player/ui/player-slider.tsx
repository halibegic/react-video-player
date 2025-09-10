import styled from "@emotion/styled";
import * as Slider from "@radix-ui/react-slider";
import { ComponentProps, ElementRef, forwardRef } from "react";

const PlayerSlider = forwardRef<
  ElementRef<typeof Slider.Root>,
  ComponentProps<typeof Slider.Root>
>(({ max = 100, min = 0, ...props }, ref) => {
  return (
    <SliderRoot
      ref={ref}
      min={min}
      max={max}
      aria-label="Player progress"
      onKeyDown={(event) =>
        // Prevent the slider from being controlled by the keyboard
        // when the slider is focused by a click
        event.preventDefault()
      }
      {...props}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </SliderRoot>
  );
});

PlayerSlider.displayName = "PlayerSlider";

const SliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 1rem;
  touch-action: none;
  user-select: none;
  cursor: pointer;

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SliderTrack = styled(Slider.Track)`
  position: relative;
  height: 0.25rem;
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  overflow: hidden;
`;

const SliderRange = styled(Slider.Range)`
  position: absolute;
  height: 100%;
  background: #f7e406;
  transition: width 0.2s ease-in-out;
  border-radius: 1rem;
`;

const SliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  cursor: pointer;
  background: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
  border-radius: 50%;

  &:hover {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125rem rgba(247, 228, 6, 0.5);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export { PlayerSlider };
