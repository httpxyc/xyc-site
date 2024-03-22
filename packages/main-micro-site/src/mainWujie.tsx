import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import createRoutes, { type CustomerRouteProps, type PathsType } from '@mozartchen/create-router/react';

const routes: CustomerRouteProps[] = createRoutes(import.meta.glob('/src/pages/**/page.tsx') as PathsType, <App />);
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
