import { Button, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
interface ClassesItemProps {
  content: string;
  onRemoveClass: (item: string) => void
}
const ClassesItem = ( { content, onRemoveClass}: ClassesItemProps ) => {

  return(
    <Tag closable onClose={(event) => onRemoveClass(content)}>
      {content}
    </Tag>
  )
}

export default ClassesItem;