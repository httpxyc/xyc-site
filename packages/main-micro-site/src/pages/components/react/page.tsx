import React, { useEffect, useState } from 'react';
import classes from './index.module.less';
import WujieReact from 'wujie-react';

export default function ReactPage() {
  return (
    <WujieReact
      width="100%"
      height="100%"
      name="react components"
      url="http://localhost:5173/"
      sync
      // fetch="{fetch}"
      // props="{props}"
      // beforeLoad="{beforeLoad}"
      // beforeMount="{beforeMount}"
      // afterMount="{afterMount}"
      // beforeUnmount="{beforeUnmount}"
      // afterUnmount="{afterUnmount}"
    />

  );
}
