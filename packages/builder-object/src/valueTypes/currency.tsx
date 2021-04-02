import React from 'react';
import ProField from "@ant-design/pro-field";

// 数值类型字段
// value 值为数字
// 编辑和显示时需要处理小数位数
export const currency = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='digit' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='digit' {...props} />
    )
  }
}