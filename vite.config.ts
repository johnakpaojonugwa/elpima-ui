import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { pageManualChunks } from "./vite-manual-chunks";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const REQUIRED = {
    prod: "VITE_PROD_URL",
    production: "VITE_PROD_URL",
    stage: "VITE_STAGE_URL",
    staging: "VITE_STAGE_URL",
    dev: "VITE_DEV_URL",
    development: "VITE_DEV_URL",
  } as const;

  const activeMode = (env.VITE_MODE || "dev").toLowerCase() as keyof typeof REQUIRED;
  const requiredKey = REQUIRED[activeMode];

  if (requiredKey && !env[requiredKey]) {
    throw new Error(
      `[Elpima build] VITE_MODE="${activeMode}" requires ${requiredKey} to be set.`,
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            return pageManualChunks(id);
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});