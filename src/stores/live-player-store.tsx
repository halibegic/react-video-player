import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";

type State = {
  delay: number;
  startDate: Date;
  startTime: number;
};

type Actions = {
  setDelay: (delay: number) => void;
  setStartDate: (startDate: Date) => void;
};

type LivePlayerStore = State & Actions;

const createLivePlayerStore = (startDate: Date) =>
  create<LivePlayerStore>((set) => ({
    delay: 0,
    startDate,
    startTime: startDate.getTime(),
    setDelay: (delay) => set({ delay }),
    setStartDate: (startDate) => set({ startDate }),
  }));

const LivePlayerStoreContext = createContext<StoreApi<LivePlayerStore> | null>(
  null
);

type LivePlayerStoreProviderProps = PropsWithChildren & {
  startDate: Date;
};

const LivePlayerStoreProvider = ({
  children,
  startDate,
}: LivePlayerStoreProviderProps) => {
  const storeRef = useRef<ReturnType<typeof createLivePlayerStore> | null>(
    null
  );

  if (!storeRef.current) storeRef.current = createLivePlayerStore(startDate);

  return (
    <LivePlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </LivePlayerStoreContext.Provider>
  );
};

const useLivePlayerStore = <T,>(selector: (state: LivePlayerStore) => T): T => {
  const store = useContext(LivePlayerStoreContext);

  if (!store)
    throw new Error("usePlayerStore must be used within PlayerStoreProvider");

  return useStore(store, selector);
};

// eslint-disable-next-line react-refresh/only-export-components
export { LivePlayerStoreProvider, useLivePlayerStore };
