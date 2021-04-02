import React from 'react'
import { Field } from "@steedos/builder-form";

export const url = {
  render: (text: any, { fieldProps }: any)=> {
    return (<a href={text}>{text}</a>)
  },
  renderFormItem: (_: any, props: any) => (
    <Field type='text' {...props} />
  ),
}

