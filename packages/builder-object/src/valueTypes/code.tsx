import React from 'react'
import FieldCode from '@ant-design/pro-field/es/components/Code';

export const code = {
  render: (text: any, props: any) => {
    return (<FieldCode {...props} mode="read" />)
  },
  renderFormItem: (_: any, props: any) => {
    return (<FieldCode {...props} mode="edit" />)
  }
}

