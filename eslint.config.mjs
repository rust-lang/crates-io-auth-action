import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const esLintProject = {
    project: ["tsconfig.eslint.json"],
};

/* eslint-disable  @typescript-eslint/naming-convention */
export default defineConfig([
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strict,
    ...tseslint.configs.strictTypeChecked,
    {
        ignores: ["**/dist", "**/node_modules", "tsdown.config.ts"],
    },
    {
        files: ["src/**/*.ts", "*.mjs"],
        languageOptions: {
            globals: globals.node,
            // This enables type-aware linting
            parserOptions: {
                ...esLintProject,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-call": "error",
            "@typescript-eslint/no-unsafe-member-access": "error",
            "@typescript-eslint/no-unsafe-return": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/naming-convention": "error",
            "@typescript-eslint/sort-type-constituents": "error",
            "@typescript-eslint/no-confusing-void-expression": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            curly: "error",
            eqeqeq: "error",
            "no-throw-literal": "error",
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    ...esLintProject,
                },
            },
        },
    },
]);
