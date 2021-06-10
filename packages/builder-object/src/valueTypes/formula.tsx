import React from 'react';
import ProField from "@ant-design/pro-field";

// 公式类型类型字段
// value 值为服务端自动生成的字符串
// 编辑时只读。显示时直接显示 value
export const formula = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='text' {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    return (
      <ProField valueType='text' {...props} mode='read' />
    )
  }
}