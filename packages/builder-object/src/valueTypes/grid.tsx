import React from 'react';

// 表格类型字段，
// value格式：{ gridField: [{subField1: 666, subField2: 'yyy'}] }

export const grid = {
  render: (text: any, props: any) => {
    return (<div>调用 protable 的显示界面</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>调用 protable 的编辑界面</div>)
  }
}