import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerMicroApps, start } from 'qiankun';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

registerMicroApps([
  {
    name: 'react components', // app name registered
    entry: '//localhost:5174',
    container: '#react-components',
    activeRule: '/react-components',
  },
]);

start();