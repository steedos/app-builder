import React from 'react';
import ProField from "@ant-design/pro-field";

// 日期类型字段
// value 值为GMT标准时间的0点
export const date = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='date' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='date' {...props} />
    )
  }
}