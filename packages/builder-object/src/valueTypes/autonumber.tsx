import React from 'react';

// 自动编号类型字段
// value 值为服务端自动生成的字符串
// 编辑时只读。显示时直接显示 value
export const autonumber = {
  render: (text: any, props: any) => {
    return (<div>autonumber display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    return (<div>autonumber edit</div>)
  }
}