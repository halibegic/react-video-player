# React Video Player

A React video player supporting HLS / Dash protocol for VOD / live streaming.

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

### Live Player

```tsx
import { LivePlayer } from "@halibegic/react-video-player";

function App() {
  return <LivePlayer url="https://example.com/live.m3u8" />;
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
