module.exports = {
  env: {
    commonjs: true,
    jest: true,
    node: true
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/no-var-requires": "warn"
  }
};
