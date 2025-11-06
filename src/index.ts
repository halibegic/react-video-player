// Promise polyfill for older browsers
import "promise-polyfill/src/polyfill";

import { LivePlayer, type LivePlayerProps } from "./components/live-player";
import { VodPlayer, type VodPlayerProps } from "./components/vod-player";

export { LivePlayer, VodPlayer };
export type { LivePlayerProps, VodPlayerProps };
