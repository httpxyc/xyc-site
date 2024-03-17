import React from "react";
import loadable from "@loadable/component";
export default function (paths, HomePage) {
    const rowList = Object.keys(paths).map((key) => {
        const Ele = loadable(paths[key]);
        return {
            // 把字符串key，去除前缀/src/pages/，去除后缀/page.tsx
            path: key.replace(/^\/src\/pages\//, '').replace(/\/page\.tsx$/, ''),
            element: React.createElement(Ele, null),
            hasDone: false,
        };
    });
    const resList = [];
    rowList.forEach(item => {
        let accurateItem = undefined;
        let accurateLenth = -1;
        rowList.forEach(innerItem => {
            if (innerItem?.path === item?.path)
                return;
            const len = item?.path?.indexOf(innerItem?.path) ?? -1;
            if (len > accurateLenth) {
                accurateItem = innerItem;
                accurateLenth = len;
            }
        });
        if (!accurateItem) {
            resList.push(item);
            // 标记为已经处理过
            item.hasDone = true;
        }
        else if (accurateItem) {
            !accurateItem.hasOwnProperty('children') ? accurateItem.children = [] : null;
            item.path = item.path.replace(`${accurateItem.path}/`, '');
            accurateItem?.children?.push(item);
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
        element: React.createElement("div", null, "404"),
        hasDone: true,
    });
    if (HomePage) {
        return [
            {
                path: '/',
                element: HomePage,
                hasDone: true,
                children: resList
            }
        ];
    }
    return resList;
}
;
