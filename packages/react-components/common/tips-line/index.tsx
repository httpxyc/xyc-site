import React, { type CSSProperties, type ReactNode } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { colors } from '../../assets/color';
import styled from 'styled-components';

interface PropsType {
  text: string | ReactNode;
  ifIcon?: boolean;
  icon?: ReactNode;
  iconSize?: number;
  className?: string;
  outerStyle?: CSSProperties;
  fontSize?: number;
}
const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  background: ${colors.fill_4};
  gap: 8px;
  // margin-bottom: 20px;
  border-radius: 6px 6px 6px 6px;
  color: ${colors.font_gray_3}
`;
function TipsLine({
  text, icon, iconSize = 14, className, outerStyle, fontSize, ifIcon = true,
}: PropsType) {
  return (
    <Div className={className} style={outerStyle}>
      {
        ifIcon && (icon ?? <WarningOutlined style={{ color: colors.colorWarning, fontSize: iconSize }} />)
      }
      <span className={ifIcon ? 'ml8' : ''} style={{ fontSize }}>{text}</span>
    </Div>
  );
}

export default TipsLine;
