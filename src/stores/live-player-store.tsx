import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";

type State = {
  delay: number;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
};

type Actions = {
  setDelay: (delay: number) => void;
  setStartDate: (startDate: Date) => void;
  setEndDate: (endDate: Date) => void;
};

type LivePlayerStore = State & Actions;

const createLivePlayerStore = (startDate: Date, endDate: Date) =>
  create<LivePlayerStore>((set) => ({
    delay: 0,
    startDate,
    endDate,
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
    setDelay: (delay) => set({ delay }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
  }));

const LivePlayerStoreContext = createContext<StoreApi<LivePlayerStore> | null>(
  null
);

type LivePlayerStoreProviderProps = PropsWithChildren & {
  startDate: Date;
  endDate: Date;
};

const LivePlayerStoreProvider = ({
  children,
  startDate,
  endDate,
}: LivePlayerStoreProviderProps) => {
  const storeRef = useRef<ReturnType<typeof createLivePlayerStore> | null>(
    null
  );

  if (!storeRef.current)
    storeRef.current = createLivePlayerStore(startDate, endDate);

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
