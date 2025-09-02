import { PlayerProvider } from "@/components/player/player-provider";
import { PlayerTech } from "@/components/player/player-tech";
import { PlayerFullscreen } from "@/components/player/ui/player-fullscreen";
import { PlayerLoading } from "@/components/player/ui/player-loading";
import { usePlayerStore } from "@/stores/player-store";

type LivePlayerProps = {
  url: string;
};

function LivePlayer(props: LivePlayerProps) {
  return (
    <PlayerProvider>
      <Player {...props} />
    </PlayerProvider>
  );
}

function Player({ url }: LivePlayerProps) {
  const containerRef = usePlayerStore((s) => s.containerRef);

  return (
    <div
      className="dark text-foreground absolute inset-0 size-full overflow-hidden bg-black"
      ref={containerRef}
    >
      <PlayerTech url={url} isLive={true} />
      <PlayerLoading />
      <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/60 pt-4 md:pt-8">
        <div className="flex h-14 flex-col px-2 leading-none text-[0] md:h-16 md:px-4">
          <div className="my-auto flex w-full items-center">
            <div className="flex flex-1 items-center justify-start md:gap-2"></div>
            <div className="flex flex-1 items-center justify-center md:gap-2"></div>
            <div className="flex flex-1 items-center justify-end md:gap-2">
              <PlayerFullscreen />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LivePlayer };
export type { LivePlayerProps };
