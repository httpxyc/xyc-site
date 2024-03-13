import React from 'react';
import { Outlet } from 'react-router-dom';

function Demo() {
  return (
    <div>
      page
      <Outlet />
    </div>
  );
}

export default Demo;
