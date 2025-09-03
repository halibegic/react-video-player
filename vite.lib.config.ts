import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
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
      external: ["react", "react-dom", "hls.js", "dashjs"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "hls.js": "Hls",
          dashjs: "dashjs",
        },
      },
    },
    target: "es2020",
    sourcemap: true,
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["react", "react-dom"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
