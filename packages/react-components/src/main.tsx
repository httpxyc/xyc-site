import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'


const renderApp = (dom?: HTMLElement)=>{
  return ReactDOM.createRoot(dom??document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = renderApp;
  // window.__WUJIE_UNMOUNT = destroyApp;
  // // Vite 需要主动调用 wujie 的渲染函数
  window.__WUJIE.mount();
} else {
  renderApp();
}
