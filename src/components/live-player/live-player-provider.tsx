import { PlayerProvider } from "@/components/player/player-provider";
import { LivePlayerStoreProvider } from "@/stores/live-player-store";
import { PropsWithChildren } from "react";

function LivePlayerProvider({ children }: PropsWithChildren) {
  return (
    <LivePlayerStoreProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </LivePlayerStoreProvider>
  );
}

export { LivePlayerProvider };
