import { usePlayerStore } from "@/stores/player-store";
import * as dashjs from "dashjs";
import { useCallback, useEffect, useRef } from "react";

type PlayerDashTechProps = {
  url: string;
  isLive: boolean;
};

const PlayerDashTech = ({ url, isLive }: PlayerDashTechProps) => {
  const dashRef = useRef<dashjs.MediaPlayerClass | null>(null);
  const techRef = usePlayerStore((s) => s.techRef);

  const handleCapabilitiesFilter = useCallback(
    (representation: dashjs.Representation) => {
      const codecs = representation.codecs;

      // Disable HEVC and H.265 codecs
      if (codecs && new RegExp(/hev1|hvc1/).test(codecs)) {
        return false;
      }

      return true;
    },
    []
  );

  const prepareDash = useCallback(() => {
    if (!techRef.current) return;

    const liveConfig = {
      abr: {
        initialBitrate: {
          video: 200_000, // KB
        },
      },
      protection: {
        // https://github.com/Dash-Industry-Forum/dash.js/issues/4752
        ignoreKeyStatuses: true,
      },
    } as dashjs.MediaPlayerSettingClass;

    const vodConfig = {} as dashjs.MediaPlayerSettingClass;

    const config = isLive ? liveConfig : vodConfig;

    try {
      dashRef.current = dashjs.MediaPlayer().create();

      console.log("[Player] URL", url);
      console.log("[Player] Version", dashRef.current.getVersion());
      console.log("[Player] Config init", JSON.stringify(config));

      dashRef.current.registerCustomCapabilitiesFilter(
        handleCapabilitiesFilter
      );

      dashRef.current.initialize(techRef.current, url, /* autoplay */ true);

      dashRef.current.updateSettings(config);

      console.log(
        "[Player] Config current",
        JSON.stringify(dashRef.current.getSettings())
      );
    } catch (error) {
      throw new Error(`Error initializing Dash: ${error}`);
    }
  }, [handleCapabilitiesFilter, techRef, url, isLive]);

  const cleanupDash = useCallback(() => {
    if (dashRef.current) {
      dashRef.current.unregisterCustomCapabilitiesFilter(
        handleCapabilitiesFilter
      );

      dashRef.current.destroy();
      dashRef.current = null;

      console.log("[Player] Dash destroyed");
    }
  }, [handleCapabilitiesFilter]);

  useEffect(() => {
    prepareDash();

    return cleanupDash;
  }, [cleanupDash, prepareDash]);

  return null;
};

export default PlayerDashTech;
