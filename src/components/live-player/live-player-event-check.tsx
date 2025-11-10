import {
  PlayerNotice,
  PlayerNoticeText,
  PlayerNoticeTitle,
} from "@/components/player/ui/player-notice.styles";
import { useStateRefresh } from "@/hooks/use-state-refresh";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { PropsWithChildren } from "react";

type LivePlayerEventCheckProps = PropsWithChildren & {
  eventFinishedMessage?: string;
  eventNotStartedMessage?: string;
  eventStartingSoonMessage?: string;
};

function LivePlayerEventCheck({
  children,
  eventNotStartedMessage = "Event has not started yet.",
  eventStartingSoonMessage = "Starting in few seconds...",
}: LivePlayerEventCheckProps) {
  const startDate = useLivePlayerStore((s) => s.startDate);

  useStateRefresh(5000);

  if (!startDate) {
    return (
      <PlayerNotice>
        <PlayerNoticeTitle>{eventNotStartedMessage}</PlayerNoticeTitle>
      </PlayerNotice>
    );
  }

  const now = Date.now();
  const isEventNotStarted = now < startDate.getTime();

  if (isEventNotStarted) {
    return (
      <EventNotStarted
        startDate={startDate}
        title={eventNotStartedMessage}
        message={eventStartingSoonMessage}
      />
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
      <PlayerNotice>
        <PlayerNoticeTitle>{title}</PlayerNoticeTitle>
        <PlayerNoticeText>
          (
          {hoursUntilStart > 0
            ? `${hoursUntilStart}h ${minutesUntilStart}m`
            : `${minutesUntilStart}m`}
          )
        </PlayerNoticeText>
      </PlayerNotice>
    );
  }

  return (
    <PlayerNotice>
      <PlayerNoticeTitle>{message}</PlayerNoticeTitle>
    </PlayerNotice>
  );
}

type EventFinishedProps = {
  title: string;
};

function EventFinished({ title }: EventFinishedProps) {
  return (
    <PlayerNotice>
      <PlayerNoticeTitle>{title}</PlayerNoticeTitle>
    </PlayerNotice>
  );
}

export { LivePlayerEventCheck };
