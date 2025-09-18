import { PlayerProvider } from "@/components/player/player-provider";
import { LivePlayerStoreProvider } from "@/stores/live-player-store";
import { PropsWithChildren } from "react";

type LivePlayerProviderProps = PropsWithChildren & {
  startDate: Date;
};

function LivePlayerProvider({ children, startDate }: LivePlayerProviderProps) {
  return (
    <LivePlayerStoreProvider startDate={startDate}>
      <PlayerProvider>{children}</PlayerProvider>
    </LivePlayerStoreProvider>
  );
}

export { LivePlayerProvider };
