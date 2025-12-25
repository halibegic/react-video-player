import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";

type State = {
  delay: number;
  startDate: Date | null;
  viewerCount: number | null;
};

type Actions = {
  setDelay: (delay: number) => void;
  setStartDate: (startDate: Date) => void;
  setViewerCount: (count: number | null) => void;
};

type LivePlayerStore = State & Actions;

const createLivePlayerStore = () =>
  create<LivePlayerStore>((set) => ({
    delay: 0,
    startDate: null,
    viewerCount: null,
    setDelay: (delay) => set({ delay }),
    setStartDate: (startDate) => set({ startDate }),
    setViewerCount: (viewerCount) => set({ viewerCount }),
  }));

const LivePlayerStoreContext = createContext<StoreApi<LivePlayerStore> | null>(
  null
);

const LivePlayerStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<ReturnType<typeof createLivePlayerStore> | null>(
    null
  );

  if (!storeRef.current) storeRef.current = createLivePlayerStore();

  return (
    <LivePlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </LivePlayerStoreContext.Provider>
  );
};

const useLivePlayerStore = <T,>(selector: (state: LivePlayerStore) => T): T => {
  const store = useContext(LivePlayerStoreContext);

  if (!store)
    throw new Error(
      "useLivePlayerStore must be used within PlayerStoreProvider"
    );

  return useStore(store, selector);
};

// eslint-disable-next-line react-refresh/only-export-components
export { LivePlayerStoreProvider, useLivePlayerStore };
