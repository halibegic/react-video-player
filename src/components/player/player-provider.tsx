import { PlayerStoreProvider } from "@/stores/player-store";
import type { PropsWithChildren } from "react";

function PlayerProvider({ children }: PropsWithChildren) {
  return <PlayerStoreProvider>{children}</PlayerStoreProvider>;
}

export { PlayerProvider };
