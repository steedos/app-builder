import React from 'react'
import ProField from "@ant-design/pro-field";

export const textarea = {
  render: (text: any, props: any) => {
    <ProField mode='read' valueType='textarea' {...props} />
  },
  renderFormItem: (_: any, props: any) => (
    <ProField mode='edit' valueType='textarea' {...props} />
  ),
}

