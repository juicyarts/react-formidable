module.exports = {
  extends: ['@eppendorf/eslint-config/jest', '@eppendorf/eslint-config/react.typescript'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/extensions': [0],
  },
};
