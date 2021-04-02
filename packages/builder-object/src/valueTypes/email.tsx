import React from 'react'
import ProField from "@ant-design/pro-field";

export const email = {
  render: (text: any, { fieldProps }: any)=> {
    const link = "mailto:" + text;
    return (<a href={link}>{text}</a>)
  },
  renderFormItem: (_: any, props: any) => (
    <ProField mode='edit' valueType='text' {...props} />
  ),
}

