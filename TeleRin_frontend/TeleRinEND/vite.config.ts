import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4210,
    host: true,
    allowedHosts: ["a266-2803-e5e0-192b-5000-cd29-7523-eed4-5723.ngrok-free.app"],
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
