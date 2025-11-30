import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next"; // <<< IMPORTA O PLUGIN

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "@next/next": nextPlugin, // <<< REGISTRA O PLUGIN PARA PARAR OS ERROS
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
    },
  },

  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "out/**"
    ]
  }
];