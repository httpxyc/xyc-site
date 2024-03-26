---
group: 业务组件
---
# MoreFilters(筛选)

根据提供的表单items构成的config列表，生成筛选条件，集成更多筛选、localstorage缓存记忆和下方筛选项控制展示功能
```tsx
import { MoreFilters } from '@mozartchen/react-components';
import { Form, Input, Select, DatePicker } from 'antd';
import React,{ useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '本月', value: [dayjs().startOf('month'), dayjs()] },
  { label: '上月', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
  { label: '本年', value: [dayjs().startOf('year'), dayjs()] },
  { label: '上年', value: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')] },
];


const App = () => {
  const [form] = Form.useForm();
  const [sumCount, setSumCount] = useState(0);
  const config = [
    {
      props: {
        label: '关键字',
        name: 'keyword',
        style: {
          margin: 0
        }
      },
      render: (
        <Input placeholder="请输入查询关键字" />
      ),
      lineRender: {
        leftName: '关键字',
      },
      isDefault: true,
    },
    {
      props: {
        label: '项目',
        name: 'project',
        style:{
          margin: 0,
          minWidth: 200,
        }
      },
      render: (
        <Select 
          placeholder="请选择项目" 
          labelInValue 
          allowClear 
          options={[{label: '项目1', value: '1'},{label: '项目2', value: '2'}]}
        />
      ),
      lineRender: {
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
      lineRender: {
        leftName: '城市',
      },
    },
    {
      props: {
        label: '时间选择',
        name: 'time',
        style: {
          width: '100%',
          maxWdith: 250,
          margin: 0
        }
      },
      render: (
        <RangePicker placeholder="请选择" presets={rangePresets} style={{width: '100%'}} />
      ),
      lineRender: {
        leftName: '城市',
        rightValueFommat: (obj)=> obj ? obj.map(item=>item.format('YYYY-MM-DD')).join('~') : '',
      },
      formValueFormat: (obj)=> obj ? obj.map(item=>dayjs(item)) : [],
    },
  ]
  const onSave = async()=>{
    console.log('onSave')
  }
  const onEditCancel = async()=>{
    console.log('onEditCancel')
  }
  return <MoreFilters
    form={form}
    mapKey={'demo'}
    config={config}
    sumCount={sumCount}
    initialFormValues={{
      time: [dayjs().startOf('month'), dayjs()],
    }}
  ></MoreFilters>
};
export default App;
```