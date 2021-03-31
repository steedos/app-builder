import React from 'react';

// 自动编号类型字段，编辑时只读。显示为文本
export const autonumber = {
  render: (text: any, props: any) => {
    return (<div>autonumber display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>autonumber edit</div>)
  }
}