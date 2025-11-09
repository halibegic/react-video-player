import styled from "@emotion/styled";

const RemainingTime = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Time = styled.p`
  margin: 0;
  padding: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  user-select: none;
`;

const Separator = styled.p`
  margin: 0;
  padding: 0;
  font-size: 0.8125rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;

  &::before {
    content: "/";
  }
`;

export { RemainingTime, Separator, Time };
