import { HTMLAttributes } from "react";
import styled from "styled-components";

type PlayerButtonProps = HTMLAttributes<HTMLButtonElement>;

function PlayerButton({ ...props }: PlayerButtonProps) {
  return <Button {...props} />;
}

const Button = styled.button<PlayerButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: white;
  background: none;
  border: none;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export { PlayerButton };
