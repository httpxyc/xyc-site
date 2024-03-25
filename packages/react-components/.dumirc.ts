import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'react组件库',
    footer: false,
    logo: false,
    nav: {
      mode: "override",
      value: [
        {
          title: '组件列表',
          link: '/components',
        },
      ]
    }
  },
});
