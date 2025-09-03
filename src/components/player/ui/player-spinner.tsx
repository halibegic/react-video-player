import { HTMLAttributes } from "react";
import styled, { keyframes } from "styled-components";

function PlayerSpinner(props: HTMLAttributes<HTMLDivElement>) {
  return <Spinner {...props} />;
}

const spinKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  --spinner-color: white;
  --spinner-size: 1.5rem;
  --spinner-border-width: 2px;
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: var(--spinner-border-width) solid var(--spinner-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

export { PlayerSpinner };
