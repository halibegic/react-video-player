import { PlayerEvents } from "@/types/player";
import mitt, { type Emitter } from "mitt";

const createPlayerEventEmitter = (): Emitter<PlayerEvents> => {
  return mitt<PlayerEvents>();
};

export { createPlayerEventEmitter };
export type { PlayerEvents };
