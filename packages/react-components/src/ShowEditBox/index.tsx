import { Button, Space, Flex } from 'antd';
import React, { type ReactNode } from 'react';
import ShowEditBoxItems,{ type ShowEditBoxItemsProps } from './items';
import styled from 'styled-components';
import { EditOutlined } from "@ant-design/icons";

interface ShowEditBoxOuterProps extends ShowEditBoxItemsProps {
  title: string | ReactNode;
  setIsEdit: (isEdit: boolean) => void;
  onSave: ()=>Promise<any>;
  onEditCancel: () => void;
  children?: ReactNode;
}
export const CardBoxDiv:any = styled.div`
  padding: 16px 18px 0 18px;
  border-radius: 12px;
  background-color: #F5F7F9;
  .label{
    color: #787889;
  }
  .value{
    color: #020913;
  }
`;

export default function ShowEditBoxOuter({
  form, config, isEdit = false, setIsEdit, title, onSave, onEditCancel, children, ...others
}: ShowEditBoxOuterProps) {
  return (
    <div>
      <Flex justify="space-between" style={{ marginBottom: 8 }}>
        {title}
        {
          !isEdit && (
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(!isEdit);
              }}
              type="link"
            >
              编辑
            </Button>
          )
        }
        {
          isEdit && (
            <Space>
              <Button
                onClick={() => {
                  onEditCancel();
                  setIsEdit(!isEdit);
                }}
              >
                取消
              </Button>
              <Button
                onClick={async () => {
                  await onSave();
                  setIsEdit(!isEdit);
                }}
                type="primary"
              >
                保存
              </Button>
            </Space>
          )
        }

      </Flex>
      <CardBoxDiv>
        {
          children
          ?? <ShowEditBoxItems {...others} form={form} config={config} isEdit={isEdit} labelStyle={{ color: '#787889' }} valueStyle={{ color: '#020913' }} />
        }
      </CardBoxDiv>
    </div>
  );
}
