import React from 'react';

export const summary = {
  render: (text: any, props: any) => {
    return (<div>summary display</div>)
  },
  // 公式类型字段不需要编辑，显示为只读样式或隐藏。
  renderFormItem: (_: any, props: any) => {
    return (<div>summary edit</div>)
  }
}