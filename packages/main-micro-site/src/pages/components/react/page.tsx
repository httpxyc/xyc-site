import React, { useEffect, useState } from 'react';
import classes from './index.module.less';
import WujieReact from 'wujie-react';
import { useNavigate } from 'react-router-dom';

export default function ReactPage() {
  const navigate = useNavigate();

  return (
    <div className={classes.reactContainer}>
      <WujieReact
        width="100%"
        height="100%"
        name="react components"
        url="http://47.106.81.190:8001/components"
        sync
        // fetch="{fetch}"
        // props="{props}"
        // beforeLoad="{beforeLoad}"
        // beforeMount="{beforeMount}"
        // afterMount="{afterMount}"
        // beforeUnmount="{beforeUnmount}"
        // afterUnmount="{afterUnmount}"
      />
    </div>

  );
}
