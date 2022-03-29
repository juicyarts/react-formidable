module.exports = {
  extends: ['@eppendorf/eslint-config/react.typescript', '@eppendorf/eslint-config/jest'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/extensions': [0],
  },
};
