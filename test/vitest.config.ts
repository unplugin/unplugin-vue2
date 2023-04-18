/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // Big enough?!
    testTimeout: 100000,
    hookTimeout: 100000,
  },
});
