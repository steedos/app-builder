import React from 'react';
import { FieldNumber } from "./number";

// 金额类型字段，跟数值字段比，只是默认小数位数变成2位了
// value 值为数字
// 编辑和显示时需要处理小数位数
export const currency = {
  render: (text: any, props: any) => {
    return (
      <FieldNumber mode='read' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <FieldNumber mode='edit' {...props} />
    )
  }
}