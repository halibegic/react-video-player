import { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

type PlayerButtonProps = HTMLAttributes<HTMLButtonElement> & {
  shape?: "square" | "circle";
};

function PlayerButton({ shape = "circle", ...props }: PlayerButtonProps) {
  return <Button $shape={shape} {...props} />;
}

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
  background: none;
  border: none;
  border-radius: 1rem;
  transition: color 0.2s ease-in-out, background 0.2s ease-in-out;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
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
    css`
      padding: 0;
      width: 2rem;
      height: 2rem;
    `}

  ${({ $shape }) =>
    $shape === "square" &&
    css`
      padding: 0.25rem 0.5rem;
    `}
`;

export { PlayerButton };
export type { PlayerButtonProps };
