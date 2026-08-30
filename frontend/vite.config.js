import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies API calls to the Django backend during development so the
// browser never has to deal with CORS, and the frontend can simply
// call relative paths like `/api/v1/...`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
