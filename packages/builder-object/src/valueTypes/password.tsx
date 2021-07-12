import React from 'react';
import FieldPassword from "@ant-design/pro-field/es/components/Password";

import "./password.less"

export const password = {
  render: (text: any, props: any) => {
    return <FieldPassword text={text as string} {...props} />
  },
  renderFormItem: (text: any, props: any) => {
    return <FieldPassword text={text as string} {...props} />
  }
}