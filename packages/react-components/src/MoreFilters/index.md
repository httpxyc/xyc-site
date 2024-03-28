---
group: 业务组件
---
# MoreFilters(筛选)

根据提供的表单items构成的config列表，生成筛选条件，集成更多筛选、localstorage缓存记忆和下方筛选项控制展示功能

注意点：

1. 和`ahooks`的`useTable`一起使用的时候，不能将`form`注入，不然初始化的时候，由于**`useTable`的回调方法（异步的）**和**组件中从`localstorage`里面初始化值的逻辑**是同步进行的，有可能会存在`useTable`中的回调触发的时候，`async`修辞的异步回调方法开始执行，**同时**会开始执行后续同步任务（没有`await`，所以不会阻塞后续任务执行），有可能回调执行到内部从`useTable`的第二个回调参数的`formData`字段取值的时候，组件初始化逻辑还未进行完，所以会取不到正确的初始化`form`值，所以使用`useTable`的时候不注入`form`属性，在请求前通过第二点的方式取到`params`
2. 在所有需要获取`form`的值的地方，要使用`form.getFieldsValue(true)`，手动获取`form`值
3. 由于外侧`form.setField..`方法不会触发**筛选子组件**的`Form`的`onValuesChange`事件，所以该组件无法监听到`form`值变化，从而刷新根据`form`值生成的下方筛选展示`line`对应的`dom`渲染，所以组件提供了`ref.refresh`方法，用于外部手动刷新筛选组件下方的展示`line`内容

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