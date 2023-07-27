import { defineConfig } from "vite";
import { resolve } from "path";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.tsx"),
      name: "CounterPlugin",
      // the proper extensions will be added
      fileName: "index",
    },
  },
});
