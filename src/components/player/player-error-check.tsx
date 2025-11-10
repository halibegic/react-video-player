import {
  PlayerNotice,
  PlayerNoticeText,
  PlayerNoticeTitle,
} from "@/components/player/ui/player-notice.styles";
import { usePlayerStore } from "@/stores/player-store";

function PlayerErrorNotice() {
  const error = usePlayerStore((s) => s.error);

  if (!error) return null;

  return (
    <PlayerNotice>
      <PlayerNoticeTitle>{error.message}</PlayerNoticeTitle>
      <PlayerNoticeText>Code: {error.code}</PlayerNoticeText>
    </PlayerNotice>
  );
}

export { PlayerErrorNotice };
