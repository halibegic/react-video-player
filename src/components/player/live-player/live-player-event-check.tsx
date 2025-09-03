import { useStateRefresh } from "@/hooks/use-state-refresh";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { PropsWithChildren } from "react";
import styled from "styled-components";

type LivePlayerEventCheckProps = PropsWithChildren & {
  eventFinishedMessage?: string;
  eventNotStartedMessage?: string;
  eventStartingSoonMessage?: string;
};

function LivePlayerEventCheck({
  children,
  eventFinishedMessage,
  eventNotStartedMessage,
  eventStartingSoonMessage,
}: LivePlayerEventCheckProps) {
  const startDate = useLivePlayerStore((s) => s.startDate);
  const endDate = useLivePlayerStore((s) => s.endDate);

  const now = Date.now();
  const isEventNotStarted = now < startDate.getTime();
  const isEventFinished = now > endDate.getTime();

  useStateRefresh(5000);

  if (isEventNotStarted) {
    return (
      <EventNotStarted
        startDate={startDate}
        title={eventNotStartedMessage || "Event has not started yet."}
        message={eventStartingSoonMessage || "Starting in few seconds..."}
      />
    );
  }

  if (isEventFinished) {
    return (
      <EventFinished title={eventFinishedMessage || "Event has finished."} />
    );
  }

  return <>{children}</>;
}

type EventNotStartedProps = {
  startDate: Date;
  title: string;
  message: string;
};

function EventNotStarted({ startDate, title, message }: EventNotStartedProps) {
  const timeUntilStart = startDate.getTime() - Date.now();
  const hoursUntilStart = Math.floor(timeUntilStart / (1000 * 60 * 60));
  const minutesUntilStart = Math.floor(
    (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (hoursUntilStart || minutesUntilStart) {
    return (
      <EventStatusMessage>
        <EventStatusMessageTitle>{title}</EventStatusMessageTitle>
        <EventStatusMessageText>
          (
          {hoursUntilStart > 0
            ? `${hoursUntilStart}h ${minutesUntilStart}m`
            : `${minutesUntilStart}m`}
          )
        </EventStatusMessageText>
      </EventStatusMessage>
    );
  }

  return (
    <EventStatusMessage>
      <EventStatusMessageTitle>{message}</EventStatusMessageTitle>
    </EventStatusMessage>
  );
}

type EventFinishedProps = {
  title: string;
};

function EventFinished({ title }: EventFinishedProps) {
  return (
    <EventStatusMessage>
      <EventStatusMessageTitle>{title}</EventStatusMessageTitle>
    </EventStatusMessage>
  );
}

const EventStatusMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  background: #f7e406;
`;

const EventStatusMessageTitle = styled.h3`
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
`;

const EventStatusMessageText = styled.p`
  margin: 0;
  height: 1.25rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
`;

export default LivePlayerEventCheck;
