const React =require("react");
const loadable = require("@loadable/component");

// ts类型
import { ReactNode } from "react";
export interface PathsType{
    [key:string]: ()=>Promise<ReactNode>
}

export type CustomerRouteProps = {
    hasDone:boolean,
    element:React.ReactNode,
    path:string,
    children?: CustomerRouteProps[]
}
const createRoutes =  function (paths:PathsType):CustomerRouteProps[] {
    const rowList:CustomerRouteProps[] = Object.keys(paths).map((key) => {
        const Ele = loadable(paths[key] as any);
        return {
            // 把字符串key，去除前缀/src/pages/，去除后缀/page.tsx
            path: key.replace(/^\/src\/pages\//, '').replace(/\/page\.tsx$/, ''),
            element: <Ele />,
            hasDone: false,
        };
    });
    const resList:CustomerRouteProps[]  = [];
    rowList.forEach(item => {
        let accurateItem:CustomerRouteProps = undefined as unknown as CustomerRouteProps;
        let accurateLenth = -1;
        rowList.forEach(innerItem => {
            if (innerItem?.path === item?.path) return;
            const len = item?.path?.indexOf(innerItem?.path as string)??-1;
            if (len > accurateLenth) {
                accurateItem = innerItem;
                accurateLenth = len;
            }
        });
        if (!accurateItem) {
            resList.push(item);
            // 标记为已经处理过
            item.hasDone = true;
        } else if(accurateItem){
            !accurateItem.hasOwnProperty('children') ? accurateItem.children = [] : null;
            item.path = (item.path as string).replace(`${accurateItem.path}/`, '');
            (accurateItem?.children as CustomerRouteProps[])?.push(item);
            // 标记为已经处理过
            item.hasDone = true;
        }
    });
    rowList.forEach(item => {
        if (!item.hasDone) {
            resList.push(item);
        }
    });
    resList.push({
        path: '*',
        element: <div>404</div>,
        hasDone: true,
    });
    resList.push({
        path: '/',
        element: <div>Home</div>,
        hasDone: true,
    });
    return resList;
};
module.exports = createRoutes;