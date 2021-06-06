import React from 'react';
import ProField from "@ant-design/pro-field";

export const date_range = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='dateRange' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='dateRange' {...props} />
    )
  }
}