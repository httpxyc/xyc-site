import { type MenuProps } from 'antd';
import {
  AppstoreOutlined, BankOutlined, HomeOutlined, InsertRowRightOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

export const menuList: MenuItem[] = [
  {
    label: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: '组件库',
    key: 'components',
    icon: <InsertRowRightOutlined />,
    children: [
      {
        label: 'react组件库',
        key: 'react',
      },
      {
        label: 'vue组件库',
        key: 'vue',
      },
    ],
  },
  {
    label: 'npm配置包',
    key: 'npm-packages',
    icon: <AppstoreOutlined />,
  },
  {
    label: '学习总结',
    key: 'study-summary',
    icon: <BankOutlined />,
  },
  {
    label: 'demo',
    key: 'demo',
    children: [
      {
        label: 'demo-children',
        key: 'demo-children',
      },
    ],
  },
];
