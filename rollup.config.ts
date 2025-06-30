// See: https://rollupjs.org/introduction/

import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

function configBlock(filename) {
    return {
        input: `src/${filename}.ts`,
        output: {
            esModule: true,
            file: `dist/${filename}.js`,
            format: "es",
            sourcemap: true,
        },
        plugins: [
            typescript(),
            nodeResolve({ preferBuiltins: true }),
            commonjs(),
        ],
    };
}

const config = [configBlock("main"), configBlock("post")];

export default config;
