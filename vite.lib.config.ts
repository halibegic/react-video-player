import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["src/main.tsx", "src/App.tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: ["chrome62", "es2017"],
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactVideoPlayer",
      formats: ["es", "umd"],
      fileName: (format) => `react-video-player.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@radix-ui/react-popover",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-slider",
        "hls.js",
        "mitt",
        "zustand",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@radix-ui/react-popover": "RadixUIPopover",
          "@radix-ui/react-scroll-area": "RadixUIScrollArea",
          "@radix-ui/react-slider": "RadixUISlider",
          "hls.js": "Hls",
          mitt: "Mitt",
          zustand: "zustand",
        },
        assetFileNames: "style.css",
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["react", "react-dom"],
  },
});
