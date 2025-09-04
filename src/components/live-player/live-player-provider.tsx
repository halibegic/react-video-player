import { PlayerProvider } from "@/components/player/player-provider";
import { LivePlayerStoreProvider } from "@/stores/live-player-store";
import { PropsWithChildren } from "react";

type LivePlayerProviderProps = PropsWithChildren & {
  startDate: Date;
  endDate: Date;
};

function LivePlayerProvider({
  children,
  startDate,
  endDate,
}: LivePlayerProviderProps) {
  return (
    <LivePlayerStoreProvider startDate={startDate} endDate={endDate}>
      <PlayerProvider>{children}</PlayerProvider>
    </LivePlayerStoreProvider>
  );
}

export { LivePlayerProvider };
