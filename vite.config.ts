import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @vitejs/plugin-react is built-in in Vite v5 via react-swc, but this keeps it explicit.

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" }
});
