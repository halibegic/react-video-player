import { useInterval } from "@/hooks/use-interval";
import { useLivePlayerStore } from "@/stores/live-player-store";
import { useEffect, useRef } from "react";

type LivePlayerViewerCountProps = {
  url: string;
};

function LivePlayerViewerCount({ url }: LivePlayerViewerCountProps) {
  const setViewerCount = useLivePlayerStore((s) => s.setViewerCount);
  const abortRef = useRef<AbortController | null>(null);

  // Example: https://fitnessanny-live-staging.morescreens.com/ANNY1_12041504/live/playlist.m3u8?...
  // Extract: ANNY1_12041504
  const extractUri = (playerUrl: string): string | null => {
    try {
      const urlObj = new URL(playerUrl);
      const pathname = urlObj.pathname;
      // Split pathname by '/' and get the first non-empty segment
      const segments = pathname.split("/").filter((s) => s.length > 0);
      return segments[0] || null;
    } catch (error) {
      console.error("Failed to extract URI from player URL:", error);
      return null;
    }
  };

  const fetchViewerCount = async () => {
    const uri = extractUri(url);
    if (!uri) {
      console.error("Could not extract URI from URL:", url);
      return;
    }

    // Cancel previous request if it's still pending
    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();

    // Use staging or production endpoint based on URL
    const environment = url.includes("staging") ? "stg" : "prd";
    const apiUrl = `https://${environment}-fitnessanny.spectar.tv/analytics-api/v1/token-info/uri/${uri}`;

    try {
      const response = await fetch(apiUrl, {
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const count = data.count ?? 0;
      setViewerCount(count);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Request was aborted, ignore
        return;
      }
      console.error("Failed to fetch viewer count:", error);
      setViewerCount(null);
    }
  };

  useEffect(() => {
    fetchViewerCount();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [url]);

  useInterval(fetchViewerCount, 15000); // Fetch every 15 seconds

  return null;
}

export { LivePlayerViewerCount };
