import { PlayerTech } from "@/components/player/player-tech";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { useCallback, useEffect, useState } from "react";

type LivePlayerTechProps = {
  url: string;
};

function LivePlayerTech({ url }: LivePlayerTechProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const delay = useLivePlayerStore((s) => s.delay);

  const prepareData = useCallback(async () => {
    if (delay) {
      setCurrentUrl(
        url.replace(
          "playlist.m3u8",
          `playlist_fmp4_dvr_timeshift-${delay}.m3u8`
        )
      );
    } else {
      setCurrentUrl(url);
    }
  }, [delay, url]);

  useEffect(() => {
    prepareData();
  }, [prepareData]);

  return currentUrl ? <PlayerTech url={currentUrl} isLive={true} /> : null;
}

export { LivePlayerTech };
