import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the built files work from any path or domain Houstory chooses.
export default defineConfig({ plugins: [react()], base: "./" });
