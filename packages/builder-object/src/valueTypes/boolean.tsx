import React from 'react'
import { Field } from "@steedos/builder-form";

export const boolean = {
  render: (text: any, props: any)=> {
    return (
      <span>{text}</span>
    )
  },
  renderFormItem: (_: any, props: any) => {
    return (
      <Field mode='edit' valueType='switch' {...props} />
    )
  },
}

