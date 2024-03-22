import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps,
} from 'vite-plugin-qiankun/dist/helper'


const render = (dom?: HTMLElement)=>{
  return ReactDOM.createRoot(dom??document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}


const initQianKun = () => {
  renderWithQiankun({
    bootstrap() {
      console.log('微应用：bootstrap')
    },
    mount(props) { // 获取主应用传入数据
      console.log('微应用：mount', props)
      render(props?.container.querySelector('#root'))
    },
    unmount(props) {
      console.log('微应用：unmount', props)
    },
    update(props) {
      console.log('微应用：update', props)
    },
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render() // 判断是否使用 qiankun ，保证项目可以独立运行
