import { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

type PlayerButtonProps = HTMLAttributes<HTMLButtonElement> & {
  shape?: "square" | "circle";
};

function PlayerButton({ shape = "circle", ...props }: PlayerButtonProps) {
  return <Button $shape={shape} {...props} />;
}

const Button = styled.button<{ $shape: PlayerButtonProps["shape"] }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  line-height: 1;
  font-size: 0.875rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  cursor: pointer;
  color: white;
  background: none;
  border: none;
  transition: background 0.2s ease-in-out;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.6);
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
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 1.25rem;
    `}

  ${({ $shape }) =>
    $shape === "square" &&
    css`
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
    `}
`;

export { PlayerButton };
export type { PlayerButtonProps };
