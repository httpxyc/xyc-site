import { Menu, type MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { menuList } from './config';
import { useLocation, useNavigate } from 'react-router-dom';

export function MenuContainer() {
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>();
  const navigate = useNavigate();
  // 获取路由path
  const location = useLocation();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    // navigate(e?.keyPath?.reverse()?.join('/') || '/');
    // navigate
  };

  useEffect(()=>{
    let pathArr = location.pathname.split('/');
    let key = pathArr?.[pathArr?.length - 1];
    console.log('key:', key);
    setDefaultActiveKey(key || 'home');
  }, [location]);

  return defaultActiveKey && (
    <Menu defaultSelectedKeys={[defaultActiveKey]} items={menuList} onClick={onClick} style={{ height: '100%' }} mode="inline" defaultOpenKeys={menuList?.map(item=>item?.key) as string[] ?? []} />
  );
}
