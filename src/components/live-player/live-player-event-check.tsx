import {
  PlayerNotice,
  PlayerNoticeText,
  PlayerNoticeTitle,
} from "@/components/player/ui/player-notice.styles";
import { useInterval } from "@/hooks/use-interval";
import { useStateRefresh } from "@/hooks/use-state-refresh";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { getStartDateFromHlsUrl } from "@/utils/hls-parser";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

type LivePlayerEventCheckProps = PropsWithChildren & {
  url: string;
  eventFinishedMessage?: string;
  eventNotStartedMessage?: string;
  eventStartingSoonMessage?: string;
};

function LivePlayerEventCheck({ url, ...props }: LivePlayerEventCheckProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const startDate = useLivePlayerStore((s) => s.startDate);
  const setStartDate = useLivePlayerStore((s) => s.setStartDate);

  const fetchStartDate = useCallback(async () => {
    const detectedStartDate = await getStartDateFromHlsUrl(url);
    if (detectedStartDate) setStartDate(detectedStartDate);
  }, [url, setStartDate]);

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchStartDate();
      setInitialLoading(false);
    };
    fetchData();
  }, [fetchStartDate]);

  useInterval(fetchStartDate, startDate ? null : 5000);

  if (initialLoading) return null;

  return <EventNotice {...props} />;
}

function EventNotice({
  children,
  eventNotStartedMessage = "Event has not started yet.",
  eventStartingSoonMessage = "Starting in few seconds...",
}: Omit<LivePlayerEventCheckProps, "url">) {
  const startDate = useLivePlayerStore((s) => s.startDate);
  const isStarted = usePlayerStore((s) => s.isStarted);

  useStateRefresh(!isStarted ? 5000 : null);

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
