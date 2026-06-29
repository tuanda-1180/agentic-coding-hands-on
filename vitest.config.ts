import { defineConfig } from "vitest/config";
import path from "path";

// Scope tests to the application source only. Without this, vitest globs the whole
// repository and picks up the Takumi kit's own hook tests under `.claude/`, which are
// unrelated to this app and use a different (non-vitest) harness.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".claude/**", ".next/**"],
  },
});
