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

| Prop        | Type                                     | Description                                             | Default |
| ----------- | ---------------------------------------- | ------------------------------------------------------- | ------- |
| `url`       | `string`                                 | The vod stream URL                                      | -       |
| `startTime` | `number`                                 | (Optional) Start time in seconds to begin playback from | -       |
| `onEvent`   | `(event: string, data: unknown) => void` | (Optional) Event handler callback for player events     | -       |

**Example with `startTime`:**

```tsx
import { VodPlayer } from "@halibegic/react-video-player";

function App() {
  return <VodPlayer url="https://example.com/vod.m3u8" startTime={10} />;
}
```

### Live Player

```tsx
import { LivePlayer } from "@halibegic/react-video-player";

function App() {
  return (
    <LivePlayer
      url="https://example.com/live.m3u8"
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

| Prop       | Type                                                                                             | Description                                                                                | Default                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`      | `string`                                                                                         | The live stream URL                                                                        | -                                                                                                                                              |
| `onEvent`  | `(event: string, data: unknown) => void`                                                         | (Optional) Event handler callback for player events                                        | -                                                                                                                                              |
| `messages` | `{ eventNotStarted: string; eventFinished: string; eventStartingSoon?: string; live?: string; }` | (Optional) Custom messages for event not started, finished, starting soon, and live states | `{ eventNotStarted: "Event has not started yet.", eventFinished: "Event has finished.", eventStartingSoon: "Starting soon...", live: "Live" }` |

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

## Events

Both `VodPlayer` and `LivePlayer` support event handling through the `onEvent` prop. This allows you to listen to various player events and respond accordingly.

### Event Types

| Event Name         | Data Type                                   | Description                                           |
| ------------------ | ------------------------------------------- | ----------------------------------------------------- |
| `play`             | `void`                                      | Fired when playback starts                            |
| `pause`            | `void`                                      | Fired when playback is paused                         |
| `ended`            | `void`                                      | Fired when playback reaches the end                   |
| `seeking`          | `void`                                      | Fired when seeking starts                             |
| `seeked`           | `void`                                      | Fired when seeking is complete                        |
| `timeUpdate`       | `{ currentTime: number; duration: number }` | Fired during playback with current time and duration  |
| `volumeChange`     | `{ volume: number }`                        | Fired when volume changes (0-1)                       |
| `fullscreenChange` | `{ isFullscreen: boolean }`                 | Fired when fullscreen mode changes                    |
| `qualityChange`    | `{ level: number \| null }`                 | Fired when video quality changes                      |
| `loadedMetadata`   | `{ duration: number }`                      | Fired when video metadata is loaded                   |
| `loadStart`        | `void`                                      | Fired when loading starts                             |
| `playing`          | `void`                                      | Fired when playback actually starts (after buffering) |
| `waiting`          | `void`                                      | Fired when playback is waiting for data               |
| `error`            | `unknown`                                   | Fired when an error occurs                            |

### Usage Examples

#### VOD Player with Events

```tsx
import { VodPlayer } from "@halibegic/react-video-player";

function App() {
  const handlePlayerEvent = (event: string, data: unknown) => {
    switch (event) {
      case "play":
        console.log("Play");
        break;
      case "pause":
        console.log("Pause");
        break;
      case "timeUpdate":
        const { currentTime, duration } = data as {
          currentTime: number;
          duration: number;
        };
        console.log(
          `Progress: ${((currentTime / duration) * 100).toFixed(1)}%`
        );
        break;
      case "volumeChange":
        const { volume } = data as { volume: number };
        console.log(`Volume changed to: ${(volume * 100).toFixed(0)}%`);
        break;
      case "fullscreenChange":
        const { isFullscreen } = data as { isFullscreen: boolean };
        console.log(`Fullscreen: ${isFullscreen ? "ON" : "OFF"}`);
        break;
      case "error":
        console.error("Player error:", data);
        break;
    }
  };

  return (
    <VodPlayer url="https://example.com/vod.m3u8" onEvent={handlePlayerEvent} />
  );
}
```

#### Live Player with Events

```tsx
import { LivePlayer } from "@halibegic/react-video-player";

function App() {
  const handlePlayerEvent = (event: string, data: unknown) => {
    switch (event) {
      case "play":
        console.log("Play");
        break;
      case "pause":
        console.log("Pause");
        break;
    }
  };

  return (
    <LivePlayer
      url="https://example.com/live.m3u8"
      onEvent={handlePlayerEvent}
    />
  );
}
```

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
