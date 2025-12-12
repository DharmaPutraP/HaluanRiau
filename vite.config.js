import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.47:81",
        changeOrigin: true,
        rewrite: (path) => {
          // Handle search separately
          if (path.startsWith("/api/search/")) {
            return path.replace(/^\/api/, "");
          }
          // Default: rewrite /api to /berita
          return path.replace(/^\/api/, "/berita");
        },
      },
      "/foto": {
        target: "http://192.168.1.47:81",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
