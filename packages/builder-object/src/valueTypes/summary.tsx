import React from 'react';
import ProField from "@ant-design/pro-field";

export const summary = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='text' {...props} />
    )
  },
  renderFormItem: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='text' {...props} />
    )
  }
}