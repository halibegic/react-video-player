import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { HTMLAttributes } from "react";

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
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

export { PlayerSpinner };
