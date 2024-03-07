module.exports={
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es2021: true,
    node: true,
  },
  extends:['eslint-config-airbnb-base/rules/style'],
  rules:{
    'prefer-template': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-tabs': 'off',
    'max-len': [
      'error',
      180,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-multi-spaces': 'error',
  }
}