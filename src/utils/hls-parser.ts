function extractStartTimeFromPlaylist(playlistContent: string): Date | null {
  const lines = playlistContent.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
      const dateTimeStr = trimmedLine
        .replace("#EXT-X-PROGRAM-DATE-TIME:", "")
        .trim();
      const date = new Date(dateTimeStr);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

function extractFirstChunklistUrl(
  masterPlaylistContent: string,
  baseUrl: string
): string | null {
  const lines = masterPlaylistContent.split("\n");
  let foundStreamInfo = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("#EXT-X-STREAM-INF:")) {
      foundStreamInfo = true;
      continue;
    }

    if (foundStreamInfo && !trimmedLine.startsWith("#")) {
      // This is the chunklist URL
      if (trimmedLine.startsWith("http")) {
        return trimmedLine;
      } else {
        // Relative URL, construct absolute URL
        const baseUrlObj = new URL(baseUrl);
        return new URL(
          trimmedLine,
          baseUrlObj.origin +
            baseUrlObj.pathname.substring(
              0,
              baseUrlObj.pathname.lastIndexOf("/")
            )
        ).toString();
      }
    }
  }

  return null;
}

function convertToDvrPlaylistUrl(url: string): string {
  return url.replace("playlist.m3u8", "playlist_fmp4_dvr.m3u8");
}

async function getStartDateFromHlsUrl(url: string): Promise<Date | null> {
  try {
    const dvrUrl = convertToDvrPlaylistUrl(url);
    console.log("Converting to DVR URL:", dvrUrl);

    const masterResponse = await fetch(dvrUrl);
    if (!masterResponse.ok) {
      throw new Error(
        `Failed to fetch master playlist: ${masterResponse.status} ${masterResponse.statusText}`
      );
    }

    const masterPlaylistContent = await masterResponse.text();
    const chunklistUrl = extractFirstChunklistUrl(
      masterPlaylistContent,
      dvrUrl
    );

    if (!chunklistUrl) {
      throw new Error("No chunklist URL found in master playlist");
    }

    console.log("Found chunklist URL:", chunklistUrl);

    const chunklistResponse = await fetch(chunklistUrl);
    if (!chunklistResponse.ok) {
      throw new Error(
        `Failed to fetch chunklist: ${chunklistResponse.status} ${chunklistResponse.statusText}`
      );
    }

    const chunklistContent = await chunklistResponse.text();
    const startTime = extractStartTimeFromPlaylist(chunklistContent);

    if (startTime) {
      console.log("Successfully detected start time:", startTime.toISOString());
    } else {
      console.log(" No start time found in chunklist");
    }

    return startTime;
  } catch (error) {
    console.error("Error getting start time from HLS URL:", error);
    return null;
  }
}

export { getStartDateFromHlsUrl };
