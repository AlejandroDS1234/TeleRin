import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.riv"],
  server: {
    port: 4210,
    host: true,
    allowedHosts: ["sustainable-portion-calculate-mem.trycloudflare.com"],
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
