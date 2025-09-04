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
        "hls.js",
        "dashjs",
        "zustand",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-slider",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "hls.js": "Hls",
          dashjs: "dashjs",
          zustand: "zustand",
          "@radix-ui/react-dropdown-menu": "RadixUIDropdownMenu",
          "@radix-ui/react-slider": "RadixUISlider",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["react", "react-dom"],
  },
});
