---
group: 业务组件
---
# SearchTree（搜索tree）

结合了antd的tree组件，和input组件，可以搜索树节点，并高亮展示搜索结果。
```tsx
import { SearchTree } from '@mozartchen/react-components';

const treeData = [
  {
    title: 'Navigation One',
    key: '0-0',
    children: [
      {
        title: 'Item 0-0',
        key: '0-0-0',
      },
      {
        title: 'Item 0-1',
        key: '0-0-1',
      },
    ],
  },
  {
    title: 'Navigation Two',
    key: '0-1',
    children: [
      {
        title: 'Item 0-0',
        key: '0-1-0',
      },
      {
        title: 'Item 0-1',
        key: '0-1-1',
      },
    ],
  }
]

export default () => <SearchTree treeData={treeData}/>
```
