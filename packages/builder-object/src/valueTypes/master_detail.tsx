import React from 'react';
import {LookupField} from './lookup'

// 和lookup相同
export const master_detail = {
  render: (text: any, props: any) => {
      return (<LookupField {...props} mode="read"></LookupField>)
  },
  renderFormItem: (text: any, props: any) => {
      return (<LookupField {...props} mode="edit"></LookupField>)
  }
}