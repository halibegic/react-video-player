# React Video Player

A React video player supporting HLS protocol for VOD / live streaming.

## Installation

```bash
npm install @halibegic/react-video-player
```

## Usage

### VOD Player

```tsx
import { VodPlayer } from "@halibegic/react-video-player";

function App() {
  return <VodPlayer url="https://example.com/vod.m3u8" />;
}
```

| Prop           | Type                                        | Description                                                                                       | Default |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| `url`          | `string`                                    | The vod stream URL                                                                                | -       |
| `watchHistory` | `{ enabled: boolean; storageKey: string; }` | (Optional) Enable watch history and specify a **unique** storage key for each vod player instance | -       |

**Example with `watchHistory`:**

```tsx
import { VodPlayer } from "@halibegic/react-video-player";

function App() {
  return (
    <VodPlayer
      url="https://example.com/vod.m3u8"
      watchHistory={{ enabled: true, storageKey: "video-1" }}
    />
  );
}
```

### Live Player

```tsx
import { LivePlayer } from "@halibegic/react-video-player";

function App() {
  return (
    <LivePlayer
      url="https://example.com/live.m3u8"
      startDate="2025-09-03T00:00:00Z"
      endDate="2025-10-03T23:59:59Z"
      messages={{
        eventNotStarted: "Live stream još nije počeo. Molimo pričekajte.",
        eventFinished: "Live stream je završen.",
        eventStartingSoon: "Počinje za nekoliko sekundi...",
        live: "Uživo",
      }}
    />
  );
}
```

| Prop        | Type                                                                                             | Description                                                                                | Default                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | `string`                                                                                         | The live stream URL                                                                        | -                                                                                                                                              |
| `startDate` | `string`                                                                                         | Start date for the live event in ISO 8601 format                                           | -                                                                                                                                              |
| `endDate`   | `string`                                                                                         | End date for the live event in ISO 8601 format                                             | -                                                                                                                                              |
| `messages`  | `{ eventNotStarted: string; eventFinished: string; eventStartingSoon?: string; live?: string; }` | (Optional) Custom messages for event not started, finished, starting soon, and live states | `{ eventNotStarted: "Event has not started yet.", eventFinished: "Event has finished.", eventStartingSoon: "Starting soon...", live: "Live" }` |

**Example with `messages`:**

## Keyboard Shortcuts

The video player supports the following keyboard shortcuts:

| Key               | Action        | Description                   |
| ----------------- | ------------- | ----------------------------- |
| `Space`           | Play/Pause    | Toggle between play and pause |
| `←` (Left Arrow)  | Seek Backward | Jump back 10 seconds          |
| `→` (Right Arrow) | Seek Forward  | Jump forward 10 seconds       |
| `↑` (Up Arrow)    | Volume Up     | Increase volume by 10%        |
| `↓` (Down Arrow)  | Volume Down   | Decrease volume by 10%        |
| `M`               | Mute/Unmute   | Toggle mute (0% ↔ 100%)       |
| `F`               | Fullscreen    | Toggle fullscreen mode        |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Lint code
npm run lint
```

## License

MIT © [halibegic](https://github.com/halibegic)

## Note

This is a closed, private development project.
