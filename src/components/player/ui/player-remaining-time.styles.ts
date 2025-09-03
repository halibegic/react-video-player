import styled from "styled-components";

const RemainingTime = styled.div`
  display: flex;
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
`;

const CurrentTime = styled(Time)`
  margin-right: 0.5rem;
`;

const Duration = styled(Time)`
  margin-left: 0.5rem;
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

export { CurrentTime, Duration, RemainingTime, Separator, Time };
