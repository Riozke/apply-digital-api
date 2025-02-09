{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "import/no-unresolved": "error",
        "import/no-extraneous-dependencies": "error",
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "no-console": "warn",
        "prefer-const": "error",
        "eqeqeq": ["error", "always"],
        "curly": ["error", "all"]
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["plugin:@typescript-eslint/recommended"],
      "parserOptions": {
        "project": "./tsconfig.json"
      },
      "rules": {
        "@typescript-eslint/no-extra-semi": "error",
        "no-extra-semi": "off",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/no-unused-vars": "warn"
      }
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["eslint:recommended"],
      "rules": {
        "no-extra-semi": "error",
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "no-console": "warn",
        "prefer-const": "error"
      }
    },
    {
      "files": ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
      "env": {
        "jest": true
      },
      "rules": {
        "no-unused-expressions": "off",
        "jest/no-focused-tests": "warn"
      }
    },
    {
      "files": "*.json",
      "parser": "jsonc-eslint-parser",
      "rules": {}
    }
  ]
}
