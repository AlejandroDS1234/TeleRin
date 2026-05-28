import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4210,
    host: true,
    watch: {
      usePolling: true, // ← Agregar esto
    },
    proxy: {
      "/api": {
        target: "http://telerin:1240",
        changeOrigin: true,
      },
    },
  },
});
