import { PlayerSourceType } from "@/config/player";

function getPlayerSourceType(
  url: string | undefined | null
): keyof typeof PlayerSourceType {
  if (url) {
    const hlsExtRE = /\.m3u8/i;

    if (hlsExtRE.test(url)) return PlayerSourceType.hls;
  }

  return PlayerSourceType.dash;
}

export { getPlayerSourceType };
