import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
// import { registerMicroApps, start } from 'qiankun';
import App from './App.tsx';
import { createRouter } from './create-router.tsx';

const router = createRouter(import.meta.glob('/src/pages/**/page.tsx'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
);

// registerMicroApps([
//   {
//     name: 'react components', // app name registered
//     entry: '//localhost:5174',
//     container: '#react-components',
//     activeRule: '/react-components',
//   },
// ]);

// start();
