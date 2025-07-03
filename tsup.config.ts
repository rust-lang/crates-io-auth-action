import { defineConfig } from "tsup";

let chunkNumber = 0;

export default defineConfig({
    entry: ["src/main.ts", "src/post.ts"],
    format: ["cjs"],
    outDir: "dist",
    outExtension() {
        return { js: `.js` };
    },
    target: "node20",
    clean: true,
    splitting: true,
    esbuildOptions(options) {
        options.chunkNames = `[name]${++chunkNumber}`;
    },
});
