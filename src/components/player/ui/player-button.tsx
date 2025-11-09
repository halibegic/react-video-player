import styled from "@emotion/styled";
import { HTMLAttributes, forwardRef } from "react";

type PlayerButtonProps = HTMLAttributes<HTMLButtonElement> & {
  shape?: "square" | "circle";
};

const PlayerButton = forwardRef<HTMLButtonElement, PlayerButtonProps>(
  ({ shape = "circle", ...props }, ref) => {
    return <Button ref={ref} $shape={shape} {...props} />;
  }
);

PlayerButton.displayName = "PlayerButton";

const Button = styled.button<{ $shape: PlayerButtonProps["shape"] }>`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
  font-size: 0.8125rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  cursor: pointer;
  color: white;
  border: none;
  transition: color 0.2s ease-in-out, background 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    pointer-events: none;
  }

  &:hover,
  &:focus {
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $shape }) =>
    $shape === "circle" &&
    `
      padding: 0;
      width: 2rem;
      height: 2rem;
      background: none;
    `}

  ${({ $shape }) =>
    $shape === "square" &&
    `
      padding: 0.5rem 1rem;
      color: black;
      background: white;
    `}
`;

export { PlayerButton };
export type { PlayerButtonProps };
