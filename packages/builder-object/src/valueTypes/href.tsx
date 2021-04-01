import React from 'react'
import { Input } from 'antd';

export const href = {
  render: (text: any, { fieldProps }: any)=> {
    return (<a href={text}>{text}</a>)
  },
  renderFormItem: (_: any, props: any) => (
    <Input placeholder="请输入链接" {...props?.fieldProps} />
  ),
}

