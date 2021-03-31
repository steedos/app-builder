import React from 'react';

// 公式类型字段，编辑时只读。显示为文本
export const formula = {
  render: (text: any, props: any) => {
    return (<div>formula display</div>)
  },
  // 公式类型字段不需要编辑，显示为只读样式或隐藏。
  renderFormItem: (_: any, props: any) => {
    return (<div>formula edit</div>)
  }
}