/**
 * @author xiaoyaochen
 */
import {
  Button, Form, type FormInstance, type FormItemProps, Modal, Space, Row, Col,Drawer,Flex,Checkbox
} from 'antd';
import React, {
  forwardRef, useEffect, useImperativeHandle, useMemo, useState,
} from 'react';
import styled from 'styled-components';

import { colors } from '../../assets/color';
import {
  CloseOutlined, DeleteOutlined, FilterOutlined,SettingOutlined
} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import store from 'store';
import TipsLine from "../../common/tips-line";

const CheckboxGroup = Checkbox.Group;

export interface MixcFilterItem {
  props: FormItemProps;
  render: React.ReactNode;
  // 取localstorage值时的前置处理
  formValueFormat?: (value: any) => any;
  // 下方展示结果
  lineRender?: {
    // 左侧名称，默认取props.label
    leftName?: string | React.ReactNode;
    // 右侧展示值格式化方法，value为表单项对应值
    rightValueFommat?: (value: any) => string;
  };
  isHide?: boolean;
  // 是否默认表单项，会永远展示在外侧
  isDefault?: boolean;
  // 清空的默认值，若配置了initialValue，必须配置该项，不然清空操作会出错
  // deleteValue?: any;
}
export interface MoreFiltersProps {
  form: FormInstance;
  config: MixcFilterItem[];
  mapKey: string;
  sumCount: number;
  extraDom?: React.ReactNode;
  showBottomLine?: boolean;
  showMore?: boolean;
  // Form默认值
  initialFormValues?: any;
  // form值变化时触发
  onFilter?: () => void;
  // 组件渲染初始化回调，有且仅调用一次，或者组件从cache中取到筛选值后触发，或者组件初始化完毕触发
  onCacheInitial?: () => void;
  // 内侧点击重置时触发
  onReset?: () => void;
  // 内侧点击确定时触发
  onOk?: () => void;
  // 外侧点击清空按钮时触发
  onClear?: () => void;
}

export const FilterBottomLine:any = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 12px;
  background: ${colors?.fill_brand_6};
  border-radius: 6px;
  margin-top: 12px;
  white-space: nowrap;
  width: 100%;
  overflow-x:auto;
  .sum-text{
    color: ${colors.font_brand_2};
  }
  .delete{
    cursor: pointer;
    color: ${colors.font_brand_2};
  }
  .value-text{
    color: ${colors.orange};
  }
  .item-box{
    background: ${colors.white};
    padding: 2px 4px;
    border-radius: 3px;
    color: ${colors.font_gray_3};
    span{
      line-height: 20px;
    }
  }
`;
const FlexDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
export interface MoreFiltersRefProps {
  refreshCache: () => void;
}
const MoreFilters = forwardRef<MoreFiltersRefProps, MoreFiltersProps>(({
  form, config, mapKey, sumCount, onFilter, onReset, onOk, onCacheInitial, onClear, extraDom, initialFormValues, showMore = true, showBottomLine = true,
}: MoreFiltersProps, ref) => {
  const [refreshId, setRefreshId] = useState(nanoid());
  const [usefullOpen, setUsefullOpen] = useState(false);
  const [outerItems, setOuterItems] = useState<MixcFilterItem[]>([]);
  const [innerItems, setInnerItems] = useState<MixcFilterItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [useFullList, setUseFullList] = useState<string[]>([]);
  const [initialTag, setInitialTag] = useState(true);
  const filterMapKeyValue = `${mapKey}-filter`;
  const filterMapKeyOuter = `${mapKey}-filter-outer`;

  const setCache = () => {
    if (filterMapKeyValue) {
      store.set(filterMapKeyValue, form.getFieldsValue());
    }
  };

  useImperativeHandle(ref, () => {
    return {
      // 手动更新缓存，在外侧自己form.setFieldValue的情况下，不会触发Form的onValuesChange事件去更新缓存，需要手动更新缓存
      refreshCache() {
        setCache();
      },
    };
  }, []);

  const refreshBottomLine = () => {
    setRefreshId(nanoid());
  };
  
  const emitChange = () => {
    onFilter?.();
    refreshBottomLine();
  };
  
  const drawerCloseHandler = () => {
    setDrawerOpen(false);
  };
  
  const okHandle = () => {
    setCache();
    drawerCloseHandler();
    emitChange();
    onOk?.();
  };

  const drawerOpenHandler = () => {
    setDrawerOpen(true);
  };

  const resetHandle = () => {
    form.resetFields();
    onReset?.();
    setCache();
    emitChange();
  };

  const deleteAllHanlder = () => {
    config.forEach(item => {
      form.setFieldsValue({
        [item.props.name]: /*  item?.deleteValue ?? */ undefined,
      });
    });
    setCache();
    onClear?.();
    onFilter?.();
    refreshBottomLine();
  };

  const deleteFilterItem = (name: FormItemProps['name']) => {
    form.setFieldsValue({
      [name]: undefined,
    });
    setCache();
    emitChange();
  };

  const usefullOkHandler = () => {
    if (filterMapKeyOuter) {
      setOuterItems(config?.filter(item => useFullList?.includes(item.props.name) || item.isDefault));
      setInnerItems(config?.filter(item => !useFullList?.includes(item.props.name) && !item.isDefault));
      store.set(filterMapKeyOuter, useFullList);
    }

    setUsefullOpen(false);
  };

  useEffect(()=>{
    // 只在组件首次加载initialTag=true的时候，将localstorage缓存的值赋值给form，达到记忆回填的效果
    // 而后form值交由外侧控制，里侧不做form值控制除了清除操作
    if (filterMapKeyValue && localStorage?.getItem(filterMapKeyValue) && initialTag) {
      let cacheData = store.get(filterMapKeyValue) || [];
      if (JSON.stringify(cacheData) === '{}') {
        // 如果是进行过清空操作的，将默认initial值项要置空
        config.forEach(item => {
          form.setFieldsValue({
            [item.props.name]: /* item?.deleteValue ?? */ undefined,
          });
        });
      } else {
        config.forEach(item => {
          const value = cacheData?.[item.props.name] ?? undefined;
          form.setFieldsValue({
            [item.props.name]: item.formValueFormat && value ? item.formValueFormat(value) : value,
          });
        });
        // form.setFieldsValue(cacheData);
      }

      // 表单内容变化，单独触发外侧回调
      onCacheInitial?.();
      onFilter?.();
      setInitialTag(false);
    } else if (initialTag) {
      // 初始化触发外侧回调
      onCacheInitial?.();
      onFilter?.();
      setInitialTag(false);
    }
  }, [config]);

  useEffect(() => {
    // 生成inner和outer列表（从缓存或者初始化），后续的InnerFormItemsDom和OuterFormItemsDom都是需要根据config实时变化而变化的，不然会出现：异步回来的options不填入，form.set后值未生效等等问题
    // 顺便从缓存中读取列表，目的是setInnerItems、setOuterItems，需要实时更新，不像缓存赋值一样一次即可
    if (filterMapKeyOuter && localStorage?.getItem(filterMapKeyOuter)) {
      let cacheOuter = store.get(filterMapKeyOuter) || [];
      setInnerItems(config?.filter(item => !cacheOuter?.includes(item.props.name) && !item.isDefault));
      setOuterItems(config?.filter(item => cacheOuter?.includes(item.props.name) || item.isDefault));
      setUseFullList(cacheOuter);
    } else {
      // 无缓存，则default在外，非default在内
      setInnerItems(config?.filter(item => !item.isDefault));
      setOuterItems(config?.filter(item => item.isDefault));
      setUseFullList([]);
    }

    // config变化，单独触发下方line更新
    refreshBottomLine();
  }, [config]);

  const BottomItemsDom = useMemo(() => innerItems?.map(({ props: { label, name }, lineRender }, index) => {
    const value = form?.getFieldValue(name);

    if (!value || value?.length === 0) {
      // 有值，则展示
      return null;
    }

    return (
      <Space className="item-box" key={index}>
        <span>
          {lineRender?.leftName || label}
          :
        </span>
        <span style={{ color: colors.orange }}>{lineRender?.rightValueFommat ? lineRender.rightValueFommat(value) : value}</span>
        <CloseOutlined onClick={() => {
          deleteFilterItem(name);
        }}
        />
      </Space>
    );
  }), [refreshId, innerItems]);

  const hasInnerValue = useMemo(() => {
    return innerItems.findIndex(({ props: { name } }) => {
      let tag = true;
      const value = form?.getFieldValue(name);
      if (value?.length === 0 || !value) tag = false;
      return tag;
    }) > -1;
  }, [form, innerItems, refreshId]);

  // 抽屉中的form dom
  const InnerFormItemsDom = innerItems?.map((item, index) => {
    if (item.isHide || item.isDefault) {
      return null;
    }

    return (
      <Form.Item
        key={index}
        labelCol={{ span: 24 }}
        {...item.props}
      >
        {item.render}
      </Form.Item>
    );
  });
  // 外侧default&设置常用的form dom
  const OuterFormItemsDom = outerItems?.map((item, index) => {
    if (item.isHide) {
      return null;
    }

    return (
      <Form.Item
        key={index}
        {...item.props}
        label={undefined}
      >
        {item.render}
      </Form.Item>
    );
  });

  const Footer = (
    <Flex justify="space-between">
      <div className="left">
        <Button
          type="link"
          style={{ padding: 0 }}
          icon={<SettingOutlined />}
          onClick={() => {
            setUsefullOpen(true);
          }}
        >
          设置常用筛选项
        </Button>
      </div>
      <Space className="right">
        <Button type="default" onClick={drawerCloseHandler}>取消</Button>
        <Button type="default" onClick={resetHandle}>重置</Button>
        <Button type="primary" onClick={okHandle}>确定</Button>
      </Space>

    </Flex>
  );

  return (
    <>
      <Form
        initialValues={initialFormValues ?? undefined}
        form={form}
        onValuesChange={(changedValues: any) => {
          const [changeKey] = Object.keys(changedValues);
          if (changeKey && outerItems?.find(item => item.props.name === changeKey)) {
            // 外侧表单值变化，同时触发回调和下方渲染
            setCache();
            emitChange();
          }
        }}
      >
        {/* 外侧表单 */}
        <Flex justify="space-between">
          <Space>
            {/* <Form form={form} layout='horizontal'> */}
            {OuterFormItemsDom}
            {/* </Form> */}
            {
              showMore && (
                <Button icon={<FilterOutlined />} type="primary" ghost onClick={drawerOpenHandler}>
                  更多筛选(
                  {innerItems?.length}
                  )
                </Button>
              )
            }
          </Space>
          {extraDom}
        </Flex>

        {/* 更多抽屉 */}
        <Drawer
          title="筛选"
          closeIcon={false}
          footer={Footer}
          open={drawerOpen}
          onClose={drawerCloseHandler}
          forceRender
          extra={<CloseOutlined style={{ cursor: 'pointer' }} onClick={drawerCloseHandler} />}
        >
          {/* <Form form={form} layout='vertical'> */}
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            {InnerFormItemsDom}
          </Space>
          {/* </Form> */}
        </Drawer>
      </Form>

      {/* 底部列表 */}
      {
        showBottomLine && hasInnerValue && (
          <FilterBottomLine>
            <Space>
              <div>
                共
                {sumCount}
                条
              </div>
              {BottomItemsDom}
              <FlexDiv
                onClick={() => {
                  deleteAllHanlder();
                }}
                className="delete"
              >
                <DeleteOutlined />
                <span>清空</span>
              </FlexDiv>
            </Space>
          </FilterBottomLine>
        )
      }

      {/* 设置常用筛选modal */}
      <Modal
        open={usefullOpen}
        onCancel={() => {
          setUsefullOpen(false);
        }}
        title="设置常用筛选项"
        onOk={usefullOkHandler}
      >
        <TipsLine text="将筛选项固定在外部筛选栏，最多 3 项" outerStyle={{ margin: '15px 0 15px 0' }} />
        {/* 根据config生成多选组，除去isDefault属性为真的item */}
        <CheckboxGroup
          value={useFullList}
          onChange={(value: string[]) => {
            setUseFullList(value);
          }}
          style={{width: '100%'}}
        >

          <Row >
            {
              config?.filter(item => !item.isDefault)?.map((item, index)=>(
                <Col span={8} key={(item?.props?.name || index) as string} style={{ marginBottom: 12, flexWrap: 'nowrap' }}>
                  <Checkbox
                    value={item?.props?.name}
                    disabled={useFullList?.length >= 3 && !useFullList?.includes(item?.props?.name)}
                  >
                    {item?.props?.label}
                  </Checkbox>
                </Col>
              ))
            }
          </Row>

        </CheckboxGroup>
      </Modal>
    </>
  );
});
export default MoreFilters;
