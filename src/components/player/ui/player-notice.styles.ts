import styled from "@emotion/styled";

const PlayerNotice = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
`;

const PlayerNoticeTitle = styled.h3`
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
`;

const PlayerNoticeText = styled.p`
  margin: 0;
  height: 1.25rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
`;

export { PlayerNotice, PlayerNoticeText, PlayerNoticeTitle };
