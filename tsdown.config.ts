import { defineConfig } from "tsdown";

let chunkNumber = 0;

export default defineConfig({
    entry: ["src/main.ts", "src/post.ts"],
    format: ["esm"],
    outDir: "dist",
    platform: "node",
    target: "node24",
    clean: true,
    deps: {
        onlyBundle: false,
    },
    outputOptions: {
        chunkFileNames: (_) => `chunk${++chunkNumber}.js`,
        entryFileNames: "[name].js",
    },
});
