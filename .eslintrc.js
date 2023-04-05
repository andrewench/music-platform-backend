module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "semi": "off",
    "no-extra-semi": "off",
    "comma-dangle": "off",
    "arrow-body-style": "off",
    "consistent-return": "off",
    "no-shadow": "off",
    'import/no-unresolved': "off",

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/triple-slash-reference": ["warn", {
      "lib": "always",
      "path": "always",
      "types": "always"
      }
    ],
    "@typescript-eslint/consistent-type-assertions": ["warn", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow"
    }]
  },
};
