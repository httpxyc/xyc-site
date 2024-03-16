# `@mozartchen/create-router`

> TODO: 自动生成路由配置list

## Usage

### react使用

commonjs引用：

```js
const createRouter = require('@mozartchen/create-router/react');
```

esmodule方式引用：

```js
import createRoutes from '@mozartchen/create-router/react';
```

结合ts和vite的import.meta.glob食用更佳

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import createRoutes, { CustomerRouteProps, PathsType } from '@mozartchen/create-router/react';

const routes:CustomerRouteProps[] = createRoutes(import.meta.glob('/src/pages/**/page.tsx') as PathsType);
const router = createBrowserRouter(routes);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
);
```

### vue使用(to do)

commonjs引用：

```js
const createRouter = require('@mozartchen/create-router/vue');
```

esmodule方式引用：

```js
import createRoutes from '@mozartchen/create-router/vue';
```

### 

## Question
```shell
npx babel --presets @babel/preset-react src/react/require.jsx -o ./lib/react/require.js && npx babel --presets @babel/preset-react src/react/module.jsx -o ./lib/react/module.js
```
require.jsx是commonjs模式，module.jsx是esmodule模式，但是使用babel编译完，各自结果保留各自的模式，猜想是--presets @babel/preset-react对jsx类型文件做了保留格式的适配

```shell
tsc --module esnext --target esnext --outDir ./lib/react --jsx react
```

使用ts编译，虽然指定了ts编译生成的文件是esmodule模式的，但是编译完发现commonjs模式的文件还是commonjs的，也就是说tsc编译对jsx类型也做了语法适配？（很有可能--jsx react也是用的babel来编译的，babel编译适配了，它肯定也适配了）

## Summary

### babel编译jsx文件

需要安装@babel/cli、@babel/core、@babel/preset-react全家桶
