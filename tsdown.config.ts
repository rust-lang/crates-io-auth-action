import { defineConfig } from "tsdown";

let chunkNumber = 0;

export default defineConfig({
    entry: ["src/main.ts", "src/post.ts"],
    format: ["cjs"],
    outDir: "dist",
    platform: "node",
    target: "node20",
    inlineOnly: false,
    clean: true,
    outputOptions: {
        chunkFileNames: (_) => `chunk${++chunkNumber}.js`,
        entryFileNames: "[name].js",
    },
});
