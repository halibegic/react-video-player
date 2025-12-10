import styles from "@/components/player/ui/player-notice.module.css";
import { useInterval } from "@/hooks/use-interval";
import { useStateRefresh } from "@/hooks/use-state-refresh";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { usePlayerStore } from "@/stores/player-store";
import { getStartDateFromHlsUrl } from "@/utils/hls-parser";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

type LivePlayerEventCheckProps = PropsWithChildren & {
  url: string;
  messages: {
    eventNotStarted: string;
    eventStartingSoon: string;
    unableToPlay: string;
  };
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
  messages,
}: Omit<LivePlayerEventCheckProps, "url">) {
  const startDate = useLivePlayerStore((s) => s.startDate);
  const isStarted = usePlayerStore((s) => s.isStarted);

  useStateRefresh(!isStarted ? 5000 : null);

  if (!startDate) {
    return (
      <div className={styles.playerNotice}>
        <h3 className={styles.playerNoticeTitle}>{messages.unableToPlay}</h3>
      </div>
    );
  }

  const now = Date.now();
  const isEventNotStarted = now < startDate.getTime();

  if (isEventNotStarted) {
    return (
      <EventNotStarted
        startDate={startDate}
        title={messages.eventNotStarted}
        message={messages.eventStartingSoon}
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
      <div className={styles.playerNotice}>
        <h3 className={styles.playerNoticeTitle}>{title}</h3>
        <p className={styles.playerNoticeText}>
          (
          {hoursUntilStart > 0
            ? `${hoursUntilStart}h ${minutesUntilStart}m`
            : `${minutesUntilStart}m`}
          )
        </p>
      </div>
    );
  }

  return (
    <div className={styles.playerNotice}>
      <h3 className={styles.playerNoticeTitle}>{message}</h3>
    </div>
  );
}

export { LivePlayerEventCheck };
