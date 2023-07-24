import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { ViteAliases } from "vite-aliases";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), ViteAliases({ prefix: "@" })],
});
