import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true
  }
});

