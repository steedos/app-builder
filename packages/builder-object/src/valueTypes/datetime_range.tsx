import React from 'react';
import ProField from "@ant-design/pro-field";

export const datetime_range = {
  render: (text: any, props: any) => {
    return (
      <ProField mode='read' valueType='dateTimeRange' {...props} />
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <ProField mode='edit' valueType='dateTimeRange' {...props} />
    )
  }
}