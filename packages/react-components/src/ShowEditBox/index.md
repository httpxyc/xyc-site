---
group: 业务组件
---
# ShowEditBox(列表展示及编辑)

```tsx
import { ShowEditBox } from '@mozartchen/react-components';
import { Form, Select, Input } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const config = [
    {
      props: {
        label: '项目',
        name: 'project',
      },
      render: (
        <Select placeholder="请选择项目" labelInValue allowClear options={[{label: '项目1', value: '1'},{label: '项目2', value: '2'}]}/>
      ),
      showRender: {
        leftName: '项目',
        rightValueFommat: (obj)=> obj ? obj.label : '',
      },
    },
    {
      props: {
        label: '城市',
        name: 'city',
      },
      render: (
        <Input placeholder="请输入城市" />
      ),
      showRender: {
        leftName: '城市',
        // rightValueFommat: (obj)=> obj ? obj.label : '',
      },
    },
  ]
  const onSave = async()=>{
    console.log('onSave')
  }
  const onEditCancel = async()=>{
    console.log('onEditCancel')
  }
  return <ShowEditBox
    onSave={onSave}
    onEditCancel={onEditCancel}
    formProps={{ /* labelWrap: true, colon: false,  */labelAlign: 'right' }}
    form={form}
    config={config}
    isEdit={edit}
    title='demo'
    setIsEdit={setEdit}
  ></ShowEditBox>
};
export default App;
```