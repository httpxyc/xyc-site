import { createBrowserRouter } from 'react-router-dom';
import Demo from './pages/demo/page';
import ReactLoadable from 'react-loadable';
import React, { type ReactNode } from 'react';

interface routeItem {
  path: string;
  element: ReactNode;
  hasDone: boolean;
  children?: routeItem[];
}
export const createRouter = (paths) => {
  console.log(paths);
  const rowList: routeItem[] = Object.keys(paths).map(key=>{
    const Ele = ReactLoadable({
      loader: paths[key],
      loading: () => <div>loading...</div>,
    });
    console.log(paths[key]());
    return {
      // 把字符串key，去除前缀/src/pages/，去除后缀/page.tsx
      path: key.replace(/^\/src\/pages\//, '').replace(/\/page\.tsx$/, ''),
      element: <Ele />,
      // element: ReactLoadable({
      //   loader: paths[key],
      //   loading: () => <div>loading...</div>,
      // }),
      hasDone: false,
    };
  });
  let resList: routeItem[] = [];
  rowList.forEach(item=>{
    let accurateItem = undefined;
    let accurateLenth = -1;
    rowList.forEach(innerItem=>{
      if (innerItem?.path === item.path) return;
      const len = item?.path?.indexOf(innerItem?.path);
      if (len > accurateLenth) {
        accurateItem = innerItem;
        accurateLenth = len;
      }
    });
    if (!accurateItem) {
      resList.push(item);
      // 标记为已经处理过
      item.hasDone = true;
    } else {
      !accurateItem.hasOwnProperty('children') ? accurateItem.children = [] : null;
      item.path = item.path.replace(`${accurateItem.path}/`, '');
      accurateItem.children.push(item);
      // 标记为已经处理过
      item.hasDone = true;
    }
  });
  rowList.forEach(item=>{
    if (!item.hasDone) {
      resList.push(item);
    }
  });
  // resList.push({
  //   path: '*',
  //   element: <div>404</div>,
  //   hasDone: true,
  // });
  resList.push({
    path: '/',
    element: <div>Home</div>,
    hasDone: true,
  });

  console.log(rowList, resList);
  const router = createBrowserRouter(resList);
  return router;
};
