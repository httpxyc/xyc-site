import React, { useEffect, useState } from 'react';
import classes from './index.module.less';
import { loadMicroApp } from 'qiankun';
export default function ReactPage() {
  useEffect(()=>{
    loadMicroApp({
      name: 'react components', // app name registered
      entry: '//localhost:5174',
      container: '#reactContainer',
    });
  }, []);
  return (
    <div id="reactContainer" className={classes.reactContainer} />
  );
}
