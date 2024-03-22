import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import createRoutes, { type CustomerRouteProps, type PathsType } from '@mozartchen/create-router/react';
import { registerMicroApps, start } from 'qiankun';

const routes: CustomerRouteProps[] = createRoutes(import.meta.glob('/src/pages/**/page.tsx') as PathsType, <App />);
const router = createBrowserRouter(routes);
console.log('routes:', routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// registerMicroApps([
//   {
//     name: 'react components', // app name registered
//     entry: '//localhost:5173',
//     container: '#reactContainer',
//     activeRule: '/components/react',
//   },
// ]);

// start();
