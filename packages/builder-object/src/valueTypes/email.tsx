import React from 'react'
import { Input } from 'antd';

export const email = {
  render: (text: any, { fieldProps }: any)=> {
    const link = "mailto:" + text;
    return (<a href={link}>{text}</a>)
  },
  renderFormItem: (_: any, props: any) => (
    <Input placeholder="请输入邮箱地址" {...props?.fieldProps} />
  ),
}

