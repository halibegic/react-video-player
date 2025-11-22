import styled from "@emotion/styled";

const ProgressSlider = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: -0.25rem;
`;

const TipContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) =>
    $isVisible ? "translateY(0)" : "translateY(-0.5rem)"};
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
`;

const TipContent = styled.p`
  margin: 0;
  padding: 0.25rem 0.5rem;
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  text-align: center;
  color: black;
  background: rgba(255, 255, 255, 1);
  border-radius: 1rem;
`;

export { ProgressSlider, TipContainer, TipContent };
