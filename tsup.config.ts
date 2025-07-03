import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/main.ts", "src/post.ts"],
    format: ["cjs"],
    outDir: "dist",
    outExtension() {
        return { js: `.js` };
    },
    target: "node20",
    clean: true,
});
