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
          "@radix-ui/react-dropdown-menu": ["@radix-ui/react-dropdown-menu"],
          "@radix-ui/react-slider": ["@radix-ui/react-slider"],
          hls: ["hls.js"],
          mitt: ["mitt"],
          styled: ["styled-components"],
          zustand: ["zustand"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-slider",
      "hls.js",
      "mitt",
      "styled-components",
      "zustand",
    ],
  },
});
