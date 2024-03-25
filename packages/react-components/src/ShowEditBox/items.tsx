import {
  Col, Form, type FormInstance, type FormItemProps, type FormProps, Row,
} from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';

export interface Item {
  props: FormItemProps;
  render: React.ReactNode;
  // 非form编辑态展示渲染格式
  showRender?: {
    // 左侧名称，默认取props.label
    leftName?: string | React.ReactNode;
    // 右侧展示值格式化方法，value为表单项对应值
    rightValueFommat?: (value: any) => string;
  };
  // 表单项占用的列数
  formColSpan?: number;
  // 非form编辑态展示占用的列数
  showColSpan?: number;
  // 非form编辑态label展示占用的列数
  showLabelColSpan?: number;
  // 是否隐藏展示态，但是编辑态有
  hideShow?: boolean;
}
export type BoxItem = Item | null | undefined;
export interface ShowEditBoxItemsProps {
  form: FormInstance;
  config: BoxItem[];
  isEdit: boolean;
  formProps?: FormProps;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
}
export default function ShowEditBoxItems({
  form, config, isEdit = false, formProps, labelStyle, valueStyle,
}: ShowEditBoxItemsProps) {
  const [refreshId, setRefreshId] = useState(nanoid());
  // const formV = form.getFieldsValue();
  const FormEditDom = useMemo(
    ()=> (
      <Row>
        {
          config?.map((item, index)=>{
            if (!item) return null;
            return (
              <Col span={item?.formColSpan ?? 12} key={index}>
                <Form.Item style={{ marginBottom: 20 }} {...item.props}>
                  {item.render}
                </Form.Item>
              </Col>
            );
          })
        }
      </Row>
    ),
    [config],
  );
  const ShowDom = useMemo(()=>{
    return (
      <Row>
        {
          config?.map((item, index)=>{
            if (item?.hideShow || !item) {
              return null;
            }

            const value = form.getFieldValue(item.props.name as string) || '-';

            return (
              <Col span={item?.showColSpan ?? 12} key={index} style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={item?.showLabelColSpan ?? 6} style={labelStyle}>{item?.showRender?.leftName ?? item.props.label}</Col>
                  <Col
                    span={item?.showLabelColSpan ? (24 - item?.showLabelColSpan) : 18}
                    style={{ whiteSpace: 'pre-wrap', ...valueStyle }}
                  >
                    {item?.showRender?.rightValueFommat ? item?.showRender?.rightValueFommat(value) : value}
                  </Col>
                </Row>
              </Col>
            );
          })
        }
      </Row>
    );
  }, [config, refreshId]);

  useEffect(()=>{
    setRefreshId(nanoid());
  }, [formProps?.initialValues]);

  return (
    <Form form={form}  labelCol={{ span: 6 }} labelAlign="left" {...formProps}>
      <div style={{ display: isEdit ? 'none' : 'block' }}>
        {ShowDom}
      </div>
      <div style={{ display: !isEdit ? 'none' : 'block' }}>
        {FormEditDom}
      </div>
    </Form>
  );
}
