module.exports = {
  root: true,
  extends: ['@mozartchen/eslint-config'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@mozartchen/eslint-config/react', '@mozartchen/eslint-config/typescript'],
      // 有这个，才能正确解析ts类型文件，告诉解析器ts配置文件位置，不然ts/tsx文件的开头会报parsing error: Cannot read file '...../tsconfig.json'错误
      parserOptions: {
        tsconfigRootDir: __dirname,
        tsx: true,
      },
    },
  ],
}