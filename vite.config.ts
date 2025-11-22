import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ["chrome62", "es2017"],
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
          emotion: ["@emotion/react", "@emotion/styled"],
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
      "@emotion/react",
      "@emotion/styled",
      "zustand",
    ],
  },
});
