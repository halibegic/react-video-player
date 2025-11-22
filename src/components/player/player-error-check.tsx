import {
  PlayerNotice,
  PlayerNoticeClassName,
  PlayerNoticeText,
  PlayerNoticeTextClassName,
  PlayerNoticeTitle,
  PlayerNoticeTitleClassName,
} from "@/components/player/ui/player-notice.styles";
import { usePlayerStore } from "@/stores/player-store";

function PlayerErrorNotice() {
  const error = usePlayerStore((s) => s.error);

  if (!error) return null;

  return (
    <div className={PlayerNoticeClassName}>
      <h3 className={PlayerNoticeTitleClassName}>{error.message}</h3>
      {error.code ? (
        <p className={PlayerNoticeTextClassName}>Code: {error.code}</p>
      ) : null}
      {error.tech ? (
        <p className={PlayerNoticeTextClassName}>Engine: {error.tech}</p>
      ) : null}
    </div>
  );
}

export { PlayerErrorNotice };
