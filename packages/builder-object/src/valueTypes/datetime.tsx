import React from 'react';
import ProField from "@ant-design/pro-field";

// 日期时间类型字段
// value 值为GMT标准时间
export const datetime = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='dateTime' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='dateTime' {...props} />
    )
  }
}