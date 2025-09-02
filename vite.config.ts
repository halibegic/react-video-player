import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          hls: ["hls.js"],
          dash: ["dashjs"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "hls.js", "dashjs"],
  },
});
