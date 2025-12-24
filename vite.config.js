import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Build optimizations
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },

    // Code splitting optimization
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          utils: [
            "./src/utils/analytics.js",
            "./src/utils/sanitizer.js",
            "./src/utils/tiktokParser.js",
          ],
        },
        // Better file naming for caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },

    // Chunk size warning limit
    chunkSizeWarningLimit: 600,

    // Source maps for production debugging (disable for smaller builds)
    sourcemap: false,
  },

  // Server configuration
  server: {
    proxy: {
      "/api": {
        target: "https://assets.riaumandiri.co",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api/, "");
        },
      },
      "/foto": {
        target: "https://assets.riaumandiri.co",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
