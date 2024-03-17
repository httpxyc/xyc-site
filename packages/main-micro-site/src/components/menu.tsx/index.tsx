import { Menu, type MenuProps } from 'antd';
import React from 'react';
import { menuList } from './config';
import { useNavigate } from 'react-router-dom';

export function MenuContainer() {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    navigate(e?.keyPath?.reverse()?.join('/') || '/');
    // navigate
  };

  return (
    <Menu items={menuList} onClick={onClick} style={{ height: '100%' }} mode="inline" defaultOpenKeys={menuList?.map(item=>item?.key) as string[] ?? []} />
  );
}
