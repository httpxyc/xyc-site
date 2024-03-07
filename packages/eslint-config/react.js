module.exports = {
  plugins: ['react-hooks'],
  extends: ['eslint-config-airbnb/rules/react'],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-no-constructed-context-values': 'off',
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    // 检查 Hooks 的使用规则
    'react-hooks/rules-of-hooks': 'error',
    // 检查依赖项的声明
    'react-hooks/exhaustive-deps': 'warn',
    // 这条需要关闭，因为会和 react/jsx-indent 这条规则冲突
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-key': 'error',
  },
};