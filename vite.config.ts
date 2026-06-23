import { defineConfig } from "vite";

export default defineConfig({
  base: "/sutra-progress-web/",
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
