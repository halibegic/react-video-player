import styled from "styled-components";

export const PlayerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  background: black;
  overflow: hidden;
`;

export const ControlsBottom = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: 10;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding-top: 1rem;

  @media (min-width: 768px) {
    padding-top: 2rem;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  line-height: 1;
  font-size: 0;

  @media (min-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  padding: 0.5rem 0;
  width: 100%;
  align-items: center;
`;

export const ControlsSection = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
`;

export const ControlsSectionStart = styled(ControlsSection)`
  justify-content: flex-start;
`;

export const ControlsSectionEnd = styled(ControlsSection)`
  justify-content: flex-end;
`;
