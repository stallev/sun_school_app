import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint configuration for Next.js 15.5.9
 * 
 * This configuration uses FlatCompat for compatibility with eslint-config-next
 * which uses the legacy ESLint config format.
 * 
 * Configuration includes:
 * - next/core-web-vitals: Core Web Vitals rules for Next.js
 * - next/typescript: TypeScript-specific rules for Next.js
 * - Custom Next.js-specific rules for App Router, Server Components, and Server Actions
 * 
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
    ],
  },
  {
    rules: {
      // Next.js App Router specific rules (enforced for App Router projects)
      "@next/next/no-html-link-for-pages": "error", // Enforce using Next.js Link component instead of <a> tags
      "@next/next/no-img-element": "warn", // Prefer next/image for optimized images
      "@next/next/no-unwanted-polyfillio": "error", // Prevent unwanted polyfill.io usage
      "@next/next/no-page-custom-font": "warn", // Prefer next/font for font optimization
      
      // Next.js optimization and performance rules
      "@next/next/no-sync-scripts": "error", // Prevent blocking scripts
      "@next/next/no-before-interactive-script-outside-document": "error", // Ensure Script component is used correctly
      "@next/next/no-assign-module-variable": "error", // Prevent module variable assignment conflicts
      
      // Next.js routing and navigation rules
      "@next/next/no-duplicate-head": "error", // Prevent duplicate head elements
      
      // React rules optimized for Next.js App Router
      "react/no-unescaped-entities": "warn", // Allow some HTML entities in JSX
      "react-hooks/exhaustive-deps": "warn", // Warn about missing dependencies in hooks
      
      // TypeScript rules for Next.js projects
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Discourage use of 'any' type
      
      // Next.js Server Components and Pages Router rules
      "@next/next/no-head-import-in-document": "error", // Prevent head import in document (Pages Router)
      
      // Additional Next.js rules for App Router
      "@next/next/no-css-tags": "warn", // Prefer CSS Modules or Tailwind
      "@next/next/no-script-component-in-head": "error", // Ensure Script component is used correctly
    },
  },
];

export default eslintConfig;
